module.exports = {
	name: 'Chacarera on 6',
	svgName: require('svgData/chacarera_6.svg'),
	music: [require('musicData/la_penadora'), require('musicData/la_baguala')],
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

