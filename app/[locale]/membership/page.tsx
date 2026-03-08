'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PledgeStepper } from '@/components/Pledge/PledgeStepper';
import { MembershipForm } from '@/components/Forms/MembershipForm';

type SecurityLevel = 'publicAdvocate' | 'discreteContributor' | 'confidentialMember';

interface MemberCounts {
  publicAdvocate: number;
  discreteContributor: number;
  confidentialMember: number;
}

const EMPTY_COUNTS: MemberCounts = {
  publicAdvocate: 0,
  discreteContributor: 0,
  confidentialMember: 0,
};

function normalizeCounts(value: unknown): MemberCounts {
  if (!value || typeof value !== 'object') {
    return { ...EMPTY_COUNTS };
  }

  const candidate = value as Partial<MemberCounts>;
  return {
    publicAdvocate: typeof candidate.publicAdvocate === 'number' ? candidate.publicAdvocate : 0,
    discreteContributor: typeof candidate.discreteContributor === 'number' ? candidate.discreteContributor : 0,
    confidentialMember: typeof candidate.confidentialMember === 'number' ? candidate.confidentialMember : 0,
  };
}

export default function MembershipPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';
  const [pledgeComplete, setPledgeComplete] = useState(false);
  const [counts, setCounts] = useState<MemberCounts>(EMPTY_COUNTS);
  const [isCountsLoading, setIsCountsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      try {
        const response = await fetch('/api/members', { method: 'GET', cache: 'no-store' });
        const data = await response.json();
        if (response.ok && isMounted) {
          setCounts(normalizeCounts(data?.counts));
        }
      } catch (error) {
        console.error('Failed to load member counts:', error);
      } finally {
        if (isMounted) {
          setIsCountsLoading(false);
        }
      }
    };

    loadCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmitted = (updatedCounts: MemberCounts) => {
    setCounts(normalizeCounts(updatedCounts));
  };

  const securityLevelCards: Array<{ key: SecurityLevel; label: string }> = [
    { key: 'publicAdvocate', label: t('membership.publicAdvocate') },
    { key: 'discreteContributor', label: t('membership.discreteContributor') },
    { key: 'confidentialMember', label: t('membership.confidentialMember') },
  ];

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Member Counter */}
      <section className="mb-10 border border-green-500/30 rounded-lg bg-black/60 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">{t('membership.countsTitle')}</h2>
        <p className="text-green-200/70 mb-6">{t('membership.countsSubtitle')}</p>
        {isCountsLoading ? (
          <p className="text-green-300">{t('membership.countsLoading')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {securityLevelCards.map((item) => (
              <div key={item.key} className="border border-green-500/20 rounded-lg p-4 bg-green-950/20">
                <p className="text-sm text-green-200/70">{item.label}</p>
                <p className="text-3xl font-bold text-green-300">{counts[item.key]}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Page Header */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-green-400">{t('membership.title')}</h1>
        <p className="text-xl text-green-200/70 max-w-2xl">{t('membership.subtitle')}</p>
      </div>

      {!pledgeComplete ? (
        <div className="max-w-3xl mx-auto">
          <PledgeStepper onComplete={() => setPledgeComplete(true)} />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="mb-12 bg-green-950 border border-green-500/30 rounded-lg p-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl font-mono text-green-500">[✓]</span>
              <div>
                <h2 className="text-2xl font-bold text-green-400 mb-2">{t('pledge.congratulations')}</h2>
                <p className="text-green-300">{t('pledge.pledgeComplete')}</p>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="bg-black rounded-lg border border-green-500/30 p-8">
            <h2 className="text-2xl font-bold text-green-400 mb-6">Complete Your Membership</h2>
            <MembershipForm onSubmitted={handleSubmitted} />
          </div>
        </div>
      )}
    </div>
  );
}
