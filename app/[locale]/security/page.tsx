'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function SecurityReportPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';

  const measures = [
    { icon: '[◆]', title: t('security.measure1Title'), desc: t('security.measure1Desc') },
    { icon: '[Ø]', title: t('security.measure2Title'), desc: t('security.measure2Desc') },
    { icon: '[■]', title: t('security.measure3Title'), desc: t('security.measure3Desc') },
    { icon: '[◎]', title: t('security.measure4Title'), desc: t('security.measure4Desc') },
    { icon: '[≡]', title: t('security.measure5Title'), desc: t('security.measure5Desc') },
    { icon: '[✓]', title: t('security.measure6Title'), desc: t('security.measure6Desc') },
  ];

  return (
    <div className={isRTL ? 'text-right' : ''}>
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-green-400">{t('security.title')}</h1>
        <p className="text-lg text-green-200/70 max-w-3xl">{t('security.subtitle')}</p>
        <p className="text-sm text-green-300/50 mt-2 font-mono">{t('security.lastUpdated')}</p>
      </div>

      {/* Security Overview */}
      <div className="mb-12 bg-green-950 border border-green-500/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-400 mb-4">{t('security.overviewTitle')}</h2>
        <p className="text-green-200/70 leading-relaxed">{t('security.overviewContent')}</p>
      </div>

      {/* Security Measures Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-green-400 mb-8">{t('security.measuresTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {measures.map((m, i) => (
            <div key={i} className="bg-black border border-green-500/30 rounded-lg p-6 hover:border-green-400 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400 flex-shrink-0">{m.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-green-300 mb-2">{m.title}</h3>
                  <p className="text-green-200/70 text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div className="mb-12 bg-black border border-green-500/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-400 mb-4">{t('security.infraTitle')}</h2>
        <p className="text-green-200/70 leading-relaxed mb-6">{t('security.infraContent')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-950 border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-mono text-green-400 mb-2">256-bit</div>
            <p className="text-green-300/70 text-sm">{t('security.infraEncryption')}</p>
          </div>
          <div className="bg-green-950 border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-mono text-green-400 mb-2">99.9%</div>
            <p className="text-green-300/70 text-sm">{t('security.infraUptime')}</p>
          </div>
          <div className="bg-green-950 border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-mono text-green-400 mb-2">0</div>
            <p className="text-green-300/70 text-sm">{t('security.infraBreaches')}</p>
          </div>
        </div>
      </div>

      {/* Incident Response */}
      <div className="mb-12 bg-black border border-green-500/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-400 mb-4">{t('security.incidentTitle')}</h2>
        <p className="text-green-200/70 leading-relaxed mb-4">{t('security.incidentContent')}</p>
        <div className="bg-green-950 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-300 text-sm font-mono">{t('security.incidentContact')}</p>
        </div>
      </div>

      {/* Vulnerability Disclosure */}
      <div className="bg-green-950 border border-green-500/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-400 mb-4">{t('security.disclosureTitle')}</h2>
        <p className="text-green-200/70 leading-relaxed">{t('security.disclosureContent')}</p>
      </div>
    </div>
  );
}
