import locale from 'js/locale';

module.exports = {
	name: 'Chacarera',
	scheme: require('./scheme.yaml'),
	music: [
		require('./music/la_pockoy_y_pancha'),
		require('./music/chacarera_de_un_triste'),
		require('./music/la_baguala'),
		require('./music/la_penadora')
	],
	animation: [{
		id: 'onTwo',
		animClass: require('js/animations/ChacareraAnimation').default,
		title: locale.get({ru: 'На двоих', en: 'On two people'})
	}, {
		id: 'onFour',
		animClass: require('js/animations/Chacarera4Animation').default,
		title: locale.get({ru: 'На четверых', en: 'On four people'})
	}],
	info: require('info/chacarera.inc'),
	zapateo: true
};
