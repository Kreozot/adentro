var path = require('path');

module.exports = {
	paths: {
		root: path.resolve('.'),
		src: {
			tests: path.resolve('./test'),
			templates: path.resolve('./src/templates'),
			static: path.resolve('./src/static'),
			js: path.resolve('./src/js'),
			svg: path.resolve('./src/svg'),
			animationSvg: path.resolve('./src/js/animations/svg'),
			schemes: path.resolve('./src/music'),
			music: path.resolve('./src/music'),
			musicData: path.resolve('./src/music'),
			styles: path.resolve('./src/styles')
		},
		temp: {
			svgCompiled: path.resolve('./svg_compiled'),
			mp3Mock: path.resolve('./mp3_mock'),
		},
		dist: {
			js: path.resolve('./dist'),
			styles: path.resolve('./dist/styles'),
			html: path.resolve('./dist')
		}
	},
	devServer: {
		host: 'localhost',
		port: 8080
	},
};
