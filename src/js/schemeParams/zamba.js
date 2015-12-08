module.exports = {
	name: 'Zamba',
	svgName: require('svgData/zamba.svg'),
	music: [require('musicData/el_beso'), require('musicData/zamba_cantora')],
	animation: [
		{id: 'classic', animClass: require('animationClasses/ZambaAnimation'), title: 'animation_links.common'},
		{id: 'classic2', animClass: require('animationClasses/Zamba2Animation'), title: 'animation_links.common2'},
		{id: 'simple', animClass: require('animationClasses/ZambaSimpleAnimation'), title: 'animation_links.simple'}
	],
	info: require('infoData/zamba.inc')
};
