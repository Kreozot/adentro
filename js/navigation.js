var schemaParamsMap = {
	Zamba: {
		name: "Zamba",
		svgName: "zamba",
		music: ["zamba"],
		animation: [{id: "classic", name: "ZambaAnimation", title: "Classic"},
					{id: "simple", name: "ZambaSimpleAnimation", title: "Simple"}]
	},
	Gato: {
		name: "Gato",
		svgName: "gato",
		music: ["gato"],
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
		music: ["chacarera"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "Two people"},
					{id: "onFour", name: "Chacarera4Animation", title: "Four people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/]
	},
	Chacarera6: {
		name: "Chacarera on 6",
		svgName: "chacarera_6",
		music: ["chacarera_6"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "Two people"},
					{id: "onFour", name: "Chacarera4Animation", title: "Four people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/]
	},
	ChacareraDoble: {
		name: "Chacarera doble",
		svgName: "chacarera_doble",
		music: ["chacarera_doble_el_olvidao", "chacarera_doble_sombra_enamorada"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "Two people"},
					{id: "onFour", name: "Chacarera4Animation", title: "Four people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/]
	},
	ChacareraDoble6: {
		name: "Chacarera doble on 6",
		svgName: "chacarera_doble_6",
		music: ["chacarera_doble_6_pampa_de_los_guanacos", "chacarera_doble_6_anorazas"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "Two people"},
					{id: "onFour", name: "Chacarera4Animation", title: "Four people"}/*,
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

// Загрузить схему по имени
var loadSchemaByName = function(name, animationId, musicId) {
	var schemaParams = schemaParamsMap[name];
	if (!schemaParams) {
		schemaParams = schemaParamsMap.Chacarera;
	}
	loadSchema(schemaParams.name, schemaParams.svgName, schemaParams.music, musicId, schemaParams.animation, animationId);
};

// Загрузить схему по имени
var loadSchemaEditorByName = function(name, musicId) {
	var schemaParams = schemaParamsMap[name];
	if (!schemaParams) {
		schemaParams = schemaParamsMap.Chacarera;
	}
	loadSchemaEditor(schemaParams.name, schemaParams.svgName, schemaParams.music, musicId);
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
	var url = purl();
	var schema = url.param("schema");
	var musicId = url.param("musicId");
	History.pushState({schema: name, animationId: animationId, musicId: musicId}, name + " schema", 
		"?schema=" + schema + "&animationId=" + animationId + (musicId ? ("&musicId=" + musicId) : ""));

	var schemaParams = schemaParamsMap[schema];
	var animationClassDefs = schemaParams.animation;
	var animationClassDef = getAnimationClassDef(animationClassDefs, animationId);
	var animationClass = animationClassDef.name;
	loadAnimation(animationClass);
	showAnimationLinks(animationClassDefs, animationId);
};

/**
 * [showAnimation Переключиться на определённую композицию]
 * @param  {[Integer]} animationId [идентификатор анимации]
 */
var showMusic = function(musicId) {
	var url = purl();
	var schema = url.param("schema");
	var animationId = url.param("animationId");
	History.pushState({schema: name, animationId: animationId, musicId: musicId}, name + " schema", 
		"?schema=" + schema + (animationId ? ("&animationId=" + animationId) : "") + "&musicId=" + musicId);

	var schemaParams = schemaParamsMap[schema];
	var musicIds = schemaParams.music;
	var musicSchema = music.get(musicId);
	loadMusicSchema(musicSchema);
	showMusicLinks(musicIds, musicId);
};

// Загрузить схему, указанную в URL
var loadSchemaByState = function() {
	var state = History.getState();
	if ((state.data) && (state.data.schema)) {
		loadSchemaByName(state.data.schema);
		return true;
	}
	return false;
};

var loadSchemaByUrl = function() {
	var url = purl();
	if (url.param("schema")) {
		if (url.param("editor")) {
			loadSchemaEditorByName(url.param("schema"), url.param("musicId"));
		} else {
			loadSchemaByName(url.param("schema"), url.param("animationId"), url.param("musicId"));
		}
		return true;
	}
	return false;
};