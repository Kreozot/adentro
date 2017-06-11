var path = require('path');

module.exports = {
	paths: {
		root: path.resolve('.'),
		src: {
			tests: path.resolve('./test'),
			html: path.resolve('./src'),
			js: path.resolve('./src/js'),
			svg: path.resolve('./src/svg'),
			schemes: path.resolve('./src/js/schemeParams'),
			music: path.resolve('./src/music'),
			musicData: path.resolve('./src/js/music'),
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
	files: {
		mockMp3: path.resolve('./test/fixtures/pomogator.mp3')
	},
	devServer: {
		host: 'localhost',
		port: 8080
	}
};
