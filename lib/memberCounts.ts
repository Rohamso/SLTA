import { promises as fs } from 'node:fs';
import path from 'node:path';

export type SecurityLevel = 'publicAdvocate' | 'discreteContributor' | 'confidentialMember';

export interface MemberCounts {
  publicAdvocate: number;
  discreteContributor: number;
  confidentialMember: number;
}

const COUNTS_FILE_NAME = 'member-counts.json';
const DEFAULT_DATA_DIRECTORY = path.join(process.cwd(), 'data');
const TMP_DATA_DIRECTORY = path.join('/tmp', 'slta-data');

const DEFAULT_COUNTS: MemberCounts = {
  publicAdvocate: 5,
  discreteContributor: 1,
  confidentialMember: 0,
};

let updateQueue: Promise<void> = Promise.resolve();
let volatileCounts: MemberCounts = { ...DEFAULT_COUNTS };
let preferredDataFile: string | null = null;

function asNonNegativeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}

function normalizeCounts(input: Partial<MemberCounts> | null | undefined): MemberCounts {
  return {
    publicAdvocate: asNonNegativeNumber(input?.publicAdvocate, DEFAULT_COUNTS.publicAdvocate),
    discreteContributor: asNonNegativeNumber(input?.discreteContributor, DEFAULT_COUNTS.discreteContributor),
    confidentialMember: asNonNegativeNumber(input?.confidentialMember, DEFAULT_COUNTS.confidentialMember),
  };
}

function candidateDataFiles(): string[] {
  const configuredDir = process.env.MEMBER_COUNTS_DIR?.trim();
  const directories = [
    configuredDir || null,
    DEFAULT_DATA_DIRECTORY,
    TMP_DATA_DIRECTORY,
  ].filter((item): item is string => Boolean(item));

  const files = directories.map((directory) => path.join(directory, COUNTS_FILE_NAME));
  return Array.from(new Set(files));
}

function writeCandidates(): string[] {
  if (!preferredDataFile) {
    return candidateDataFiles();
  }

  const files = candidateDataFiles();
  return [preferredDataFile, ...files.filter((file) => file !== preferredDataFile)];
}

export function normalizeSecurityLevel(value: string): SecurityLevel | null {
  if (value === 'publicAdvocate' || value === 'discreteContributor' || value === 'confidentialMember') {
    return value;
  }
  return null;
}

async function readCountsFromDisk(): Promise<MemberCounts> {
  for (const file of candidateDataFiles()) {
    try {
      const raw = await fs.readFile(file, 'utf8');
      const parsed = JSON.parse(raw) as Partial<MemberCounts>;
      const counts = normalizeCounts(parsed);
      volatileCounts = counts;
      preferredDataFile = file;
      return counts;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') {
        console.error(`Failed to read member counts from ${file}:`, error);
      }
    }
  }

  return { ...volatileCounts };
}

async function writeCountsToDisk(counts: MemberCounts): Promise<void> {
  const payload = JSON.stringify(counts, null, 2);
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

export async function getMemberCounts(): Promise<MemberCounts> {
  const counts = await readCountsFromDisk();
  volatileCounts = counts;
  try {
    await writeCountsToDisk(counts);
  } catch (error) {
    console.error('Failed to persist member counts, using in-memory fallback:', error);
  }
  return counts;
}

export async function incrementMemberCount(level: SecurityLevel): Promise<MemberCounts> {
  const operation = async () => {
    const counts = await readCountsFromDisk();
    const updatedCounts: MemberCounts = {
      ...counts,
      [level]: counts[level] + 1,
    };
    volatileCounts = updatedCounts;

    try {
      await writeCountsToDisk(updatedCounts);
    } catch (error) {
      console.error('Failed to persist incremented member counts, using in-memory fallback:', error);
    }

    return updatedCounts;
  };

  const run = updateQueue.then(operation, operation);
  updateQueue = run.then(() => undefined, () => undefined);
  return run;
}
