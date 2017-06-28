module.exports = {
	name: 'Zamba Alegre',
	svg: compileSchemeTemplate('zamba_alegre'),
	music: [require('./music/la_zamba_alegre')],
	animation: [{
		id: 'classic',
		animClass: require('animationClasses/ZambaAnimation').default,
		title: localize({ru: 'Вариант 1', en: 'Variant 1'})
	}, {
		id: 'simple',
		animClass: require('animationClasses/ZambaSimpleAnimation').default,
		title: localize({ru: 'Упрощённая', en: 'Simplified'})
	}],
	zapateo: true
};
