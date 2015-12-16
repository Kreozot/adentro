var webpack = require('webpack');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var config = require('./config.js');
var paths = config.paths;
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnext = require('cssnext');
var schemesList = require('./schemesList.js');

var languages = ['en', 'ru'];

var webpackConfig = languages.map(function (lang) {
	return {
        resolve: {
            root: config.paths.root,
            alias: {
                'musicData': 'src/js/music',
                'svgData': 'src/svg_compiled',
                'infoData': 'src/info',
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

			// 'schemes': paths.src.js + '/schemes.js',
			// 'bailecito': 'schemeParams/bailecito',
			// 'caramba': 'schemeParams/caramba',
			// 'chacarera': 'schemeParams/chacarera',
			// 'chacarera_6': 'schemeParams/chacarera_6',
			// 'chacarera_doble': 'schemeParams/chacarera_doble',
			// 'chacarera_doble_6': 'schemeParams/chacarera_doble_6',
			// 'escondido': 'schemeParams/escondido',
			// 'gato': 'schemeParams/gato',
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
				{ test: /\.js$/, exclude: /node_modules/, loader: 'babel?cacheDirectory&presets[]=es2015' },
				{ test: /\.json$/, loader: 'json' },
				{ test: /\.css$/, loader: 'style!css' },
				{ test: /\.scss$/, loader: "style!css!postcss" },
				{ test: /\.(jpe?g|png|gif)$/i, loader: 'url' },
				{ test: /\.mp3$/i, loader: 'file?name=../music/[name].[hash:6].[ext]' },
				{ test: /\.svg$/i, exclude: /svg\.js/, loader: 'raw' },
				{ test: /\.inc$/i, loader: 'raw' }
			]
		},
		postcss: function () {
			return [autoprefixer, cssnext, precss];
		},
		plugins: [],
		callbackLoader: {
			requireMusic: function () {

				var ensureList = schemesList.map(function (id) {
					var result = 'module.exports.' + id + ' = ';
					return '"schemeParams/' + id + '.js"';
				}).join();

				var requireList = musicList.map(function (musicId) {
					return musicId + ': require("schemeParams/' + musicId + '.js");';
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
	module: {
		loaders: [
			{ test: /\.swf$/i, loader: 'file?name=[name].[ext]' }
		]
	},
	entry: {
		// Сторонние библиотеки
		'vendor.main': [
			'expose?$!expose?jQuery!jquery/dist/jquery.js',
			'hopscotch'
		],
		'vendor.media': [
			'jplayer/dist/jplayer/jquery.jplayer.min.js',
			'jplayer/dist/jplayer/jquery.jplayer.swf',
			'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
		]
	},
	output: {
		path:  paths.dist.js,
		filename: '[name].js'
	}
});

module.exports = webpackConfig;
