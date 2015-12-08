var path = require('path');

module.exports = {
	paths: {
		root: path.resolve('./'),
		temp: path.resolve('./frontend/temp/'),
		src: {
			html: path.resolve('./src/'),
			js: path.resolve('./src/js/'),
			svg: path.resolve('./src/svg/'),
			svgCompiled: path.resolve('./src/svg_compiled'),
			schemes: path.resolve('./src/js/schemeParams'),
			music: path.resolve('./src/music/'),
			musicData: path.resolve('./src/js/music/')
		},
		dist: {
			js: path.resolve('./dist/scripts/'),
			styles: path.resolve('./dist/styles/'),
			html: path.resolve('./dist/')
		}
	},
	devServer: {
		host: 'localhost',
		port: 8080
	}
}
