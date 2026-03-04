'use client';

import { useTranslations, useLocale } from 'next-intl';
import MatrixChat from '@/components/Chat/MatrixChat';

export default function ChatPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';

  const elementUrl = 'https://app.element.io/#/room/#lsta-community:matrix.org';
  const matrixToUrl = 'https://matrix.to/#/#lsta-community:matrix.org';

  const chatLabels = {
    login: t('chat.login'),
    loginTitle: t('chat.loginTitle'),
    loginDesc: t('chat.loginDesc'),
    username: t('chat.username'),
    password: t('chat.password'),
    homeserver: t('chat.homeserver'),
    loginBtn: t('chat.loginBtn'),
    loggingIn: t('chat.loggingIn'),
    logout: t('chat.logout'),
    sendPlaceholder: t('chat.sendPlaceholder'),
    send: t('chat.send'),
    connecting: t('chat.connecting'),
    connected: t('chat.connectedStatus'),
    error: t('chat.errorStatus'),
    noMessages: t('chat.noMessages'),
    guestNotice: t('chat.guestNotice'),
    loginToChat: t('chat.loginToChat'),
    today: t('chat.today'),
    yesterday: t('chat.yesterday'),
  };

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Header */}
      <section className="mb-6 pt-8 bg-black rounded-2xl p-10 border border-green-500/30">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
            {t('chat.title')}
          </h1>
          <p className="text-lg text-green-300/80 max-w-2xl mx-auto">
            {t('chat.subtitle')}
          </p>
        </div>

        {/* Security Notice */}
        <div className="max-w-3xl mx-auto bg-green-950/30 border border-green-500/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-green-400 font-semibold text-sm">{t('chat.encrypted')}</span>
          </div>
          <p className="text-green-300/60 text-xs">
            {t('chat.encryptedDesc')}
          </p>
        </div>
      </section>

      {/* Embedded Chat */}
      <section className="mb-6 relative">
        <MatrixChat
          roomId="!ZwrpzQRLHNULWPPomM:matrix.org"
          roomDisplayName="General"
          labels={chatLabels}
          isRTL={isRTL}
        />
      </section>

      {/* How to Join + Alternative Access */}
      <section className="mb-8 bg-black rounded-2xl p-10 border border-green-500/30">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
          {t('chat.helpTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
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

        {/* Alternative access links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={elementUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-900/50 hover:bg-green-900 border border-green-500/30 rounded-lg text-green-400 font-semibold text-sm transition"
          >
            {t('chat.openElement')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href={matrixToUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-green-500/20 hover:border-green-500/40 rounded-lg text-green-300/70 hover:text-green-400 text-sm transition"
          >
            {t('chat.matrixClient')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Room address */}
        <div className="mt-6 text-center">
          <p className="text-green-300/50 text-xs mb-1">{t('chat.roomAddress')}</p>
          <code className="inline-block px-3 py-1.5 bg-green-950/50 border border-green-500/20 rounded-lg text-green-400 font-mono text-sm select-all">
            #lsta-community:matrix.org
          </code>
        </div>
      </section>
    </div>
  );
}
