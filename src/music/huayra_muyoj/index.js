module.exports = {
	name: 'Huayra Muyoj',
	svg: compileSchemeTemplate('huayra_muyoj'),
	music: [require('./music/huayra_muyoj')],
	animation: require('animationClasses/HuayraMuyojAnimation').default,
	zapateo: true
};
