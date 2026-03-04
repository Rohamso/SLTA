'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function ChatPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';

  const roomId = '#lsta_org:matrix.org';
  const embedUrl = `https://app.element.io/#/room/${encodeURIComponent(roomId)}`;

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Header Section */}
      <section className="mb-8 pt-8 bg-black rounded-2xl p-10 border border-green-500/30">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
            {t('chat.title')}
          </h1>
          <p className="text-lg text-green-300/80 max-w-2xl mx-auto">
            {t('chat.subtitle')}
          </p>
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

      {/* Chat Embed */}
      <section className="mb-8">
        <div className="bg-black rounded-2xl border border-green-500/30 overflow-hidden">
          <iframe
            src={embedUrl}
            width="100%"
            height="650"
            className="border-0 rounded-2xl"
            allow="camera; microphone; fullscreen; encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
            title="LSTA Community Chat"
          />
        </div>
      </section>

      {/* Help Section */}
      <section className="mb-12 bg-black rounded-2xl p-10 border border-green-500/30">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
          {t('chat.helpTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="bg-green-950/20 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 font-bold">1</span>
            </div>
            <h3 className="text-green-300 font-semibold mb-2">{t('chat.step1Title')}</h3>
            <p className="text-green-300/60 text-sm">{t('chat.step1Desc')}</p>
          </div>
          {/* Step 2 */}
          <div className="bg-green-950/20 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 font-bold">2</span>
            </div>
            <h3 className="text-green-300 font-semibold mb-2">{t('chat.step2Title')}</h3>
            <p className="text-green-300/60 text-sm">{t('chat.step2Desc')}</p>
          </div>
          {/* Step 3 */}
          <div className="bg-green-950/20 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 font-bold">3</span>
            </div>
            <h3 className="text-green-300 font-semibold mb-2">{t('chat.step3Title')}</h3>
            <p className="text-green-300/60 text-sm">{t('chat.step3Desc')}</p>
          </div>
        </div>

        {/* Direct link fallback */}
        <div className="text-center mt-8">
          <p className="text-green-300/60 text-sm mb-3">{t('chat.directAccess')}</p>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-900/50 hover:bg-green-900 border border-green-500/30 rounded-lg text-green-400 font-semibold text-sm transition"
          >
            {t('chat.openElement')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
