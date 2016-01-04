module.exports = {
	name: 'Zamba',
	svgName: require('svgData/zamba.svg'),
	music: [require('musicData/el_beso'), require('musicData/zamba_cantora')],
	animation: [{
		id: 'classic',
		animClass: require('animationClasses/ZambaAnimation').default,
		title: localize({ru: 'Вариант 1', en: 'Variant 1'})
	}, {
		id: 'classic2',
		animClass: require('animationClasses/Zamba2Animation').default,
		title: localize({ru: 'Вариант 2', en: 'Variant 2'})
	}, {
		id: 'simple',
		animClass: require('animationClasses/ZambaSimpleAnimation').default,
		title: localize({ru: 'Упрощённая', en: 'Simplified'})
	}],
	info: require('infoData/zamba.inc')
};

