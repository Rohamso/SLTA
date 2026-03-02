'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PillarState {
  [key: string]: boolean;
}

export function PledgeStepper({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations();
  const [accepted, setAccepted] = useState<PillarState>({
    pillar1: false,
    pillar2: false,
    pillar3: false,
    pillar4: false,
  });
  const [completed, setCompleted] = useState(false);

  const pillars = [
    { key: 'pillar1', title: t('pledge.pillar1.title'), description: t('pledge.pillar1.description') },
    { key: 'pillar2', title: t('pledge.pillar2.title'), description: t('pledge.pillar2.description') },
    { key: 'pillar3', title: t('pledge.pillar3.title'), description: t('pledge.pillar3.description') },
    { key: 'pillar4', title: t('pledge.pillar4.title'), description: t('pledge.pillar4.description') },
  ];

  const handleAccept = (pillarKey: string) => {
    setAccepted(prev => ({ ...prev, [pillarKey]: true }));
  };

  const allAccepted = Object.values(accepted).every(val => val === true);

  const handleProceed = () => {
    if (allAccepted) {
      setCompleted(true);
      onComplete();
    }
  };

  if (completed) {
    return (
      <div className="bg-green-950 border border-green-500/30 rounded-lg p-12 text-center">
        <div className="text-5xl mb-4 font-mono text-green-500">[✓]</div>
        <h3 className="text-3xl font-bold text-green-400 mb-2">{t('pledge.congratulations')}</h3>
        <p className="text-green-300 text-lg">{t('pledge.pledgeComplete')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-3">{t('pledge.title')}</h2>
        <p className="text-lg text-green-200/70 mb-3">{t('pledge.subtitle')}</p>
        <p className="text-sm text-green-300 bg-green-950 border border-green-500/30 rounded-lg p-3">{t('pledge.instruction')}</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 px-4 py-3 bg-black border border-green-500/30 rounded-lg">
        <span className="text-sm font-semibold text-green-300">
          Progress: <span className="text-green-400">{Object.values(accepted).filter(Boolean).length}/4</span>
        </span>
        <div className="flex-1 h-2 bg-green-950 rounded-full ml-4 overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(Object.values(accepted).filter(Boolean).length / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Pillars */}
      <div className="space-y-4">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.key}
            className={`p-6 border-2 rounded-lg transition-all ${
              accepted[pillar.key]
                ? 'border-green-500 bg-green-950/50'
                : 'border-green-800/50 bg-black hover:border-green-600'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                    accepted[pillar.key] ? 'bg-green-600 text-black' : 'bg-green-900/50 text-green-400'
                  }`}>
                    {accepted[pillar.key] ? '✓' : `0${index + 1}`}
                  </span>
                  <h3 className="text-xl font-bold text-green-300">{pillar.title}</h3>
                </div>
                <p className="text-green-200/70 leading-relaxed ml-11">{pillar.description}</p>
              </div>

              {!accepted[pillar.key] ? (
                <button
                  onClick={() => handleAccept(pillar.key)}
                  className="ml-4 px-6 py-2 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition whitespace-nowrap"
                >
                  ✓ {t('pledge.accept')}
                </button>
              ) : (
                <div className="ml-4 px-4 py-2 text-green-400 font-bold whitespace-nowrap">
                  ✓ Accepted
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status Messages */}
      {!allAccepted && (
        <div className="p-4 bg-green-950 border border-green-500/30 rounded-lg text-green-300">
          <p className="font-semibold flex items-center gap-2">
            <span className="font-mono text-green-500">[i]</span>
            {t('pledge.acceptAll')}
          </p>
        </div>
      )}

      {allAccepted && (
        <div className="p-4 bg-green-950 border border-green-500/30 rounded-lg text-green-400">
          <p className="font-semibold flex items-center gap-2">
            <span className="font-mono text-green-500">[✓]</span>
            All pillars accepted! Ready to proceed with membership.
          </p>
        </div>
      )}

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        disabled={!allAccepted}
        className={`w-full py-4 rounded-lg font-bold text-lg transition ${
          allAccepted
            ? 'bg-green-600 text-black hover:bg-green-500 cursor-pointer'
            : 'bg-green-900/30 text-green-700 cursor-not-allowed border border-green-800/50'
        }`}
      >
        {allAccepted ? '✓ Complete Pledge & Continue' : t('pledge.proceed')}
      </button>
    </div>
  );
}
