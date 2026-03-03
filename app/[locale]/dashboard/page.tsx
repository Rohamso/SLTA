'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

interface Member {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  expertise: string;
  projectsInterest: string;
  securityLevel: 'publicAdvocate' | 'discreteContributor' | 'confidentialMember';
  createdAt: string;
}

interface Statistics {
  totalMembers: number;
  publicAdvocates: number;
  discreteContributors: number;
  confidentialMembers: number;
  recentMembers: Member[];
}

export default function DashboardPage() {
  const locale = useLocale();
  const isRTL = locale === 'fa';
  
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [, setLoading] = useState(false);
  const [securityFilter, setSecurityFilter] = useState<'all' | 'publicAdvocate' | 'discreteContributor' | 'confidentialMember'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const DASHBOARD_TOKEN = 'LSTA-Dashboard-2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_TOKEN) {
      setAuthenticated(true);
      setPassword('');
      fetchData();
    } else {
      alert('Invalid password');
      setPassword('');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'x-dashboard-token': DASHBOARD_TOKEN };
      
      // Fetch members
      const membersRes = await fetch('/api/dashboard', { headers, cache: 'no-store' });
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data);
      }
      
      // Fetch statistics
      const statsRes = await fetch('/api/dashboard?action=statistics', {
        method: 'POST',
        headers,
        cache: 'no-store',
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      alert(`Dashboard fetch error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesFilter = securityFilter === 'all' || member.securityLevel === securityFilter;
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSecurityLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      publicAdvocate: locale === 'en' ? 'Public Advocate' : 'طرفدار عمومی',
      discreteContributor: locale === 'en' ? 'Discrete Contributor' : 'مشارک محفوظ',
      confidentialMember: locale === 'en' ? 'Confidential Member' : 'عضو محرمانه',
    };
    return labels[level] || level;
  };

  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isRTL ? 'text-right' : ''}`}>
        <div className="bg-black border border-green-500/30 rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-green-400 mb-2">
            {locale === 'en' ? 'Dashboard' : 'داشبورد'}
          </h1>
          <p className="text-green-200/70 mb-6">
            {locale === 'en' ? 'Enter the dashboard password to access member information.' : 'برای دسترسی به اطلاعات اعضا رمز عبور داشبورد را وارد کنید.'}
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-green-300 mb-2">
                {locale === 'en' ? 'Password' : 'رمز عبور'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={locale === 'en' ? 'Enter password' : 'رمز عبور را وارد کنید'}
                className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-100 placeholder-green-700"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-black rounded-lg font-bold hover:bg-green-500 transition"
            >
              {locale === 'en' ? 'Access Dashboard' : 'دسترسی به داشبورد'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Header */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            {locale === 'en' ? 'Member Dashboard' : 'داشبورد اعضا'}
          </h1>
          <p className="text-green-200/70">
            {locale === 'en' ? 'Manage and monitor all organization members.' : 'مدیریت و نظارت بر تمام اعضای سازمان.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-900/50 transition"
          >
            {locale === 'en' ? '↻ Refresh' : '↻ بروزرسانی'}
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-900/50 transition"
          >
            {locale === 'en' ? 'Logout' : 'خروج'}
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-green-950 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300/70 text-sm font-semibold mb-2">
              {locale === 'en' ? 'Total Members' : 'کل اعضا'}
            </p>
            <p className="text-4xl font-bold text-green-400">{stats.totalMembers}</p>
          </div>
          <div className="bg-green-950 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300/70 text-sm font-semibold mb-2">
              {locale === 'en' ? 'Public Advocates' : 'طرفداران عمومی'}
            </p>
            <p className="text-4xl font-bold text-green-400">{stats.publicAdvocates}</p>
          </div>
          <div className="bg-green-950 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300/70 text-sm font-semibold mb-2">
              {locale === 'en' ? 'Discrete Contributors' : 'مشارکین محفوظ'}
            </p>
            <p className="text-4xl font-bold text-green-400">{stats.discreteContributors}</p>
          </div>
          <div className="bg-green-950 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300/70 text-sm font-semibold mb-2">
              {locale === 'en' ? 'Confidential Members' : 'اعضای محرمانه'}
            </p>
            <p className="text-4xl font-bold text-green-400">{stats.confidentialMembers}</p>
          </div>
        </div>
      )}

      {/* Members Section */}
      <div className="bg-black border border-green-500/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-400 mb-6">
          {locale === 'en' ? 'All Members' : 'تمام اعضا'}
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-green-300 mb-2">
              {locale === 'en' ? 'Search' : 'جستجو'}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'en' ? 'Search by name, email, or organization...' : 'جستجو بر اساس نام، ایمیل یا سازمان...'}
              className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 text-green-100 placeholder-green-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-green-300 mb-2">
              {locale === 'en' ? 'Security Level' : 'سطح امنیتی'}
            </label>
            <select
              value={securityFilter}
              onChange={(e) => setSecurityFilter(e.target.value as any)}
              className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 text-green-100"
            >
              <option value="all">{locale === 'en' ? 'All Levels' : 'تمام سطوح'}</option>
              <option value="publicAdvocate">{getSecurityLevelLabel('publicAdvocate')}</option>
              <option value="discreteContributor">{getSecurityLevelLabel('discreteContributor')}</option>
              <option value="confidentialMember">{getSecurityLevelLabel('confidentialMember')}</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-950 border-b border-green-500/30">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-400">{locale === 'en' ? 'Name' : 'نام'}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-400">{locale === 'en' ? 'Email' : 'ایمیل'}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-400">{locale === 'en' ? 'Expertise' : 'تخصص'}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-400">{locale === 'en' ? 'Organization' : 'سازمان'}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-400">{locale === 'en' ? 'Level' : 'سطح'}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-400">{locale === 'en' ? 'Joined' : 'عضويت'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-green-300/70">
                    {locale === 'en' ? 'No members found.' : 'هیچ عضوی یافت نشد.'}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-green-500/20 hover:bg-green-950/50">
                    <td className="px-6 py-4 text-sm text-green-300 font-medium">{member.fullName}</td>
                    <td className="px-6 py-4 text-sm text-green-200/70">{member.email}</td>
                    <td className="px-6 py-4 text-sm text-green-200/70">{member.expertise || '-'}</td>
                    <td className="px-6 py-4 text-sm text-green-200/70">{member.organization || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.securityLevel === 'publicAdvocate' ? 'bg-green-900/50 text-green-400 border border-green-500/30' :
                        member.securityLevel === 'discreteContributor' ? 'bg-green-900/50 text-green-300 border border-green-500/30' :
                        'bg-green-900/50 text-green-200 border border-green-500/30'
                      }`}>
                        {getSecurityLevelLabel(member.securityLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-green-200/70">
                      {new Date(member.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'fa-IR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
