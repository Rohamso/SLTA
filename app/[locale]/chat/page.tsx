'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function ChatPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';

  const elementUrl = 'https://app.element.io/#/room/#lsta_org:matrix.org';
  const matrixToUrl = 'https://matrix.to/#/#lsta_org:matrix.org';

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Hero Section */}
      <section className="mb-8 pt-8 bg-black rounded-2xl p-10 border border-green-500/30">
        <div className="text-center mb-8">
          {/* Matrix icon */}
          <div className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
            {t('chat.title')}
          </h1>
          <p className="text-lg text-green-300/80 max-w-2xl mx-auto mb-8">
            {t('chat.subtitle')}
          </p>

          {/* Primary CTA */}
          <a
            href={elementUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl text-black font-bold text-lg transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-105"
          >
            {t('chat.openElement')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Security Notice */}
        <div className="max-w-3xl mx-auto bg-green-950/30 border border-green-500/20 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-green-400 font-semibold text-sm">{t('chat.encrypted')}</span>
          </div>
          <p className="text-green-300/60 text-sm">
            {t('chat.encryptedDesc')}
          </p>
        </div>
      </section>

      {/* How to Join */}
      <section className="mb-8 bg-black rounded-2xl p-10 border border-green-500/30">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
          {t('chat.helpTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-green-950/20 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 font-bold">1</span>
            </div>
            <h3 className="text-green-300 font-semibold mb-2">{t('chat.step1Title')}</h3>
            <p className="text-green-300/60 text-sm">{t('chat.step1Desc')}</p>
          </div>
          <div className="bg-green-950/20 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 font-bold">2</span>
            </div>
            <h3 className="text-green-300 font-semibold mb-2">{t('chat.step2Title')}</h3>
            <p className="text-green-300/60 text-sm">{t('chat.step2Desc')}</p>
          </div>
          <div className="bg-green-950/20 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 font-bold">3</span>
            </div>
            <h3 className="text-green-300 font-semibold mb-2">{t('chat.step3Title')}</h3>
            <p className="text-green-300/60 text-sm">{t('chat.step3Desc')}</p>
          </div>
        </div>
      </section>

      {/* Alternative Access */}
      <section className="mb-12 bg-black rounded-2xl p-10 border border-green-500/30">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
          {t('chat.altTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Element Web */}
          <a
            href={elementUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-green-950/20 border border-green-500/20 hover:border-green-500/50 rounded-xl p-6 text-center transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-green-300 font-semibold mb-1">{t('chat.webApp')}</h3>
            <p className="text-green-300/50 text-sm">{t('chat.webAppDesc')}</p>
          </a>

          {/* Any Matrix Client */}
          <a
            href={matrixToUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-green-950/20 border border-green-500/20 hover:border-green-500/50 rounded-xl p-6 text-center transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-green-300 font-semibold mb-1">{t('chat.matrixClient')}</h3>
            <p className="text-green-300/50 text-sm">{t('chat.matrixClientDesc')}</p>
          </a>
        </div>

        {/* Room address */}
        <div className="mt-8 text-center">
          <p className="text-green-300/50 text-sm mb-2">{t('chat.roomAddress')}</p>
          <code className="inline-block px-4 py-2 bg-green-950/50 border border-green-500/20 rounded-lg text-green-400 font-mono text-sm select-all">
            #lsta_org:matrix.org
          </code>
        </div>
      </section>
    </div>
  );
}
