module.exports = {
	name: 'Escondido',
	svg: compileSchemeTemplate('escondido'),
	music: [require('./music/huaico_hondo')],
	animation: require('animationClasses/EscondidoAnimation').default,
	zapateo: true
};
