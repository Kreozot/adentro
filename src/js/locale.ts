type LocaleId = 'ru' | 'en';

const DEFAULT_LOCALE = 'ru';

interface TextLocales {
	ru: string;
	en: string;
}

export class Locale {
	_lang: LocaleId;

	constructor() {
		this._lang = DEFAULT_LOCALE;
	}

	get(textLocales: TextLocales): string {
		return textLocales[this.lang] || textLocales[DEFAULT_LOCALE];
	}

	set lang(localeId: LocaleId) {
		this._lang = localeId || DEFAULT_LOCALE;
	}

	get lang() {
		return this._lang;
	}
}

// Использование global для того, чтобы использовать модуль в разных бандлах
if (!window.adentroLocale) {
	window.adentroLocale = new Locale();
}

export default window.adentroLocale;
