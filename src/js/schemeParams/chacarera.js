module.exports = {
	name: 'Chacarera',
	svgName: require('svgData/chacarera.svg'),
	music: [require('musicData/la_pockoy_y_pancha'), require('musicData/chacarera_de_un_triste')],
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
