module.exports = {
	name: 'Caramba',
	svg: compileSchemeTemplate('caramba'),
	music: [require('./music/el_caramba')],
	animation: require('animationClasses/GatoAnimation').default
};
