module.exports = {
	name: 'Remedio Atamisqueño',
	svg: compileSchemeTemplate('remedio_atamisqueno'),
	music: [require('./music/remedio_atamisqueno')],
	animation: require('animationClasses/RemedioAnimation').default,
	zapateo: true
};
