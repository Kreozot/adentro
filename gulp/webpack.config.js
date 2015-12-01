var webpack = require('webpack');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var config = require('./config.js');
var paths = config.paths;
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnext = require('cssnext');

var languages = ['en', 'ru'];

var webpackConfig = languages.map(function (lang) {
	return {
		entry: {
			// Главный модуль для интерфейса и навигации
			'main': paths.src.js + '/main.js',
			// Музыка и анимация
			'media': paths.src.js + '/media.js'
		},
		output: {
			path:  paths.dist.js,
			filename: '[name].' + lang + '.js'
		},
		module: {
			preLoaders: [
				{ test: /\.js$/, exclude: /node_modules/, loader: 'jscs' }
			],
			loaders: [
				{ test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
				{ test: /\.json$/, loader: 'json' },
				{ test: /\.css$/, loader: 'style!css' },
				{ test: /\.scss$/, loader: "style!css!postcss" },
				{ test: /\.(jpe?g|png|gif)$/i, loader: 'url' }
			]
		},
		postcss: function () {
			return [autoprefixer, cssnext, precss];
		},
		plugins: [],
		devtool: 'eval'
	};
});

// Минификация при сборке в продакшн
if (argv.production) {
	gutil.log('Production mode');

	webpackConfig = webpackConfig.map(function (config) {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				},
				exclude: [
					/min\.js/i
				],
				mangle: {
					except: ['$', 'exports', 'require']
				}
			})
		);
		config.devtool = 'source-map';
		return config;
	});
}

webpackConfig.push({
	entry: {
		// Сторонние библиотеки
		'vendor.main': [
			'expose?$!expose?jQuery!jquery/dist/jquery.min.js',
			'hopscotch',
			'urijs/src/URI.min.js'
		],
		'vendor.media': [
			'jplayer/dist/jplayer/jquery.jplayer.min.js',
			'snapsvg/dist/snap.svg-min.js'
		]
	},
	output: {
		path:  paths.dist.js,
		filename: '[name].js'
	}
});

module.exports = webpackConfig;
