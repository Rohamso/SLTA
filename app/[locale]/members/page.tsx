'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

interface PublicMember {
  id: string;
  fullName: string;
  expertise: string;
}

export default function MembersPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === 'fa';
  const [members, setMembers] = useState<PublicMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.expertise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Page Header */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-green-400">
          {locale === 'en' ? 'Public Members Directory' : 'فهرست اعضای عمومی'}
        </h1>
        <p className="text-xl text-green-200/70 max-w-3xl">
          {locale === 'en'
            ? 'Meet our public members who have chosen to share their expertise with the community.'
            : 'با اعضای عمومی ما آشنا شوید که تصمیم گرفته‌اند تخصص خود را با جامعه به اشتراک بگذارند.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-12">
        <input
          type="text"
          placeholder={locale === 'en' ? 'Search members by name or expertise...' : 'جستجو برای نام یا تخصص...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-lg text-green-100 placeholder-green-700"
        />
      </div>

      {/* Members Count */}
      <div className="mb-8 text-center">
        <p className="text-green-300/70">
          {filteredMembers.length} {locale === 'en' ? 'member' : 'عضو'}{filteredMembers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-green-300/70">{locale === 'en' ? 'Loading members...' : 'در حال بارگیری اعضا...'}</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-green-300/70">
            {members.length === 0
              ? (locale === 'en' ? 'No members yet. Be the first to join!' : 'هیچ عضوی وجود ندارد. اولین نفری باشید که به ما بپیوندد!')
              : (locale === 'en' ? 'No members match your search.' : 'هیچ عضوی با معیار جستجوی شما یافت نشد.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-6 hover:border-green-400 hover:shadow-lg hover:shadow-green-900/20 transition"
            >
              <h3 className="text-xl font-bold text-green-300 mb-2">{member.fullName}</h3>
              <p className="text-green-200/70 text-sm leading-relaxed">{member.expertise}</p>
            </div>
          ))}
        </div>
      )}

      {/* Join CTA */}
      <div className="mt-20 bg-green-950 border border-green-500/30 rounded-lg p-12 text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-4">
          {locale === 'en' ? 'Want to join our community?' : 'می‌خواهید به جامعه ما بپیوندید؟'}
        </h2>
        <p className="text-green-200/70 mb-6">
          {locale === 'en'
            ? 'Apply for membership and choose your participation level.'
            : 'برای عضویت درخواست دهید و سطح مشارکت خود را انتخاب کنید.'}
        </p>
        <button
          onClick={() => router.push(`/${locale}/membership`)}
          className="px-8 py-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition"
        >
          {locale === 'en' ? 'Join Now' : 'همین الان بپیوندید'}
        </button>
      </div>
    </div>
  );
}
