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

// Shared in-memory member store
let membersStore: Member[] = [];

export function getMembers(): Member[] {
  return membersStore;
}

export function addMember(member: Member): void {
  membersStore.push(member);
}

export function getPublicMembers() {
  return membersStore
    .filter(m => m.securityLevel === 'publicAdvocate')
    .map(m => ({
      id: m.id,
      fullName: m.fullName,
      expertise: m.expertise,
    }));
}

export function getStatistics() {
  return {
    totalMembers: membersStore.length,
    publicAdvocates: membersStore.filter(m => m.securityLevel === 'publicAdvocate').length,
    discreteContributors: membersStore.filter(m => m.securityLevel === 'discreteContributor').length,
    confidentialMembers: membersStore.filter(m => m.securityLevel === 'confidentialMember').length,
    recentMembers: membersStore.slice(-5).reverse(),
  };
}
