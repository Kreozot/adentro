module.exports = {
	name: 'Chacarera',
	scheme: require('./scheme.yaml'),
	music: [require('./music/la_pockoy_y_pancha'), require('./music/chacarera_de_un_triste')],
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
