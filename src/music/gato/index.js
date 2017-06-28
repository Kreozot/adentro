module.exports = {
	name: 'Gato',
	svg: compileSchemeTemplate('gato'),
	music: [require('./music/gatito_pa_don_lucas')],
	animation: require('animationClasses/GatoAnimation').default,
	zapateo: true
};
