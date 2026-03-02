'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PledgeStepper } from '@/components/Pledge/PledgeStepper';
import { MembershipForm } from '@/components/Forms/MembershipForm';

export default function MembershipPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';
  const [pledgeComplete, setPledgeComplete] = useState(false);

  return (
    <div className={isRTL ? 'text-right' : ''}>
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
            <MembershipForm />
          </div>
        </div>
      )}
    </div>
  );
}
