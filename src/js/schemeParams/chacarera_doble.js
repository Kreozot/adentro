module.exports = {
	name: 'Chacarera doble',
	svgName: require('svgData/chacarera_doble.svg'),
	music: [require('musicData/chacarera_doble_el_olvidao'), require('musicData/chacarera_doble_sombra_enamorada')],
	animation: [{id: 'onTwo', animClass: require('animationClasses/ChacareraAnimation'), title: 'animation_links.two_people'},
				{id: 'onFour', animClass: require('animationClasses/Chacarera4Animation'), title: 'animation_links.four_people'}/*,
				{id: 'cadena', animClass: require('animationClasses/ChacareraCadenaAnimation'), title: 'Cadena'}*/],
	info: require('infoData/chacarera'),
	zapateo: true
};
