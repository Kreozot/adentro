import locale from 'js/locale';

module.exports = {
	name: 'Zamba Alegre',
	scheme: require('./scheme.yaml'),
	music: [
		require('./music/la_zamba_alegre'),
	],
	animation: [{
		id: 'simple',
		animClass: require('js/animations/ZambaSimpleAnimation').default,
		title: locale.get({ru: 'Традиционная', en: 'Traditional'})
	}, {
		id: 'classic',
		animClass: require('js/animations/ZambaAnimation').default,
		title: locale.get({ru: 'Модифицированная', en: 'Modified'})
	}],
	zapateo: true
};
