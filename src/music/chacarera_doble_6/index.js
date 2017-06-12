module.exports = {
	name: 'Chacarera doble on 6',
	svgName: require('./scheme.svg'),
	music: [require('./music/chacarera_doble_6_pampa_de_los_guanacos'), require('./music/chacarera_doble_6_anorazas')],
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
