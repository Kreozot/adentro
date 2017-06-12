module.exports = {
	name: 'Bailecito',
	svgName: compileSchemeTemplate('bailecito'),
	music: [require('./music/toda_la_noche')],
	animation: require('animationClasses/BailecitoAnimation').default
};
