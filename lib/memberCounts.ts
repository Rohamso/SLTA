import { promises as fs } from 'node:fs';
import path from 'node:path';

export type SecurityLevel = 'publicAdvocate' | 'discreteContributor' | 'confidentialMember';

export interface MemberCounts {
  publicAdvocate: number;
  discreteContributor: number;
  confidentialMember: number;
}

const DATA_DIRECTORY = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIRECTORY, 'member-counts.json');

const DEFAULT_COUNTS: MemberCounts = {
  publicAdvocate: 5,
  discreteContributor: 1,
  confidentialMember: 0,
};

let updateQueue: Promise<void> = Promise.resolve();

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

export function normalizeSecurityLevel(value: string): SecurityLevel | null {
  if (value === 'publicAdvocate' || value === 'discreteContributor' || value === 'confidentialMember') {
    return value;
  }
  return null;
}

async function readCountsFromDisk(): Promise<MemberCounts> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<MemberCounts>;
    return normalizeCounts(parsed);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') {
      console.error('Failed to read member counts file, using defaults:', error);
    }
    return { ...DEFAULT_COUNTS };
  }
}

async function writeCountsToDisk(counts: MemberCounts): Promise<void> {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(counts, null, 2), 'utf8');
}

export async function getMemberCounts(): Promise<MemberCounts> {
  const counts = await readCountsFromDisk();
  try {
    await writeCountsToDisk(counts);
  } catch (error) {
    console.error('Failed to persist member counts defaults:', error);
  }
  return counts;
}

export async function incrementMemberCount(level: SecurityLevel): Promise<MemberCounts> {
  const operation = async (): Promise<MemberCounts> => {
    const counts = await readCountsFromDisk();
    counts[level] += 1;
    await writeCountsToDisk(counts);
    return counts;
  };

  const run = updateQueue.then(operation, operation);
  updateQueue = run.then(() => undefined, () => undefined);
  return run;
}
