module.exports = {
	name: 'Chacarera on 6',
	svgName: require('svgData/chacarera_6.svg'),
	music: [require('musicData/la_penadora'), require('musicData/la_baguala')],
	animation: [{id: 'onTwo', animClass: require('animationClasses/ChacareraAnimation').default, title: 'animation_links.two_people'},
				{id: 'onFour', animClass: require('animationClasses/Chacarera4Animation').default, title: 'animation_links.four_people'}/*,
				{id: 'cadena', animClass: require('animationClasses/ChacareraCadenaAnimation').default, title: 'Cadena'}*/],
	info: require('infoData/chacarera.inc'),
	zapateo: true
};
