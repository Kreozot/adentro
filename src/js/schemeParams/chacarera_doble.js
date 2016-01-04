module.exports = {
	name: 'Chacarera doble',
	svgName: require('svgData/chacarera_doble.svg'),
	music: [require('musicData/chacarera_doble_el_olvidao'), require('musicData/chacarera_doble_sombra_enamorada')],
	animation: [{
			id: 'onTwo',
			animClass: require('animationClasses/ChacareraAnimation').default,
			title: localize({ru: 'На двоих', en: 'On two people'})
		}, {
			id: 'onFour',
			animClass: require('animationClasses/Chacarera4Animation').default,
			title: localize({ru: 'На четверых', en: 'On four people'})
		}
		/*,
						{id: 'cadena', animClass: require('animationClasses/ChacareraCadenaAnimation').default, title: 'Cadena'}*/
	],
	info: require('infoData/chacarera.inc'),
	zapateo: true
};

