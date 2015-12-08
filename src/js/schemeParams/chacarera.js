module.exports = {
	name: 'Chacarera',
	svgName: require('svgData/chacarera.svg'),
	music: [require('musicData/la_pockoy_y_pancha'), require('musicData/chacarera_de_un_triste')],
	animation: [{id: 'onTwo', animClass: require('animationClasses/ChacareraAnimation'), title: 'animation_links.two_people'},
				{id: 'onFour', animClass: require('animationClasses/Chacarera4Animation'), title: 'animation_links.four_people'}/*,
				{id: 'cadena', animClass: require('animationClasses/ChacareraCadenaAnimation'), title: 'Cadena'}*/],
	info: require('infoData/chacarera.inc'),
	zapateo: true
};
