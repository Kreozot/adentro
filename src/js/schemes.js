var schemaParamsMap = {
	Zamba: {
		name: "Zamba",
		svgName: "zamba",
		music: ["el_beso", "zamba_cantora"],
		animation: [
			{id: "classic", name: "ZambaAnimation", title: "animation_links.common"},
			{id: "classic2", name: "Zamba2Animation", title: "animation_links.common2"},
			{id: "simple", name: "ZambaSimpleAnimation", title: "animation_links.simple"}
		],
		info: "zamba"
	},
	ZambaAlegre: {
		name: "Zamba Alegre",
		svgName: "zamba_alegre",
		music: ["zamba_alegre"],
		animation: [{id: "classic", name: "ZambaAnimation", title: "animation_links.common"},
					{id: "simple", name: "ZambaSimpleAnimation", title: "animation_links.simple"}],
		zapateo: true
	},
	Gato: {
		name: "Gato",
		svgName: "gato",
		music: ["gato"],
		animation: "GatoAnimation",
		zapateo: true
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
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/],
		info: "chacarera",
		zapateo: true
	},
	Chacarera6: {
		name: "Chacarera on 6",
		svgName: "chacarera_6",
		music: ["la_penadora", "la_baguala"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "animation_links.two_people"},
					{id: "onFour", name: "Chacarera4Animation", title: "animation_links.four_people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/],
		info: "chacarera",
		zapateo: true
	},
	ChacareraDoble: {
		name: "Chacarera doble",
		svgName: "chacarera_doble",
		music: ["chacarera_doble_el_olvidao", "chacarera_doble_sombra_enamorada"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "animation_links.two_people"},
					{id: "onFour", name: "Chacarera4Animation", title: "animation_links.four_people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/],
		info: "chacarera",
		zapateo: true
	},
	ChacareraDoble6: {
		name: "Chacarera doble on 6",
		svgName: "chacarera_doble_6",
		music: ["chacarera_doble_6_pampa_de_los_guanacos", "chacarera_doble_6_anorazas"],
		animation: [{id: "onTwo", name: "ChacareraAnimation", title: "animation_links.two_people"},
					{id: "onFour", name: "Chacarera4Animation", title: "animation_links.four_people"}/*,
					{id: "cadena", name: "ChacareraCadenaAnimation", title: "Cadena"}*/],
		info: "chacarera",
		zapateo: true
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
		animation: "EscondidoAnimation",
		zapateo: true
	},
	Remedio: {
		name: "Remedio",
		svgName: "remedio",
		music: ["remedio"],
		animation: "RemedioAnimation",
		zapateo: true
	},
	RemedioAtamisqueno: {
		name: "Remedio Atamisqueño",
		svgName: "remedio_atamisqueno",
		music: ["remedio_atamisqueno"],
		animation: "RemedioAnimation",
		zapateo: true
	},
	HuayraMuyoj: {
		name: "Huayra Muyoj",
		svgName: "huayra_muyoj",
		music: ["huayra_muyoj"],
		animation: "HuayraMuyojAnimation",
		zapateo: true
	},
	Huella: {
		name: "Huella",
		svgName: "huella",
		music: ["hasta_tu_rancho"],
		animation: "HuellaAnimation",
		zapateo: true
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

module.exports = schemaParamsMap;
