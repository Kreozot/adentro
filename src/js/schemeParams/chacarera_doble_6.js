module.exports = {
	name: 'Chacarera doble on 6',
	svgName: require('svgData/chacarera_doble_6.svg'),
	music: [require('musicData/chacarera_doble_6_pampa_de_los_guanacos'), require('musicData/chacarera_doble_6_anorazas')],
	animation: [{id: 'onTwo', animClass: require('animationClasses/ChacareraAnimation'), title: 'animation_links.two_people'},
				{id: 'onFour', animClass: require('animationClasses/Chacarera4Animation'), title: 'animation_links.four_people'}/*,
				{id: 'cadena', animClass: require('animationClasses/ChacareraCadenaAnimation'), title: 'Cadena'}*/],
	info: require('infoData/chacarera.inc'),
	zapateo: true
};
