var webpack = require('webpack');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var config = require('./config.js');
var paths = config.paths;
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnext = require('cssnext');
var schemesList = require('./schemesList.js');

var webpackConfig = [
	{
		resolve: {
			root: paths.root,
			alias: {
				musicData: 'src/js/music',
				svgData: paths.temp.svgCompiled,
				infoData: 'src/info',
				animationClasses: 'src/js/animations',
				schemeParams: 'src/js/schemeParams',
				mp3Files: argv.mockmp3 ? paths.temp.mp3Mock : 'src/music'
			}
		},
		entry: {
			// Главный модуль для интерфейса и навигации
			main: paths.src.js + '/main.js',
		},
		output: {
			path:  paths.dist.js,
			filename: '[name].js'
		},
		devtool: 'source-map',
		module: {
			preLoaders: [
				{ test: /\.js$/, exclude: /node_modules/, loader: 'jscs' }
			],
			loaders: [
				{ test: /\.js$/, exclude: /node_modules/, loader: 'callback!babel?cacheDirectory&presets[]=es2015' },
				{ test: /\.json$/, loader: 'json' },
				{ test: /\.css$/, loader: 'style!css' },
				{ test: /\.scss$/, loader: "style!css!postcss" },
				{ test: /\.(jpe?g|png|gif)$/i, loader: 'url' },
				{ test: /\.mp3$/i, loader: 'file?path=../dist&name=music/[name].[hash:6].[ext]' },
				{ test: /\.svg$/i, exclude: /svg\.js/, loader: 'raw' },
				{ test: /\.inc$/i, loader: 'raw' }
			]
		},
		postcss: function () {
			return [autoprefixer, cssnext, precss];
		},
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				children: true
			})
		],
		callbackLoader: {
			requireSchemes: function () {
				return '{' + schemesList.map(function (id) {
					return id + ': function (callback) {' +
						'require.ensure([\'schemeParams/' + id + '.js\'], function (require) {' +
							'callback(require(\'schemeParams/' + id + '.js\'));' +
						'});' +
					'}';
				}).join(',\n') + '}';
			}
		}
	}
];

webpackConfig.push({
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.scss$/, loader: "style!css!postcss" },
			{ test: /\.(jpe?g|png|gif)$/i, loader: 'url' },
		]
	},
	entry: {
		styles: paths.src.js + '/styles.js',
	},
	output: {
		path:  paths.dist.js,
		filename: '[name].js'
	},
	plugins: [],
	postcss: function () {
		return [autoprefixer/*, cssnext, precss*/];
	}
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
		'vendor': [
			'expose?$!expose?jQuery!jquery/dist/jquery.js',
			'jplayer/dist/jplayer/jquery.jplayer.js',
			'jplayer/dist/jplayer/jquery.jplayer.swf',
			'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
		]
	},
	output: {
		path:  paths.dist.js,
		filename: '[name].js'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'global.$': 'jquery',
			'global.jQuery': 'jquery'
		})
	]
});

module.exports = webpackConfig;
