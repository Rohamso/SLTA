import getPool, { ensureTable } from './mongodb';
import { RowDataPacket } from 'mysql2';

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

let tableReady = false;
async function init() {
  if (!tableReady) {
    await ensureTable();
    tableReady = true;
  }
}

export async function getMembers(): Promise<Member[]> {
  await init();
  const db = getPool();
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT * FROM members ORDER BY createdAt DESC'
  );
  return rows as unknown as Member[];
}

export async function addMember(member: Member): Promise<void> {
  await init();
  const db = getPool();
  await db.execute(
    'INSERT INTO members (id, fullName, email, organization, expertise, projectsInterest, securityLevel, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [member.id, member.fullName, member.email, member.organization, member.expertise, member.projectsInterest, member.securityLevel, member.createdAt]
  );
}

export async function getPublicMembers() {
  await init();
  const db = getPool();
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT id, fullName, expertise FROM members WHERE securityLevel = ?',
    ['publicAdvocate']
  );
  return rows;
}

export async function getStatistics() {
  await init();
  const db = getPool();
  
  const [totals] = await db.execute<RowDataPacket[]>(
    `SELECT 
      COUNT(*) as totalMembers,
      SUM(securityLevel = 'publicAdvocate') as publicAdvocates,
      SUM(securityLevel = 'discreteContributor') as discreteContributors,
      SUM(securityLevel = 'confidentialMember') as confidentialMembers
    FROM members`
  );
  
  const [recent] = await db.execute<RowDataPacket[]>(
    'SELECT * FROM members ORDER BY createdAt DESC LIMIT 5'
  );

  const stats = totals[0];
  return {
    totalMembers: Number(stats.totalMembers),
    publicAdvocates: Number(stats.publicAdvocates),
    discreteContributors: Number(stats.discreteContributors),
    confidentialMembers: Number(stats.confidentialMembers),
    recentMembers: recent,
  };
}

export async function getDataFileStatus() {
  try {
    await init();
    const db = getPool();
    const [rows] = await db.execute<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM members');
    return {
      path: 'MySQL (Namecheap)',
      exists: true,
      count: Number(rows[0].cnt),
      writable: true,
      cwd: process.cwd(),
    };
  } catch (error) {
    return {
      path: 'MySQL (Namecheap)',
      exists: false,
      count: 0,
      writable: false,
      cwd: process.cwd(),
      error: String(error),
    };
  }
}
