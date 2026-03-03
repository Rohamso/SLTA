import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export default function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || '',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'lsta',
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

// Auto-create the members table if it doesn't exist
export async function ensureTable(): Promise<void> {
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS members (
      id VARCHAR(64) PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      organization VARCHAR(255) DEFAULT '',
      expertise TEXT DEFAULT '',
      projectsInterest TEXT DEFAULT '',
      securityLevel VARCHAR(50) DEFAULT 'publicAdvocate',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
