import Image from 'next/image';

const teamMembers = [
  {
    name: 'Roham Soleimani',
    title: 'Founding Member',
    email: 'roham@lionandsuntech.org',
    linkedin: 'https://www.linkedin.com/in/roham-soleimani/',
    image: '/images/team/roham.jpg', // Placeholder, update with real image if available
  },
  {
    name: 'Aria Ardalan',
    title: 'Founding Member',
    email: 'aria@lionandsuntech.org',
    linkedin: 'https://www.linkedin.com/in/aria-ardalan-002121a1/',
    image: '/images/team/aria.jpg', // Placeholder, update with real image if available
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold mb-8">Meet the Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teamMembers.map((member) => (
          <div key={member.email} className="bg-gray-900 rounded-lg p-6 flex flex-col items-center shadow-lg">
            <Image
              src={member.image}
              alt={member.name}
              width={120}
              height={120}
              className="rounded-full mb-4 border-4 border-green-500 object-cover"
            />
            <div className="text-xl font-semibold mb-1">{member.name}</div>
            <div className="text-green-400 mb-2">{member.title}</div>
            <a href={`mailto:${member.email}`} className="text-blue-400 underline mb-2">{member.email}</a>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-green-400 underline flex items-center gap-1">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
              LinkedIn
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
