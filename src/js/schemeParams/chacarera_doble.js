module.exports = {
	name: 'Chacarera doble',
	svgName: require('svgData/chacarera_doble.svg'),
	music: [require('musicData/chacarera_doble_el_olvidao'), require('musicData/chacarera_doble_sombra_enamorada')],
	animation: [{id: 'onTwo', animClass: require('animationClasses/ChacareraAnimation').default, title: 'animation_links.two_people'},
				{id: 'onFour', animClass: require('animationClasses/Chacarera4Animation').default, title: 'animation_links.four_people'}/*,
				{id: 'cadena', animClass: require('animationClasses/ChacareraCadenaAnimation').default, title: 'Cadena'}*/],
	info: require('infoData/chacarera.inc'),
	zapateo: true
};
