import fs from 'fs';
import path from 'path';

export interface Member {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  expertise: string;
  projectsInterest: string;
  securityLevel: 'publicAdvocate' | 'discreteContributor' | 'confidentialMember';
  createdAt: string;
}

// Resolve data file path robustly for different hosting environments
function resolveDataPath(): string {
  // 1. Explicit env var (most reliable)
  if (process.env.DATA_DIR) {
    return path.join(process.env.DATA_DIR, 'members-data.json');
  }
  
  // 2. Check if cwd is writable (works on cPanel, traditional hosting)
  const cwdPath = path.join(process.cwd(), 'members-data.json');
  try {
    fs.accessSync(process.cwd(), fs.constants.W_OK);
    return cwdPath;
  } catch {
    // cwd is read-only (serverless like Vercel/Lambda: /var/task/)
  }
  
  // 3. Fallback to /tmp/ (writable on serverless, but ephemeral)
  console.warn('Using /tmp/ for member data — data will not persist across cold starts');
  return path.join('/tmp', 'members-data.json');
}

const DATA_FILE = resolveDataPath();

function readStore(): Member[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading members data from', DATA_FILE, error);
  }
  return [];
}

function writeStore(members: Member[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2), 'utf-8');
    // Verify the write succeeded
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error('File was not created after writeFileSync');
    }
  } catch (error) {
    console.error('Error writing members data to', DATA_FILE, error);
    throw error; // Re-throw so API can report the error
  }
}

export function getMembers(): Member[] {
  return readStore();
}

export function addMember(member: Member): void {
  const members = readStore();
  members.push(member);
  writeStore(members);
}

export function getDataFilePath(): string {
  return DATA_FILE;
}

export function getDataFileStatus(): { path: string; exists: boolean; count: number; writable: boolean; cwd: string } {
  let writable = false;
  try {
    const dir = path.dirname(DATA_FILE);
    fs.accessSync(dir, fs.constants.W_OK);
    writable = true;
  } catch { /* not writable */ }
  
  return {
    path: DATA_FILE,
    exists: fs.existsSync(DATA_FILE),
    count: readStore().length,
    writable,
    cwd: process.cwd(),
  };
}

export function getPublicMembers() {
  return readStore()
    .filter(m => m.securityLevel === 'publicAdvocate')
    .map(m => ({
      id: m.id,
      fullName: m.fullName,
      expertise: m.expertise,
    }));
}

export function getStatistics() {
  const membersStore = readStore();
  return {
    totalMembers: membersStore.length,
    publicAdvocates: membersStore.filter(m => m.securityLevel === 'publicAdvocate').length,
    discreteContributors: membersStore.filter(m => m.securityLevel === 'discreteContributor').length,
    confidentialMembers: membersStore.filter(m => m.securityLevel === 'confidentialMember').length,
    recentMembers: membersStore.slice(-5).reverse(),
  };
}
