'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export function TrustCenter() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';

  const features = [
    {
      icon: '[Ø]',
      titleKey: 'trust.noLogsPolicy',
      descKey: 'trust.noLogsDescription'
    },
    {
      icon: '[◆]',
      titleKey: 'trust.encryption',
      descKey: 'trust.encryptionDescription'
    },
    {
      icon: '[✓]',
      titleKey: 'trust.audit',
      descKey: 'trust.auditDescription'
    },
    {
      icon: '[◎]',
      titleKey: 'trust.jurisdiction',
      descKey: 'trust.jurisdictionDescription'
    }
  ];

  const transparencyItems = [
    {
      titleKey: 'trust.transparencyQuarterlyTitle',
      descKey: 'trust.transparencyQuarterlyDesc',
    },
    {
      titleKey: 'trust.transparencyRequestsTitle',
      descKey: 'trust.transparencyRequestsDesc',
    },
    {
      titleKey: 'trust.transparencyDataTitle',
      descKey: 'trust.transparencyDataDesc',
    },
    {
      titleKey: 'trust.transparencyAuditTitle',
      descKey: 'trust.transparencyAuditDesc',
    },
  ];

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Page Header */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-green-400">{t('trust.title')}</h1>
        <p className="text-xl text-green-200/70 max-w-3xl">{t('trust.subtitle')}</p>
      </div>

      {/* Digital Freedom Tools Section */}
      <div className="mb-16 bg-black rounded-2xl p-10 border border-green-500/30">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-green-400">{t('trust.digitalFreedom')}</h2>
          <p className="text-lg text-green-300/70 max-w-3xl">{t('trust.digitalFreedomSubtitle')}</p>
        </div>

        {/* BitChat - Secure Messaging */}
        <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-green-900/50 rounded-2xl flex items-center justify-center text-2xl font-mono text-green-400 flex-shrink-0">&gt;_</div>
            <div className="flex-1">
              <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">{t('trust.secureMessaging')}</span>
              <h3 className="text-2xl font-bold text-green-300 mt-1 mb-3">{t('trust.secureMessagingTitle')}</h3>
              <p className="text-green-200/70 leading-relaxed mb-5">{t('trust.secureMessagingDesc')}</p>
              <a
                href="https://bitchat.free/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition"
              >
                {t('trust.secureMessagingDownload')} ↗
              </a>
            </div>
          </div>
        </div>

        {/* Two Column: Outside Iran / Inside Iran */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Conduit - Outside Iran */}
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-xl p-8 flex flex-col">
            <span className="inline-block bg-green-900/50 text-green-400 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit border border-green-500/30">
              {t('trust.outsideIran')}
            </span>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400">[↗]</div>
              <h3 className="text-xl font-bold text-green-300">{t('trust.outsideIranTitle')}</h3>
            </div>
            <p className="text-green-200/70 leading-relaxed mb-5 flex-1">{t('trust.outsideIranDesc')}</p>
            <p className="text-sm text-green-400 font-medium mb-4 italic">{t('trust.outsideIranHelp')}</p>
            <a
              href="https://conduit.psiphon.ca/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition w-fit"
            >
              {t('trust.outsideIranAction')} ↗
            </a>
          </div>

          {/* Psiphon - Inside Iran */}
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-xl p-8 flex flex-col">
            <span className="inline-block bg-green-900/50 text-green-400 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit border border-green-500/30">
              {t('trust.insideIran')}
            </span>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400">[◇]</div>
              <h3 className="text-xl font-bold text-green-300">{t('trust.insideIranTitle')}</h3>
            </div>
            <p className="text-green-200/70 leading-relaxed mb-5 flex-1">{t('trust.insideIranDesc')}</p>
            <p className="text-sm text-green-400 font-medium mb-4 italic">{t('trust.insideIranHelp')}</p>
            <a
              href="https://psiphon.ca/en/download.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition w-fit"
            >
              {t('trust.insideIranAction')} ↗
            </a>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="bg-red-950/50 border border-red-500/40 rounded-xl p-6 flex items-start gap-4">
          <div className="text-xl flex-shrink-0 font-mono text-red-400">[!]</div>
          <div>
            <h3 className="font-bold text-red-400 mb-1">{t('trust.safetyNotice')}</h3>
            <p className="text-red-300/80 text-sm leading-relaxed">{t('trust.safetyNoticeText')}</p>
          </div>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 hover:shadow-lg hover:shadow-green-900/20 transition"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0 font-mono text-green-500">{feature.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-green-300">{t(feature.titleKey)}</h3>
                <p className="text-green-200/70 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Verification Section */}
      <div className="bg-green-600 text-black rounded-xl p-12 text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="text-5xl font-mono">[■]</div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('trust.badge')}</h2>
        <p className="text-lg text-green-950 mb-8 max-w-2xl mx-auto">{t('trust.badgeText')}</p>
        
        {/* Compliance Badges */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="bg-black/30 text-green-100 px-6 py-3 rounded-lg text-sm font-semibold">✓ ISO 27001</div>
          <div className="bg-black/30 text-green-100 px-6 py-3 rounded-lg text-sm font-semibold">✓ SOC 2 Type II</div>
          <div className="bg-black/30 text-green-100 px-6 py-3 rounded-lg text-sm font-semibold">✓ E2E Encrypted</div>
        </div>
      </div>

      {/* Transparency Report Section */}
      <div className="bg-green-950 border border-green-500/30 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-green-400">{t('trust.transparencyTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transparencyItems.map((item) => (
            <div key={item.titleKey} className="flex items-start gap-4">
              <span className="text-green-500 text-2xl font-bold flex-shrink-0">✓</span>
              <div>
                <h3 className="font-bold text-green-300 mb-1">{t(item.titleKey)}</h3>
                <p className="text-green-200/70 text-sm">{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition"
          >
            {t('trust.impressionsDashboard')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
