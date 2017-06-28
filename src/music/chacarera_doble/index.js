module.exports = {
	name: 'Chacarera doble',
	svg: compileSchemeTemplate('chacarera_doble'),
	music: [require('./music/el_olvidao'), require('./music/sombra_enamorada')],
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
