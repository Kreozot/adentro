module.exports = {
	name: 'Zamba',
	scheme: require('./scheme.yaml'),
	music: [
		require('./music/el_beso'),
		require('./music/zamba_cantora'),
	],
	animation: [{
		id: 'simple',
		animClass: require('js/animations/ZambaSimpleAnimation').default,
		title: localize({ru: 'Традиционная', en: 'Traditional'})
	}, {
		id: 'classic',
		animClass: require('js/animations/ZambaAnimation').default,
		title: localize({ru: 'Модифицированная', en: 'Modified'})
	}],
	info: require('info/zamba.inc')
};
