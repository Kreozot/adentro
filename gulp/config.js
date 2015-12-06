var path = require('path');

module.exports = {
	paths: {
		root: path.resolve('./'),
		temp: path.resolve('./frontend/temp/'),
		src: {
			js: path.resolve('./src/js/'),
			svg: path.resolve('./src/svg/'),
			svgCompiled: path.resolve('./src/svg_compiled'),
			music: path.resolve('./src/music/'),
			musicData: path.resolve('./src/js/music/')
		},
		dist: {
			js: path.resolve('./dist/scripts/'),
			styles: path.resolve('./dist/styles/')
		}
	},
	devServer: {
		host: 'localhost',
		port: 8080
	}
}
