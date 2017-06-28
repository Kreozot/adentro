module.exports = {
	name: 'Remedio',
	svg: compileSchemeTemplate('remedio'),
	music: [require('./music/remedio_norteno')],
	animation: require('animationClasses/RemedioAnimation').default,
	zapateo: true
};
