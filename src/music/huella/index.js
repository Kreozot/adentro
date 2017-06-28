module.exports = {
	name: 'Huella',
	svg: compileSchemeTemplate('huella'),
	music: [require('./music/hasta_tu_rancho')],
	animation: require('animationClasses/HuellaAnimation').default,
	zapateo: true
};
