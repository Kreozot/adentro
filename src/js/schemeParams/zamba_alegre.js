module.exports = {
	name: 'Zamba Alegre',
	svgName: require('svgData/zamba_alegre.svg'),
	music: [require('musicData/zamba_alegre')],
	animation: [
		{id: 'classic', animClass: require('animationClasses/ZambaAnimation'), title: 'animation_links.common'},
		{id: 'simple', animClass: require('animationClasses/ZambaSimpleAnimation'), title: 'animation_links.simple'}
	],
	zapateo: true
};
