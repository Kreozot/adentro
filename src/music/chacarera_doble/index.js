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
		animClass: require('animationClasses/ChacareraAnimation').default,
		title: localize({ru: 'На двоих', en: 'On two people'})
	}, {
		id: 'onFour',
		animClass: require('animationClasses/Chacarera4Animation').default,
		title: localize({ru: 'На четверых', en: 'On four people'})
	}],
	info: require('infoData/chacarera.inc'),
	zapateo: true
};
