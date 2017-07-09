module.exports = {
	name: 'Zamba Alegre',
	scheme: require('./scheme.yaml'),
	music: [require('./music/la_zamba_alegre')],
	animation: require('animationClasses/ZambaSimpleAnimation').default,
	zapateo: true
};
