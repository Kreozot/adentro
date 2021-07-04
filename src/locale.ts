export type LocaleId = 'ru' | 'en';

export type LocalizedString = {
  [key in LocaleId]: string;
};

export type MenuLocalizedString = LocalizedString & {
  es: string;
};
