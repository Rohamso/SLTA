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

const DATA_FILE = path.join(process.cwd(), 'members-data.json');

function readStore(): Member[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading members data:', error);
  }
  return [];
}

function writeStore(members: Member[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing members data:', error);
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
