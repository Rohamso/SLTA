'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-green-500/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Privacy Statement */}
        <div className="bg-green-950 border border-green-500/30 rounded-lg p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="text-2xl flex-shrink-0 font-mono text-green-500">[■]</div>
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-bold text-lg text-green-400 mb-3">{t('footer.privacy')}</h3>
              <p className="text-green-200/70 text-sm leading-relaxed mb-3">
                {t('footer.noLogs')}
              </p>
              <p className="text-green-200/70 text-sm leading-relaxed">
                Your identity is protected at every level. We do not collect, store, or process identifying information beyond what is absolutely necessary, and all data is encrypted at rest using industry-leading protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="font-bold text-lg text-green-400 mb-4">Lion & Sun Tech Association</h3>
            <p className="text-green-200/70 text-sm leading-relaxed">
              Building trust and security within tech communities through institutional transparency and member privacy protection.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className={isRTL ? 'text-right md:order-3' : ''}>
            <h4 className="font-bold text-green-400 mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-green-300/70 hover:text-green-400 text-sm transition">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/membership`} className="text-green-300/70 hover:text-green-400 text-sm transition">
                  {t('nav.membership')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/trust`} className="text-green-300/70 hover:text-green-400 text-sm transition">
                  {t('nav.trust')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} className="text-green-300/70 hover:text-green-400 text-sm transition">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-green-300/70 hover:text-green-400 text-sm transition">
                  {t('nav.about')}
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Compliance */}
          <div className={isRTL ? 'text-right md:order-2' : ''}>
            <h4 className="font-bold text-green-400 mb-4">Security</h4>
            <ul className="space-y-2">
              <li className="text-green-200/70 text-sm flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{t('footer.noLogs')}</span>
              </li>
              <li className="text-green-200/70 text-sm flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>End-to-End Encryption</span>
              </li>
              <li className="text-green-200/70 text-sm flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Independent Audits</span>
              </li>
              <li className="text-green-200/70 text-sm flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Zero-Knowledge</span>
              </li>
            </ul>
          </div>

          {/* Contact & Verification */}
          <div className={isRTL ? 'text-right' : ''}>
            <h4 className="font-bold text-green-400 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-green-200/70">
              <li>
                <span className="font-semibold block text-green-300">Email</span>
                <li>
                  <Link href={`/${locale}/team`} className="text-green-300/70 hover:text-green-400 text-sm transition">Team</Link>
                </li>
                <span>contact@lionandsuntech.org</span>
              </li>
              <li>
                <span className="font-semibold block text-green-300">Location</span>
                <span>Secure & Decentralized</span>
              </li>
              <li className="pt-2">
                <span className="inline-block bg-green-900/50 text-green-400 px-3 py-1 rounded text-xs font-semibold border border-green-500/30">
                  [◆] Verified Secure
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Bottom Footer */}
        <div className="border-t border-green-500/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-green-300/70">
              <p>&copy; {currentYear} Lion & Sun Tech Association. {t('footer.copyright')}</p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href={`/${locale}/privacy`} className="text-green-300/70 hover:text-green-400 transition">Privacy Policy</Link>
              <Link href={`/${locale}/terms`} className="text-green-300/70 hover:text-green-400 transition">Terms of Service</Link>
              <Link href={`/${locale}/security`} className="text-green-300/70 hover:text-green-400 transition">Security Report</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
