module.exports = {
	name: 'Bailecito',
	svg: compileSchemeTemplate('bailecito'),
	music: [require('./music/toda_la_noche')],
	animation: require('animationClasses/BailecitoAnimation').default
};
