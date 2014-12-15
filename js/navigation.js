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
};

/**
 * [loadSchemaByName Загрузить схему]
 * @param  {[String]} name        [идентификатор схемы]
 * @param  {[String]} animationId [идентификатор анимации]
 * @param  {[String]} musicId     [идентификатор композиции]
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
 * [loadSchemaEditorByName Загрузить редактор тайминга]
 * @param  {[String]} name    [идентификатор схемы]
 * @param  {[String]} musicId [идентификатор композиции]
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
 * [getLanguageLink Получить ссылку на текущую страницу с параметром языка]
 * @param  {[String]} lang [идентификатор языка]
 * @return {[String]}      [url текущей страницы со всеми параметрами и параметром lang]
 */
var getLanguageLink = function(lang) {
	var uri = new URI();
	var query = uri.query(true);
	query.lang = lang;
	var newQuery = URI.buildQuery(query);
	return uri.query(newQuery).build();
};

// Перейти на указанную схему по URL
var showSchema = function(name) {
	History.pushState({schema: name}, name + " schema", "?schema=" + name);
};

/**
 * [showAnimation Переключиться на определённую анимацию]
 * @param  {[Integer]} animationId [идентификатор анимации]
 */
var showAnimation = function(animationId) {
	var url = new URI();
	var params = url.query(true);
	History.pushState({schema: params.schema, animationId: animationId, musicId: params.musicId}, 
		name + " - Adentro", 
		"?schema=" + params.schema + 
		"&animationId=" + animationId + 
		(params.musicId ? ("&musicId=" + params.musicId) : ""));

	var schemaParams = schemaParamsMap[params.schema];
	var animationClassDefs = schemaParams.animation;
	var animationClassDef = getAnimationClassDef(animationClassDefs, animationId);
	var animationClass = animationClassDef.name;
	loadAnimation(animationClass);
	showAnimationLinks(animationClassDefs, animationId);
	showLanguageLinks();
};

/**
 * [showAnimation Переключиться на определённую композицию]
 * @param  {[Integer]} animationId [идентификатор анимации]
 */
var showMusic = function(musicId) {
	var url = new URI();
	var params = url.query(true);
	History.pushState({schema: params.schema, animationId: params.animationId, musicId: musicId}, 
		name + " - Adentro", 
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
 * [loadSchemaByState Загрузить схему через History]
 * @return {[Boolean]} [true если схема была загружена]
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
 * [loadSchemaByUrl Загрузить схему из URL]
 * @return {[Boolean]} [true если схема была загружена]
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