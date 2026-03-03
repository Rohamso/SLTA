'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function MembersPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === 'fa';

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Page Header */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-green-400">
          {locale === 'en' ? 'Membership' : 'عضویت'}
        </h1>
        <p className="text-xl text-green-200/70 max-w-3xl">
          {locale === 'en'
            ? 'Join the Lion & Sun Tech Association and be part of a community dedicated to digital freedom and technology innovation.'
            : 'به انجمن تکنولوژی و فناوری شیر و خورشید بپیوندید و بخشی از جامعه‌ای باشید که به آزادی دیجیتال و نوآوری فناوری اختصاص دارد.'}
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8">
          <span className="text-green-400 font-mono text-2xl">[◆]</span>
          <h3 className="text-xl font-bold text-green-300 mt-4 mb-2">
            {locale === 'en' ? 'Security First' : 'امنیت در اولویت'}
          </h3>
          <p className="text-green-200/70 text-sm">
            {locale === 'en'
              ? 'Choose your security level — from public advocate to fully confidential member.'
              : 'سطح امنیتی خود را انتخاب کنید — از مدافع عمومی تا عضو کاملاً محرمانه.'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8">
          <span className="text-green-400 font-mono text-2xl">[◎]</span>
          <h3 className="text-xl font-bold text-green-300 mt-4 mb-2">
            {locale === 'en' ? 'Digital Freedom Tools' : 'ابزارهای آزادی دیجیتال'}
          </h3>
          <p className="text-green-200/70 text-sm">
            {locale === 'en'
              ? 'Access resources and tools for secure communication and uncensored internet.'
              : 'دسترسی به منابع و ابزارها برای ارتباطات امن و اینترنت بدون سانسور.'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-950 to-black border border-green-500/30 rounded-lg p-8">
          <span className="text-green-400 font-mono text-2xl">[≡]</span>
          <h3 className="text-xl font-bold text-green-300 mt-4 mb-2">
            {locale === 'en' ? 'Community & Impact' : 'جامعه و تأثیر'}
          </h3>
          <p className="text-green-200/70 text-sm">
            {locale === 'en'
              ? 'Connect with like-minded technologists working toward a free and open internet for Iran.'
              : 'با فناوران همفکر که برای اینترنت آزاد و باز برای ایران تلاش می‌کنند ارتباط برقرار کنید.'}
          </p>
        </div>
      </div>

      {/* Join CTA */}
      <div className="bg-green-950 border border-green-500/30 rounded-lg p-12 text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-4">
          {locale === 'en' ? 'Ready to join?' : 'آماده عضویت هستید؟'}
        </h2>
        <p className="text-green-200/70 mb-6">
          {locale === 'en'
            ? 'Apply for membership and choose your participation level.'
            : 'برای عضویت درخواست دهید و سطح مشارکت خود را انتخاب کنید.'}
        </p>
        <button
          onClick={() => router.push(`/${locale}/membership`)}
          className="px-8 py-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition"
        >
          {locale === 'en' ? 'Join Now' : 'همین الان بپیوندید'}
        </button>
      </div>
    </div>
  );
}
