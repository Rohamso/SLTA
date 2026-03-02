'use client';

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

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'fa' : 'en';
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = newLocale;
    const newPath = '/' + segments.join('/');
    router.push(newPath);
  };

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

          {/* Navigation */}
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
            <Link href={`/${locale}/members`} className="text-green-300/80 hover:text-green-400 transition font-medium text-sm">
              {locale === 'en' ? 'Members' : 'اعضا'}
            </Link>
          </nav>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-lg bg-green-900/50 hover:bg-green-900 transition font-semibold text-sm text-green-400 border border-green-500/30"
          >
            {locale === 'en' ? 'فارسی' : 'English'}
          </button>
        </div>
      </div>
    </header>
  );
}
