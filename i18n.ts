import { getRequestConfig } from 'next-intl/server';

const loadMessages = async (locale: string) => {
  try {
    const messages = await import(`./public/locales/${locale}/common.json`);
    return messages.default || messages;
  } catch (error) {
    console.warn(`Messages for locale '${locale}' not found, using 'en'`);
    const enMessages = await import('./public/locales/en/common.json');
    return enMessages.default || enMessages;
  }
};

export default getRequestConfig(async (params) => {
  let locale = params.locale as string;
  
  if (!locale || (locale !== 'en' && locale !== 'fa')) {
    locale = 'en';
  }

  const messages = await loadMessages(locale);

  return {
    locale,
    messages
  };
});