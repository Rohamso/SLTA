import { promises as fs } from 'node:fs';
import path from 'node:path';

export type SupportedLocale = 'en' | 'fa';

interface CountBucket {
  total: number;
  en: number;
  fa: number;
}

interface StoredImpressionData {
  version: number;
  totals: CountBucket;
  pages: Record<string, CountBucket>;
  daily: Record<string, CountBucket>;
  updatedAt: string;
}

export interface ImpressionSnapshot {
  totals: CountBucket;
  pages: Array<{ path: string } & CountBucket>;
  daily: Array<{ date: string } & CountBucket>;
  updatedAt: string;
}

interface SnapshotOptions {
  topPages?: number;
  recentDays?: number;
}

const STORAGE_FILE_NAME = 'impressions.json';
const DEFAULT_DATA_DIRECTORY = path.join(process.cwd(), 'data');
const TMP_DATA_DIRECTORY = path.join('/tmp', 'slta-data');

const EMPTY_BUCKET: CountBucket = {
  total: 0,
  en: 0,
  fa: 0,
};

const DEFAULT_DATA: StoredImpressionData = {
  version: 1,
  totals: { ...EMPTY_BUCKET },
  pages: {},
  daily: {},
  updatedAt: new Date(0).toISOString(),
};

let updateQueue: Promise<void> = Promise.resolve();
let preferredDataFile: string | null = null;
let volatileData: StoredImpressionData = cloneData(DEFAULT_DATA);

function asNonNegativeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function cloneData(data: StoredImpressionData): StoredImpressionData {
  return {
    version: data.version,
    totals: { ...data.totals },
    pages: Object.fromEntries(Object.entries(data.pages).map(([key, bucket]) => [key, { ...bucket }])),
    daily: Object.fromEntries(Object.entries(data.daily).map(([key, bucket]) => [key, { ...bucket }])),
    updatedAt: data.updatedAt,
  };
}

function normalizeBucket(input: Partial<CountBucket> | null | undefined): CountBucket {
  return {
    total: asNonNegativeNumber(input?.total),
    en: asNonNegativeNumber(input?.en),
    fa: asNonNegativeNumber(input?.fa),
  };
}

function normalizePathKey(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith('/')) {
    return null;
  }

  const normalized = trimmed === '/' ? '/' : trimmed.replace(/\/+$/g, '');
  if (normalized.length > 120) {
    return null;
  }

  if (!/^\/[a-zA-Z0-9/_-]*$/.test(normalized)) {
    return null;
  }

  return normalized;
}

function normalizeDateKey(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function normalizeData(input: unknown): StoredImpressionData {
  const candidate = (input && typeof input === 'object') ? (input as Partial<StoredImpressionData>) : {};
  const pagesSource = (candidate.pages && typeof candidate.pages === 'object') ? candidate.pages : {};
  const dailySource = (candidate.daily && typeof candidate.daily === 'object') ? candidate.daily : {};

  const pages: Record<string, CountBucket> = {};
  for (const [key, bucket] of Object.entries(pagesSource as Record<string, Partial<CountBucket>>)) {
    const normalizedKey = normalizePathKey(key);
    if (normalizedKey) {
      pages[normalizedKey] = normalizeBucket(bucket);
    }
  }

  const daily: Record<string, CountBucket> = {};
  for (const [key, bucket] of Object.entries(dailySource as Record<string, Partial<CountBucket>>)) {
    const normalizedKey = normalizeDateKey(key);
    if (normalizedKey) {
      daily[normalizedKey] = normalizeBucket(bucket);
    }
  }

  const updatedAt =
    typeof candidate.updatedAt === 'string' && !Number.isNaN(Date.parse(candidate.updatedAt))
      ? candidate.updatedAt
      : new Date(0).toISOString();

  return {
    version: asNonNegativeNumber(candidate.version) || 1,
    totals: normalizeBucket(candidate.totals),
    pages,
    daily,
    updatedAt,
  };
}

function candidateDataFiles(): string[] {
  const configuredDir = process.env.IMPRESSIONS_DIR?.trim();
  const directories = [
    configuredDir || null,
    DEFAULT_DATA_DIRECTORY,
    TMP_DATA_DIRECTORY,
  ].filter((entry): entry is string => Boolean(entry));

  return Array.from(new Set(directories.map((directory) => path.join(directory, STORAGE_FILE_NAME))));
}

function writeCandidates(): string[] {
  if (!preferredDataFile) {
    return candidateDataFiles();
  }

  const candidates = candidateDataFiles();
  return [preferredDataFile, ...candidates.filter((file) => file !== preferredDataFile)];
}

async function readDataFromDisk(): Promise<StoredImpressionData> {
  for (const file of candidateDataFiles()) {
    try {
      const raw = await fs.readFile(file, 'utf8');
      const parsed = JSON.parse(raw);
      const normalized = normalizeData(parsed);
      volatileData = cloneData(normalized);
      preferredDataFile = file;
      return normalized;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') {
        console.error(`Failed to read impressions from ${file}:`, error);
      }
    }
  }

  return cloneData(volatileData);
}

async function writeDataToDisk(data: StoredImpressionData): Promise<void> {
  const payload = JSON.stringify(data, null, 2);
  let lastError: unknown = null;

  for (const file of writeCandidates()) {
    try {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, payload, 'utf8');
      preferredDataFile = file;
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function persistData(data: StoredImpressionData): Promise<void> {
  try {
    await writeDataToDisk(data);
  } catch (error) {
    console.error('Failed to persist impression data, using in-memory fallback:', error);
  }
}

function incrementBucket(bucket: CountBucket, locale: SupportedLocale): CountBucket {
  return {
    total: bucket.total + 1,
    en: bucket.en + (locale === 'en' ? 1 : 0),
    fa: bucket.fa + (locale === 'fa' ? 1 : 0),
  };
}

function toPageRows(pages: Record<string, CountBucket>, topPages: number): Array<{ path: string } & CountBucket> {
  return Object.entries(pages)
    .map(([path, bucket]) => ({ path, ...bucket }))
    .sort((a, b) => b.total - a.total || a.path.localeCompare(b.path))
    .slice(0, topPages);
}

function toDailyRows(daily: Record<string, CountBucket>, recentDays: number): Array<{ date: string } & CountBucket> {
  const cutoffDate = new Date();
  cutoffDate.setUTCHours(0, 0, 0, 0);
  cutoffDate.setUTCDate(cutoffDate.getUTCDate() - (recentDays - 1));
  const cutoffTime = cutoffDate.getTime();

  return Object.entries(daily)
    .filter(([date]) => {
      const value = Date.parse(`${date}T00:00:00.000Z`);
      return !Number.isNaN(value) && value >= cutoffTime;
    })
    .map(([date, bucket]) => ({ date, ...bucket }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function toSnapshot(data: StoredImpressionData, options: SnapshotOptions): ImpressionSnapshot {
  const topPages = clampInteger(options.topPages ?? 20, 1, 100);
  const recentDays = clampInteger(options.recentDays ?? 30, 1, 120);

  return {
    totals: { ...data.totals },
    pages: toPageRows(data.pages, topPages),
    daily: toDailyRows(data.daily, recentDays),
    updatedAt: data.updatedAt,
  };
}

export function normalizeLocale(value: unknown): SupportedLocale | null {
  return value === 'en' || value === 'fa' ? value : null;
}

export function normalizePathname(pathname: unknown, locale: SupportedLocale): string | null {
  if (typeof pathname !== 'string') {
    return null;
  }

  let normalized = pathname.split('?')[0]?.split('#')[0]?.trim() ?? '';
  if (!normalized.startsWith('/')) {
    return null;
  }

  normalized = normalized.replace(/\/{2,}/g, '/');
  if (normalized === `/${locale}`) {
    normalized = '/';
  } else if (normalized.startsWith(`/${locale}/`)) {
    normalized = normalized.slice(locale.length + 1);
  }

  const cleanPath = normalizePathKey(normalized);
  if (!cleanPath) {
    return null;
  }

  if (cleanPath.startsWith('/api') || cleanPath.startsWith('/_next')) {
    return null;
  }

  return cleanPath;
}

export async function getImpressionSnapshot(options: SnapshotOptions = {}): Promise<ImpressionSnapshot> {
  const data = await readDataFromDisk();
  volatileData = cloneData(data);
  await persistData(data);
  return toSnapshot(data, options);
}

export async function recordImpression(pathname: string, locale: SupportedLocale): Promise<ImpressionSnapshot> {
  const operation = async (): Promise<ImpressionSnapshot> => {
    const data = await readDataFromDisk();

    const today = new Date().toISOString().slice(0, 10);
    const pageBucket = data.pages[pathname] ?? { ...EMPTY_BUCKET };
    const dailyBucket = data.daily[today] ?? { ...EMPTY_BUCKET };

    data.pages[pathname] = incrementBucket(pageBucket, locale);
    data.daily[today] = incrementBucket(dailyBucket, locale);
    data.totals = incrementBucket(data.totals, locale);
    data.updatedAt = new Date().toISOString();

    volatileData = cloneData(data);
    await persistData(data);

    return toSnapshot(data, {});
  };

  const run = updateQueue.then(operation, operation);
  updateQueue = run.then(() => undefined, () => undefined);
  return run;
}
