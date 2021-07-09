const LOCALE_IDS = ['ru', 'en'] as const;
export type LocaleId = typeof LOCALE_IDS[number];

export const URL_LANG_PARAM = 'lang';

export type LocalizedString = {
  [key in LocaleId]: string;
};

export type MenuLocalizedString = LocalizedString & {
  es: string;
};

const RUSSIAN_SPEAKERS = ['ru', 'kz', 'by', 'ua'];

const getLocaleIdFromUrl = () => {
  const params = new URLSearchParams(document.location.search.substring(1));
  return params.get(URL_LANG_PARAM);
};

export const getLocaleId = (): LocaleId => {
  if (typeof window !== 'undefined') {
    const localeIdFromUrl = getLocaleIdFromUrl();
    if (LOCALE_IDS.includes(localeIdFromUrl as LocaleId)) {
      return localeIdFromUrl as LocaleId;
    }

    const browserLocale = window.navigator.language.slice(0, 2).toLowerCase();
    if (RUSSIAN_SPEAKERS.includes(browserLocale)) {
      return 'ru';
    }
  }
  return 'en';
};
