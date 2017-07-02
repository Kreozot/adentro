const schemes = require('./schemes.js');
const URI = require('urijs/src/URI.js');

const supportsHistoryApi = Boolean(window.history && history.pushState);

export default class Navigation {
	constructor(main) {
		this.context = {};
		this.main = main;

		const self = this;
		$('.dance-menu__link')
			.on('click', function () {
				const schemeId = $(this).data('scheme');
				if (self.currentScheme !== schemeId) {
					self.showSchema(schemeId);
				}
			});
	}

	updateMenu(currentSchemeId) {
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
	loadSchemaByName(name, animationId, musicId) {
		const schemeParams = schemes[name] || schemes.chacarera;
		schemeParams(scheme => {
			document.title = `${scheme.name} - ¡Adentro!`;
			this.main.loadSchema(scheme, musicId, animationId);
		});

		this.updateMenu(name);
		this.main.showLanguageLinks();
	}

	/**
	 * Загрузить редактор тайминга
	 * @param  {String} name     Идентификатор схемы
	 * @param  {String} musicId  Идентификатор композиции
	 */
	loadSchemaEditorByName(name, musicId) {
		const schemaParams = schemes[name] || schemes.chacarera;
		schemaParams(scheme => {
			this.main.loadSchemaEditor(scheme, musicId);
		});
		this.main.showLanguageLinks();
	}

	/**
	 * Получить ссылку на текущую страницу с параметром языка
	 * @param  {String} lang Идентификатор языка
	 * @return {String}      URL текущей страницы со всеми параметрами и параметром lang
	 */
	getLanguageLink(lang) {
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
			history.pushState(params, null, query);
		} else {
			window.location.href = query;
		}
	}

	/**
	 * Получить относительный адрес URL для заданных параметров
	 * @param  {String} schema    Идентификатор схемы
	 * @param  {String} animation Идентификатор анимации
	 * @param  {String} music     Идентификатор композиции
	 * @return {String}           Относительный путь URL
	 */
	getRelativeUrl(schema, animation, music) {
		return '?schema=' + schema +
			(animation ? ('&animation=' + animation) : '') +
			(music ? ('&music=' + music) : '');
	}

	/**
	 * Получение параметров контекста из URL
	 * @return {Object} Объект контекста
	 */
	getContextFromUrl() {
		const url = new URI();
		const segments = url.segment();
		const params = url.query(true);
		const context = {};
		context.schema = params.schema;
		context.lang = params.lang || 'ru';
		this.main.lang = context.lang;
		context.animation = params.animation;
		context.music = params.music;
		context.editor = params.editor;
		return context;
	}

	/**
	 * Перейти на указанную схему по URL
	 * @param  {String} schemaId Идентификатор схемы
	 */
	showSchema(schemaId) {
		this.context.schema = schemaId;
		this.context.animation = undefined;
		this.context.music = undefined;
		this.updateUrl();
		this.loadSchemaByState();
	}

	/**
	 * Обновить URL в соответствии с текущим контекстом
	 */
	updateUrl() {
		const {schema, animation, music} = this.context;

		this.pushStateOrRedirect({schema, animation, music}, this.getRelativeUrl(schema, animation, music));
	}

	/**
	 * Переключиться на определённую анимацию
	 * @param  {Number} animationId  Идентификатор анимации
	 */
	showAnimation(animationId) {
		this.context.animation = animationId;
		this.updateUrl();

		const schemaParams = schemes[this.context.schema];
		schemaParams(scheme => {
			const animationClassDefs = scheme.animation;
			let animationClass;
			if (typeof animationClassDefs === 'object') {
				const animationClassDef = this.main.animationLoader.getAnimationClassDef(animationClassDefs, animationId);
				animationClass = animationClassDef.animClass;
			} else {
				animationClass = animationClassDefs;
			}
			this.main.animationLoader.loadAnimation(animationClass);
			this.main.animationLoader.showAnimationLinks(animationClassDefs, animationId);
		});
	}

	/**
	 * Переключиться на определённую композицию
	 * @param  {Number} animationId  Идентификатор анимации
	 */
	showMusic(musicId) {
		this.context.music = musicId;
		this.updateUrl();

		const schemaParams = schemes[this.context.schema];
		schemaParams(scheme => {
			const musicData = scheme.music;
			const musicSchema = musicData.filter(music => music.id === musicId)[0];
			// модифицировать схему
			this.main.player.loadMusicSchema(musicSchema);
			this.main.showMusicLinks(musicData, musicId);
		});
		this.main.showLanguageLinks();
	}

	/**
	 * Загрузить схему через History
	 * @return {Boolean} True если схема была загружена
	 */
	loadSchemaByState() {
		const state = history.state;
		if (state.schema) {
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
		let context = this.getContextFromUrl();
		this.context = context;
		if (context.schema) {
			if (context.editor) {
				this.loadSchemaEditorByName(context.schema, context.music);
			} else {
				this.loadSchemaByName(context.schema, context.animation, context.music);
			}
			return true;
		}
		return false;
	}

}
