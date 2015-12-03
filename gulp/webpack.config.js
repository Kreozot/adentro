var webpack = require('webpack');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var config = require('./config.js');
var paths = config.paths;
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnext = require('cssnext');
var musicList = require('./musicList.js');

var languages = ['en', 'ru'];

var webpackConfig = languages.map(function (lang) {
	return {
        resolve: {
            root: config.paths.root,
            alias: {
                'musicData': 'src/js/music',
                'svgData': 'src/svg',
                'animationClasses': 'src/js/animations',
                'schemeParams': 'src/js/schemeParams',
                'mp3Files': 'src/music'
            }
        },
		entry: {
			// Главный модуль для интерфейса и навигации
			'main': paths.src.js + '/main.js',
			// Музыка и анимация
			'media': paths.src.js + '/media.js',

			'bailecito': 'schemeParams/bailecito'
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
				{ test: /\.(jpe?g|png|gif)$/i, loader: 'url' },
				{ test: /\.mp3$/i, loader: 'file' },
				{ test: /\.svg$/i, loader: 'raw' }
			]
		},
		postcss: function () {
			return [autoprefixer, cssnext, precss];
		},
		plugins: [],
		callbackLoader: {
			requireMusic: function () {
				var requires = musicList.map(function (musicId) {
					return musicId + ': require("musicData/' + musicId + '.js");';
				}).join('\n');
				return '{' + requires + '}';
			},
			localize: function (textObj) {
				return '"' + textObj[lang] + '"';
			},
		}
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
