'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = locale === 'fa';
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'fa' : 'en';
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = newLocale;
    const newPath = '/' + segments.join('/');
    router.push(newPath);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-black border-b border-green-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/images/Logo (2).png"
              alt="Lion & Sun Tech Association Logo"
              width={45}
              height={45}
              priority
              className="object-contain"
            />
            <div className="hidden sm:block">
              <span className="block font-bold text-lg text-green-400">{isRTL ? 'شیر و خورشید' : 'Lion & Sun'}</span>
              <span className="block text-xs text-green-300/70 leading-none">{isRTL ? 'انجمن تکنولوژی و فناوری' : 'Tech Association'}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex gap-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href={`/${locale}`} className="text-green-300/80 hover:text-green-400 transition font-medium text-sm">
              {t('nav.home')}
            </Link>
            <Link href={`/${locale}/membership`} className="text-green-300/80 hover:text-green-400 transition font-medium text-sm">
              {t('nav.membership')}
            </Link>
            <Link href={`/${locale}/trust`} className="text-green-300/80 hover:text-green-400 transition font-medium text-sm">
              {t('nav.trust')}
            </Link>
            <Link href={`/${locale}/chat`} className="text-green-300/80 hover:text-green-400 transition font-medium text-sm">
              {t('nav.chat')}
            </Link>
          </nav>

          {/* Right side: Language Toggle + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 sm:px-4 py-2 rounded-lg bg-green-900/50 hover:bg-green-900 transition font-semibold text-sm text-green-400 border border-green-500/30"
            >
              {locale === 'en' ? 'فارسی' : 'English'}
            </button>

            {/* Hamburger Button (mobile/tablet) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-11 h-11 rounded-lg border-2 border-green-500/50 bg-green-900/60 hover:bg-green-800 active:bg-green-700 transition-colors"
              aria-label="Toggle menu"
              type="button"
            >
              <span className={`block w-6 h-[3px] rounded-full bg-green-400 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-[3px] rounded-full bg-green-400 my-[4px] transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : ''}`} />
              <span className={`block w-6 h-[3px] rounded-full bg-green-400 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-green-500/30 bg-black/95 backdrop-blur-sm">
          <nav className={`flex flex-col px-4 py-4 gap-1 ${isRTL ? 'text-right' : ''}`}>
            <Link
              href={`/${locale}`}
              onClick={closeMenu}
              className="block px-4 py-3 text-green-300/80 hover:text-green-400 hover:bg-green-900/30 rounded-lg transition font-medium text-sm"
            >
              {t('nav.home')}
            </Link>
            <Link
              href={`/${locale}/membership`}
              onClick={closeMenu}
              className="block px-4 py-3 text-green-300/80 hover:text-green-400 hover:bg-green-900/30 rounded-lg transition font-medium text-sm"
            >
              {t('nav.membership')}
            </Link>
            <Link
              href={`/${locale}/trust`}
              onClick={closeMenu}
              className="block px-4 py-3 text-green-300/80 hover:text-green-400 hover:bg-green-900/30 rounded-lg transition font-medium text-sm"
            >
              {t('nav.trust')}
            </Link>
            <Link
              href={`/${locale}/chat`}
              onClick={closeMenu}
              className="block px-4 py-3 text-green-300/80 hover:text-green-400 hover:bg-green-900/30 rounded-lg transition font-medium text-sm"
            >
              {t('nav.chat')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
