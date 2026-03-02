'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Hero Section */}
      <section className="mb-20 pt-8 bg-black rounded-2xl p-10 border border-green-500/30">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/Logo (2).png"
              alt="Lion & Sun Tech Association Logo"
              width={173}
              height={173}
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-green-400">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-green-300 font-semibold mb-4">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-green-200/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('home.mission')}
          </p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href={`/${locale}/membership`}
            className="px-8 py-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition"
          >
            {t('home.cta')} →
          </Link>
          <Link
            href={`/${locale}/trust`}
            className="px-8 py-3 bg-green-900/50 text-green-400 rounded-lg font-semibold hover:bg-green-900 transition border border-green-500/30"
          >
            {t('nav.trust')}
          </Link>
        </div>
      </section>

      {/* Foundation Articles */}
      <section className="mb-20 bg-black rounded-2xl p-10 border border-green-500/30">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-green-400">{t('home.articlesTitle')}</h2>
          <p className="text-lg text-green-200/70 max-w-3xl mx-auto">{t('home.articlesSubtitle')}</p>
        </div>

        <div className="space-y-6">
          {/* Article 1 */}
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 transition">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400 flex-shrink-0">§1</div>
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-2">{t('home.article1Title')}</h3>
                <p className="text-green-200/70 leading-relaxed">{t('home.article1Desc')}</p>
              </div>
            </div>
          </div>

          {/* Article 2 */}
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 transition">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400 flex-shrink-0">§2</div>
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-3">{t('home.article2Title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/50 border border-green-500/20 rounded-lg p-4">
                    <span className="text-green-400 font-mono text-sm">01</span>
                    <h4 className="text-green-300 font-bold mt-1">{t('home.article2p1Title')}</h4>
                    <p className="text-green-200/60 text-sm mt-1">{t('home.article2p1Desc')}</p>
                  </div>
                  <div className="bg-black/50 border border-green-500/20 rounded-lg p-4">
                    <span className="text-green-400 font-mono text-sm">02</span>
                    <h4 className="text-green-300 font-bold mt-1">{t('home.article2p2Title')}</h4>
                    <p className="text-green-200/60 text-sm mt-1">{t('home.article2p2Desc')}</p>
                  </div>
                  <div className="bg-black/50 border border-green-500/20 rounded-lg p-4">
                    <span className="text-green-400 font-mono text-sm">03</span>
                    <h4 className="text-green-300 font-bold mt-1">{t('home.article2p3Title')}</h4>
                    <p className="text-green-200/60 text-sm mt-1">{t('home.article2p3Desc')}</p>
                  </div>
                  <div className="bg-black/50 border border-green-500/20 rounded-lg p-4">
                    <span className="text-green-400 font-mono text-sm">04</span>
                    <h4 className="text-green-300 font-bold mt-1">{t('home.article2p4Title')}</h4>
                    <p className="text-green-200/60 text-sm mt-1">{t('home.article2p4Desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article 3 */}
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 transition">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400 flex-shrink-0">§3</div>
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-2">{t('home.article3Title')}</h3>
                <p className="text-green-200/70 leading-relaxed">{t('home.article3Desc')}</p>
              </div>
            </div>
          </div>

          {/* Article 4 */}
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 transition">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400 flex-shrink-0">§4</div>
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-3">{t('home.article4Title')}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-mono mt-0.5">•</span>
                    <p className="text-green-200/70 text-sm"><span className="text-green-300 font-semibold">{t('home.article4p1Title')}</span> {t('home.article4p1Desc')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-mono mt-0.5">•</span>
                    <p className="text-green-200/70 text-sm"><span className="text-green-300 font-semibold">{t('home.article4p2Title')}</span> {t('home.article4p2Desc')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-mono mt-0.5">•</span>
                    <p className="text-green-200/70 text-sm"><span className="text-green-300 font-semibold">{t('home.article4p3Title')}</span> {t('home.article4p3Desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="mb-20 flex justify-center items-center gap-8">
        <a
          href="https://x.com/LSTA_org"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-16 h-16 bg-black border border-green-500/30 rounded-full hover:border-green-400 hover:bg-green-950 transition"
          aria-label="X (Twitter)"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-green-400 group-hover:fill-green-300 transition" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href="https://instagram.com/LSTA_org"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-16 h-16 bg-black border border-green-500/30 rounded-full hover:border-green-400 hover:bg-green-950 transition"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-green-400 group-hover:fill-green-300 transition" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
      </section>

      {/* Technical Mandate - Why Join Us */}
      <section className="mb-20 bg-black rounded-2xl p-10 border border-green-500/30">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-green-400">{t('home.whyJoinUs')}</h2>
          <p className="text-lg text-green-200/70 max-w-3xl mx-auto">
            {t('home.whyJoinUsSubtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 hover:shadow-lg hover:shadow-green-900/20 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400">[✕]</div>
              <h3 className="text-xl font-bold text-green-300">{t('home.mandate1Title')}</h3>
            </div>
            <p className="text-green-200/70 leading-relaxed">{t('home.mandate1Desc')}</p>
          </div>
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 hover:shadow-lg hover:shadow-green-900/20 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400">[◆]</div>
              <h3 className="text-xl font-bold text-green-300">{t('home.mandate2Title')}</h3>
            </div>
            <p className="text-green-200/70 leading-relaxed">{t('home.mandate2Desc')}</p>
          </div>
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 hover:shadow-lg hover:shadow-green-900/20 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400">[≡]</div>
              <h3 className="text-xl font-bold text-green-300">{t('home.mandate3Title')}</h3>
            </div>
            <p className="text-green-200/70 leading-relaxed">{t('home.mandate3Desc')}</p>
          </div>
          <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8 hover:border-green-400 hover:shadow-lg hover:shadow-green-900/20 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-lg font-mono text-green-400">[◎]</div>
              <h3 className="text-xl font-bold text-green-300">{t('home.mandate4Title')}</h3>
            </div>
            <p className="text-green-200/70 leading-relaxed">{t('home.mandate4Desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
