import getClientPromise from './mongodb';

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

async function getCollection() {
  const client = await getClientPromise();
  const db = client.db(process.env.MONGODB_DB || 'lsta');
  return db.collection<Member>('members');
}

export async function getMembers(): Promise<Member[]> {
  const collection = await getCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray() as unknown as Member[];
}

export async function addMember(member: Member): Promise<void> {
  const collection = await getCollection();
  await collection.insertOne(member as any);
}

export async function getPublicMembers() {
  const collection = await getCollection();
  return collection
    .find({ securityLevel: 'publicAdvocate' })
    .project({ id: 1, fullName: 1, expertise: 1, _id: 0 })
    .toArray();
}

export async function getStatistics() {
  const collection = await getCollection();
  const totalMembers = await collection.countDocuments();
  const publicAdvocates = await collection.countDocuments({ securityLevel: 'publicAdvocate' });
  const discreteContributors = await collection.countDocuments({ securityLevel: 'discreteContributor' });
  const confidentialMembers = await collection.countDocuments({ securityLevel: 'confidentialMember' });
  const recentMembers = await collection.find({}).sort({ createdAt: -1 }).limit(5).toArray();

  return {
    totalMembers,
    publicAdvocates,
    discreteContributors,
    confidentialMembers,
    recentMembers,
  };
}

export async function getDataFileStatus() {
  try {
    const collection = await getCollection();
    const count = await collection.countDocuments();
    return {
      path: 'MongoDB Atlas',
      exists: true,
      count,
      writable: true,
      cwd: process.cwd(),
    };
  } catch (error) {
    return {
      path: 'MongoDB Atlas',
      exists: false,
      count: 0,
      writable: false,
      cwd: process.cwd(),
      error: String(error),
    };
  }
}
