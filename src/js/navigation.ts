import { MainClass, isAnimationVariantParamsArray } from "./types";
import locale from 'js/locale';

import schemes from './schemes';
const URI = require('urijs/src/URI.js');

const supportsHistoryApi = Boolean(window.history && window.history.pushState);

interface NavigationContext {
	schema?: string;
	lang?: string;
	animation?: string;
	music?: string;
	editor?: string;
}

export default class Navigation {
	context: NavigationContext;
	main: MainClass;
	currentScheme: string;

	constructor(main: MainClass) {
		this.context = {};
		this.main = main;

		const self = this;
		$('.dance-menu__link')
			.on('click', function () {
				const schemeId = $(this).data('scheme');
				if (self.currentScheme !== schemeId) {
					self.showSchema(schemeId);

					$('.dance-menu, .lang-links').removeClass('visible');
					$('.sidebar').removeClass('sidebar--open');
					$('.menu-icon').removeClass('menu-icon--open');
				}
			});
	}

	updateMenu(currentSchemeId: string): void {
		$(`.dance-menu__link:not([data-scheme=${currentSchemeId}])`)
			.removeClass('link--current');
		$(`.dance-menu__link[data-scheme=${currentSchemeId}]`)
			.addClass('link--current');
	}

	/**
	 * Загрузить схему
	 * @param  {String} name         Идентификатор схемы
	 * @param  {String} animationId  Идентификатор анимации
	 * @param  {String} musicId      Идентификатор композиции
	 */
	loadSchemaByName(name: string, animationId: string, musicId: string): void {
		const getSchemeParams = schemes[name] || schemes.chacarera;
		getSchemeParams((schemeParams) => {
			document.title = `${schemeParams.name} - ¡Adentro!`;
			this.main.loadSchema(schemeParams, musicId, animationId);
		});

		this.updateMenu(name);
		this.main.showLanguageLinks();
	}
	/**
	 * Загрузить редактор тайминга
	 * @param  {String} name     Идентификатор схемы
	 * @param  {String} musicId  Идентификатор композиции
	 */
	loadSchemaEditorByName(name: string, musicId: string): void {
		const getSchemeParams = schemes[name] || schemes.chacarera;
		getSchemeParams((schemeParams) => {
			this.main.loadSchemaEditor(schemeParams, musicId);
		});
		this.main.showLanguageLinks();
	}

	/**
	 * Получить ссылку на текущую страницу с параметром языка
	 * @param  {String} lang Идентификатор языка
	 * @return {String}      URL текущей страницы со всеми параметрами и параметром lang
	 */
	getLanguageLink(lang): string {
		const uri = new URI();
		const query = uri.query(true);
		query.lang = lang;
		const newQuery = URI.buildQuery(query);
		return uri.query(newQuery).build();
	}

	/**
	 * Если поддерживается History API, то pushState, иначе - редирект
	 * @param  {Object} params Параметры запроса
	 * @param  {String} title  Заголовок страницы
	 * @param  {String} query  Фрагмент URL запроса
	 */
	pushStateOrRedirect(params, query) {
		if (supportsHistoryApi) {
			window.history.pushState(params, null, query);
		} else {
			window.location.href = query;
		}
	}

	/**
	 * Получить относительный адрес URL для заданных параметров
	 * @param  {String} schemaId    Идентификатор схемы
	 * @param  {String} animationId Идентификатор анимации
	 * @param  {String} musicId     Идентификатор композиции
	 * @return {String}           Относительный путь URL
	 */
	getRelativeUrl(schemaId: string, animationId: string, musicId: string): string {
		return '?schema=' + schemaId +
			(animationId ? ('&animation=' + animationId) : '') +
			(musicId ? ('&music=' + musicId) : '');
	}

	/**
	 * Получение параметров контекста из URL
	 * @return {Object} Объект контекста
	 */
	getContextFromUrl(): NavigationContext {
		const url = new URI();
		const params = url.query(true);
		locale.lang = params.lang;
		return {
			schema: params.schema,
			lang: params.lang || 'ru',
			animation: params.animation,
			music: params.music,
			editor: params.editor,
		};
	}

	/**
	 * Перейти на указанную схему по URL
	 * @param  {String} schemaId Идентификатор схемы
	 */
	showSchema(schemaId: string): void {
		this.context.schema = schemaId;
		this.context.animation = undefined;
		this.context.music = undefined;
		this.updateUrl();
		this.loadSchemaByState();
	}

	/**
	 * Обновить URL в соответствии с текущим контекстом
	 */
	updateUrl(): void {
		const {schema, animation, music} = this.context;

		this.pushStateOrRedirect({schema, animation, music}, this.getRelativeUrl(schema, animation, music));
	}

	/**
	 * Переключиться на определённую анимацию
	 * @param  {Number} animationId  Идентификатор анимации
	 */
	showAnimation(animationId: string): void {
		this.context.animation = animationId;
		this.updateUrl();

		const getSchemeParams = schemes[this.context.schema];
		getSchemeParams((schemeParams) => {
			const animationClassDefs = schemeParams.animation;
			let animationClass;
			if (isAnimationVariantParamsArray(animationClassDefs)) {
				const animationClassDef = this.main.animationLoader.getAnimationClassDef(animationClassDefs, animationId);
				animationClass = animationClassDef.animClass;
				this.main.animationLoader.showAnimationLinks(animationClassDefs, animationId);
			} else {
				animationClass = animationClassDefs;
			}

			this.main.animationLoader.loadAnimation(animationClass);
		});
	}

	/**
	 * Переключиться на определённую композицию
	 * @param  {Number} animationId  Идентификатор анимации
	 */
	showMusic(musicId) {
		this.context.music = musicId;
		this.updateUrl();

		const getSchemeParams = schemes[this.context.schema];
		getSchemeParams(schemeParams => {
			const musicData = schemeParams.music;
			const musicSchema = musicData.filter(music => music.id === musicId)[0];
			this.main.player.loadMusicSchema(musicSchema, schemeParams.scheme);
			this.main.showMusicLinks(musicData, musicId);

			const scheme = this.main.getModScheme(schemeParams.scheme, musicSchema.schemeMods);
			this.main.renderScheme(scheme);
		});
		this.main.showLanguageLinks();
	}

	/**
	 * Загрузить схему через History
	 * @return {Boolean} True если схема была загружена
	 */
	loadSchemaByState() {
		const {state} = window.history;
		if (state && state.schema) {
			this.context.schema = state.schema;
			this.context.animation = state.animation;
			this.context.music = state.music;
			if (this.context.editor) {
				this.loadSchemaEditorByName(this.context.schema, this.context.music);
			} else {
				this.loadSchemaByName(this.context.schema, this.context.animation, this.context.music);
			}
			return true;
		}
		return false;
	}

	/**
	 * Загрузить схему из URL
	 * @return {Boolean} True если схема была загружена
	 */
	loadSchemaByUrl() {
		this.context = this.getContextFromUrl();
		if (this.context.schema) {
			if (this.context.editor) {
				this.loadSchemaEditorByName(this.context.schema, this.context.music);
			} else {
				this.loadSchemaByName(this.context.schema, this.context.animation, this.context.music);
			}
			return true;
		}
		return false;
	}

}
