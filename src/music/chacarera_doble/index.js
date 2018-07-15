module.exports = {
	name: 'Chacarera doble',
	scheme: require('./scheme.yaml'),
	music: [
		require('./music/el_olvidao'),
		require('./music/sombra_enamorada'),
		require('./music/pampa_de_los_guanacos'),
		require('./music/anorazas')
	],
	animation: [{
		id: 'onTwo',
		animClass: require('js/animations/ChacareraAnimation').default,
		title: localize({ru: 'На двоих', en: 'On two people'})
	}, {
		id: 'onFour',
		animClass: require('js/animations/Chacarera4Animation').default,
		title: localize({ru: 'На четверых', en: 'On four people'})
	}],
	info: require('info/chacarera.inc'),
	zapateo: true
};
