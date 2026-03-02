import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

// Skip static generation due to dynamic client components and i18n
export const revalidate = 0;

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fa' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'fa' ? "انجمن فناوری ایران" : "Iranian Tech Association",
    description: locale === 'fa' ? "ایجاد اعتماد، امنیت و شفافیت" : "Building trust, security, and transparency",
  };
}

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  let messages: Record<string, any> = {};
  
  try {
    if (locale === 'en' || locale === 'fa') {
      messages = (
        await import(`../../public/locales/${locale}/common.json`)
      ).default;
    } else {
      messages = (
        await import('../../public/locales/en/common.json')
      ).default;
    }
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    try {
      messages = (
        await import('../../public/locales/en/common.json')
      ).default;
    } catch {
      messages = {};
    }
  }

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
              {children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
