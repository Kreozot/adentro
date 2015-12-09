var schemes = require('./schemes.js');

/**
 * Текущие параметры страницы
 * @type {Object}
 */
var context = {};

/**
 * Загрузить схему
 * @param  {String} name         Идентификатор схемы
 * @param  {String} animationId  Идентификатор анимации
 * @param  {String} musicId      Идентификатор композиции
 */
var loadSchemaByName = function (name, animationId, musicId) {
	var schemaParams = schemes[name];
	if (!schemaParams) {
		schemaParams = schemes['chacarera'];
	}
	loadSchema(schemaParams, musicId, animationId);
	showLanguageLinks();
};

/**
 * Загрузить редактор тайминга
 * @param  {String} name     Идентификатор схемы
 * @param  {String} musicId  Идентификатор композиции
 */
var loadSchemaEditorByName = function (name, musicId) {
	var schemaParams = schemaParamsMap[name];
	if (!schemaParams) {
		schemaParams = schemaParamsMap.Chacarera;
	}
	loadSchemaEditor(schemaParams, musicId);
	showLanguageLinks();
};

/**
 * Получить ссылку на текущую страницу с параметром языка
 * @param  {String} lang Идентификатор языка
 * @return {String}      URL текущей страницы со всеми параметрами и параметром lang
 */
var getLanguageLink = function (lang) {
	var uri = new URI();
	var query = uri.query(true);
	query.lang = lang;
	var newQuery = URI.buildQuery(query);
	return uri.query(newQuery).build();
};

/**
 * Если поддерживается History API, то pushState, иначе - редирект
 * @param  {Object} params Параметры запроса
 * @param  {String} title  Заголовок страницы
 * @param  {String} query  Фрагмент URL запроса
 */
var pushStateOrRedirect = function (params, title, query) {
	if (supports_history_api) {
		history.pushState(params, title, query);
	} else {
		window.location.href = query;
	}
};

/**
 * Получить относительный адрес URL для заданных параметров
 * @param  {String} schema    Идентификатор схемы
 * @param  {String} animation Идентификатор анимации
 * @param  {String} music     Идентификатор композиции
 * @return {String}           Относительный путь URL
 */
var getRelativeUrl = function (schema, animation, music) {
	return '?schema=' + schema +
		(animation ? ('&animation=' + animation) : '') +
		(music ? ('&music=' + music) : '');
	//TODO: Настройка алиасов URL. Тогда можно будет сделать нормальный relative path
	// return schema +
	// 	(animation ? ("/" + animation) : "") +
	// 	(music ? ("?music=" + music) : "");
};

/**
 * Получение параметров контекста из URL
 * @return {Object} Объект контекста
 */
var getContextFromUrl = function () {
	var url = new URI();
	var segments = url.segment();
	var params = url.query(true);
	var context = {};
	context.schema = params.schema;
	context.animation = params.animation;
	//TODO: Настройка алиасов URL. Тогда можно будет сделать нормальный relative path
	// context.schema = segments[0];
	// context.animation = segments[1];
	context.music = params.music;
	context.editor = params.editor;
	return context;
};

/**
 * Перейти на указанную схему по URL
 * @param  {String} schemaId Идентификатор схемы
 */
var showSchema = function (schemaId) {
	this.pushStateOrRedirect({schema: schemaId},
		schemaParamsMap.getName(schemaId) + ' - Adentro', getRelativeUrl(schemaId));
	loadSchemaByState();
};

/**
 * Переключиться на определённую анимацию
 * @param  {Number} animationId  Идентификатор анимации
 */
var showAnimation = function (animationId) {
	context.animation = animationId;

	this.pushStateOrRedirect({schema: context.schema, animation: context.animation, music: context.music},
			schemaParamsMap.getName(context.schema) + ' - Adentro',
			getRelativeUrl(context.schema, context.animation, context.music));

	var schemaParams = schemaParamsMap[context.schema];
	var animationClassDefs = schemaParams.animation;
	if (typeof animationClassDefs === 'object') {
		var animationClassDef = AnimationLoader.getAnimationClassDef(animationClassDefs, animationId);
		var animationClass = animationClassDef.name;
	} else {
		var animationClass = animationClassDefs;
	}
	AnimationLoader.loadAnimation(animationClass);
	AnimationLoader.showAnimationLinks(animationClassDefs, animationId);
};

/**
 * Переключиться на определённую композицию
 * @param  {Number} animationId  Идентификатор анимации
 */
var showMusic = function (musicId) {
	context.music = musicId;
	this.pushStateOrRedirect({schema: context.schema, animation: context.animation, music: context.music},
			schemaParamsMap.getName(context.schema) + ' - Adentro',
			getRelativeUrl(context.schema, context.animation, context.music));

	var schemaParams = schemaParamsMap[context.schema];
	var musicIds = schemaParams.music;
	var musicSchema = musicData[musicId];
	loadMusicSchema(musicSchema);
	showMusicLinks(musicIds, musicId);
	showLanguageLinks();
};

/**
 * Загрузить схему через History
 * @return {Boolean} True если схема была загружена
 */
var loadSchemaByState = function () {
	var state = history.state;
	if (state.schema) {
		context.schema = state.schema;
		context.animation = state.animation;
		context.music = state.music;
		if (context.editor) {
			loadSchemaEditorByName(context.schema, context.music);
		} else {
			loadSchemaByName(context.schema, context.animation, context.music);
		}
		return true;
	}
	return false;
};

/**
 * Загрузить схему из URL
 * @return {Boolean} True если схема была загружена
 */
var loadSchemaByUrl = function () {
	context = getContextFromUrl();
	if (context.schema) {
		if (context.editor) {
			loadSchemaEditorByName(context.schema, context.music);
		} else {
			loadSchemaByName(context.schema, context.animation, context.music);
		}
		return true;
	}
	return false;
};
