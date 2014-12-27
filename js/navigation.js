var schemaParamsMap = {
	Zamba: {
		name: "Zamba",
		svgName: "zamba",
		music: ["el_beso", "zamba_cantora"],
		animation: [{id: "classic", name: "ZambaAnimation", title: "animation_links.common"},
					{id: "simple", name: "ZambaSimpleAnimation", title: "animation_links.simple"}]
	},
	ZambaAlegre: {
		name: "Zamba Alegre",
		svgName: "zamba_alegre",
		music: ["zamba_alegre"],
		animation: [{id: "classic", name: "ZambaAnimation", title: "animation_links.common"},
					{id: "simple", name: "ZambaSimpleAnimation", title: "animation_links.simple"}]
	},
	Gato: {
		name: "Gato",
		svgName: "gato",
		music: ["gato"],
		animation: "GatoAnimation"
	},
	GatoCuyano: {
		name: "Gato Cuyano",
		svgName: "gato_cuyano",
		music: ["gato_cuyano"],
		animation: "GatoAnimation"
	},
	Caramba: {
		name: "Caramba",
		svgName: "caramba",
		music: ["caramba"],
		animation: "GatoAnimation"
	},
	Chacarera: {
		name: "Chacarera",
		svgName: "chacarera",
		music: ["la_pockoy_y_pancha", "chacarera_de_un_triste"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "animation_links.two_people"},
					{id: "onFour", name: "Chacarera4Animation", title: "animation_links.four_people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/]
	},
	Chacarera6: {
		name: "Chacarera on 6",
		svgName: "chacarera_6",
		music: ["la_penadora", "la_baguala"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "animation_links.two_people"},
					{id: "onFour", name: "Chacarera4Animation", title: "animation_links.four_people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/]
	},
	ChacareraDoble: {
		name: "Chacarera doble",
		svgName: "chacarera_doble",
		music: ["chacarera_doble_el_olvidao", "chacarera_doble_sombra_enamorada"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "animation_links.two_people"},
					{id: "onFour", name: "Chacarera4Animation", title: "animation_links.four_people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/]
	},
	ChacareraDoble6: {
		name: "Chacarera doble on 6",
		svgName: "chacarera_doble_6",
		music: ["chacarera_doble_6_pampa_de_los_guanacos", "chacarera_doble_6_anorazas"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "animation_links.two_people"},
					{id: "onFour", name: "Chacarera4Animation", title: "animation_links.four_people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/]
	},
	Bailecito: {
		name: "Bailecito",
		svgName: "bailecito",
		music: ["bailecito"],
		animation: "BailecitoAnimation"
	},
	Escondido: {
		name: "Escondido",
		svgName: "escondido",
		music: ["escondido"],
		animation: "EscondidoAnimation"
	},
	Remedio: {
		name: "Remedio",
		svgName: "remedio",
		music: ["remedio"],
		animation: "RemedioAnimation"
	},
	RemedioAtamisqueno: {
		name: "Remedio Atamisqueno",
		svgName: "remedio_atamisqueno",
		music: ["remedio_atamisqueno"],
		animation: "RemedioAnimation"
	},
	HuayraMuyoj: {
		name: "Huayra Muyoj",
		svgName: "huayra_muyoj",
		music: ["huayra_muyoj"],
		animation: "HuayraMuyojAnimation"
	}
};
/**
 * Получить название схемы
 * @param  {String} schemaId Идентификатор схемы
 * @return {String}          Название схемы
 */
schemaParamsMap.getName = function(schemaId) {
	var schema = schemaParamsMap[schemaId];
	if (schema) {
		return schema.name;
	} else {
		return "";
	}
};

/**
 * Загрузить схему
 * @param  {String} name         Идентификатор схемы
 * @param  {String} animationId  Идентификатор анимации
 * @param  {String} musicId      Идентификатор композиции
 */
var loadSchemaByName = function(name, animationId, musicId) {
	var schemaParams = schemaParamsMap[name];
	if (!schemaParams) {
		schemaParams = schemaParamsMap.Chacarera;
	}
	loadSchema(schemaParams.name, schemaParams.svgName, schemaParams.music, musicId, schemaParams.animation, animationId);
	showLanguageLinks();
};

/**
 * Загрузить редактор тайминга
 * @param  {String} name     Идентификатор схемы
 * @param  {String} musicId  Идентификатор композиции
 */
var loadSchemaEditorByName = function(name, musicId) {
	var schemaParams = schemaParamsMap[name];
	if (!schemaParams) {
		schemaParams = schemaParamsMap.Chacarera;
	}
	loadSchemaEditor(schemaParams.name, schemaParams.svgName, schemaParams.music, musicId);
	showLanguageLinks();
};

/**
 * Получить ссылку на текущую страницу с параметром языка
 * @param  {String} lang Идентификатор языка
 * @return {String}      URL текущей страницы со всеми параметрами и параметром lang
 */
var getLanguageLink = function(lang) {
	var uri = new URI();
	var query = uri.query(true);
	query.lang = lang;
	var newQuery = URI.buildQuery(query);
	return uri.query(newQuery).build();
};

/**
 * Если IE9 и ниже, то редирект на страницу, иначе - сделать pushState в History
 * @param  {Object} params Параметры запроса
 * @param  {String} title  Заголовок страницы
 * @param  {String} query  Фрагмент URL запроса
 */
var pushStateOrRedirect = function(params, title, query) {
	if (History.isInternetExplorer() && (History.getInternetExplorerMajorVersion() <= 9)) {
		window.location.href = query;
	} else {
		History.pushState(params, title, query);
	}
}

/**
 * Перейти на указанную схему по URL
 * @param  {String} schemaId Идентификатор схемы
 */
var showSchema = function(schemaId) {
	this.pushStateOrRedirect({schema: schemaId}, 
		schemaParamsMap.getName(schemaId) + " - Adentro", "?schema=" + schemaId);
};

/**
 * Переключиться на определённую анимацию
 * @param  {Number} animationId  Идентификатор анимации
 */
var showAnimation = function(animationId) {
	var url = new URI();
	var params = url.query(true);

	this.pushStateOrRedirect({schema: params.schema, animationId: animationId, musicId: params.musicId}, 
			schemaParamsMap.getName(params.schema) + " - Adentro", 
			"?schema=" + params.schema + 
			"&animationId=" + animationId + 
			(params.musicId ? ("&musicId=" + params.musicId) : ""));

	var schemaParams = schemaParamsMap[params.schema];
	var animationClassDefs = schemaParams.animation;
	if (typeof animationClassDefs === 'object') {
		var animationClassDef = getAnimationClassDef(animationClassDefs, animationId);
		var animationClass = animationClassDef.name;
	} else {		
		var animationClass = animationClassDefs;
	}
	loadAnimation(animationClass);
	showAnimationLinks(animationClassDefs, animationId);
	showLanguageLinks();
};

/**
 * Переключиться на определённую композицию
 * @param  {Number} animationId  Идентификатор анимации
 */
var showMusic = function(musicId) {
	var url = new URI();
	var params = url.query(true);

	this.pushStateOrRedirect({schema: params.schema, animationId: params.animationId, musicId: musicId}, 
			schemaParamsMap.getName(params.schema) + " - Adentro", 
			"?schema=" + params.schema + 
			(params.animationId ? ("&animationId=" + params.animationId) : "") + 
			"&musicId=" + musicId);

	var schemaParams = schemaParamsMap[params.schema];
	var musicIds = schemaParams.music;
	var musicSchema = music.get(musicId);
	loadMusicSchema(musicSchema);
	showMusicLinks(musicIds, musicId);
	showLanguageLinks();
};

/**
 * Загрузить схему через History
 * @return {Boolean} True если схема была загружена
 */
var loadSchemaByState = function() {
	var state = History.getState();
	if ((state.data) && (state.data.schema)) {
		loadSchemaByName(state.data.schema, state.data.animationId, state.data.musicId);
		return true;
	}
	return false;
};

/**
 * Загрузить схему из URL
 * @return {Boolean} True если схема была загружена
 */
var loadSchemaByUrl = function() {
	var url = new URI();
	var params = url.query(true);
	if (params.schema) {
		if (params.editor) {
			loadSchemaEditorByName(params.schema, params.musicId);
		} else {
			loadSchemaByName(params.schema, params.animationId, params.musicId);
		}
		return true;
	}
	return false;
};