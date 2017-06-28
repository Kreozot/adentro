module.exports = {
	name: 'Gato Cuyano',
	svg: compileSchemeTemplate('gato_cuyano'),
	music: [require('./music/el_correcto')],
	animation: require('animationClasses/GatoAnimation').default
};
