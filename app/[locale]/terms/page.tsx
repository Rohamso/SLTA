'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function TermsOfServicePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';

  const sections = [
    { title: t('terms.section1Title'), content: t('terms.section1Content') },
    { title: t('terms.section2Title'), content: t('terms.section2Content') },
    { title: t('terms.section3Title'), content: t('terms.section3Content') },
    { title: t('terms.section4Title'), content: t('terms.section4Content') },
    { title: t('terms.section5Title'), content: t('terms.section5Content') },
    { title: t('terms.section6Title'), content: t('terms.section6Content') },
    { title: t('terms.section7Title'), content: t('terms.section7Content') },
    { title: t('terms.section8Title'), content: t('terms.section8Content') },
  ];

  return (
    <div className={isRTL ? 'text-right' : ''}>
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-green-400">{t('terms.title')}</h1>
        <p className="text-lg text-green-200/70">{t('terms.subtitle')}</p>
        <p className="text-sm text-green-300/50 mt-2 font-mono">{t('terms.lastUpdated')}</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <div key={i} className="bg-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 transition">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center text-sm font-mono text-green-400 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-300 mb-3">{section.title}</h2>
                <p className="text-green-200/70 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-green-950 border border-green-500/30 rounded-lg p-6">
        <p className="text-green-300 text-sm font-mono">{t('terms.contact')}</p>
      </div>
    </div>
  );
}
