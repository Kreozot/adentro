var path = require('path');

module.exports = {
	paths: {
		root: path.resolve('.'),
		src: {
			html: path.resolve('./src'),
			js: path.resolve('./src/js'),
			svg: path.resolve('./src/svg'),
			svgCompiled: path.resolve('./src/svg_compiled'),
			schemes: path.resolve('./src/js/schemeParams'),
			music: path.resolve('./src/music'),
			musicData: path.resolve('./src/js/music'),
			styles: path.resolve('./src/styles')
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
	}
}
