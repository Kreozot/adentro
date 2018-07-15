const webpack = require('webpack');
const gutil = require('gulp-util');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const argv = require('yargs').argv;

const schemesList = require('./schemesList.js');
const config = require('./config.js');
const paths = config.paths;
// const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
// const Visualizer = require('webpack-visualizer-plugin');

const postcssPlugins = [
	require('cssnano')(),
	require('autoprefixer')(),
	require('postcss-cssnext')(),
	require('precss')(),
	// require('postcss-mixins')()
];

var webpackConfig = [
	{
		resolve: {
			root: path.join(paths.root, 'src'),
			alias: {
				svgData: paths.temp.svgCompiled,
			}
		},
		entry: {
			// Главный модуль для интерфейса и навигации
			main: paths.src.js + '/main.js',
		},
		output: {
			path: paths.dist.js,
			filename: '[name].js'
		},
		devtool: 'source-map',
		module: {
			loaders: [
				{test: /\.js$/, exclude: /node_modules/, loader: 'callback!babel?cacheDirectory&presets[]=es2015&presets[]=stage-2'},
				{test: /\.ejs$/, loader: 'ejs-compiled'},
				{test: /\.json$/, loader: 'json'},
				{test: /\.yaml$/, loader: 'json!yaml'},
				{test: /\.s?css$/, loader: 'style!css!postcss'},
				{test: /\.(jpe?g|png|gif)$/i, loader: 'url'},
				{test: /\.mp3$/i, loader: 'file?path=../dist&name=music/[name].[hash:6].[ext]'},
				{test: /\.svg$/i, loader: 'raw'},
				{test: /\.inc$/i, loader: 'raw'}
			]
		},
		postcss: function () {
			return postcssPlugins;
		},
		'ejs-compiled-loader': {
			htmlmin: false,
			compileDebug: true,
			beautify: false
		},
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				children: true,
				minChunks: 3
			}),
			// new StatsWriterPlugin({
			// 	filename: 'main.stats.json'
			// })
			// new Visualizer()
		],
		callbackLoader: {
			requireSchemes: () => '{' + schemesList.map(id => {
				return `${id}: function (callback) {
						require.ensure(['music/${id}'], function (require) {
							callback(require('music/${id}'));
						}, '${id}');
					}`;
			}).join(',\n') + '}',
			getSvgPaths: svgFile => {
				const svg = String(fs.readFileSync(path.join(paths.src.animationSvg, svgFile)));
				const $ = cheerio.load(svg, {
					xmlMode: true,
					decodeEntities: true
				});
				let result = {};
				$('path').each((i, pathTag) => {
					const $pathTag = $(pathTag);
					result[$pathTag.attr('id')] = $pathTag.attr('d');
				});
				return JSON.stringify(result);
			},
			getSvgElement: (svgFile, selector) => {
				const svg = String(fs.readFileSync(path.join(paths.src.animationSvg, svgFile)));
				const $ = cheerio.load(svg, {
					xmlMode: true,
					decodeEntities: true
				});
				return `\`'${$.html(selector).replace(/\n/g, '')}\``;
			}
		}
	}
];

webpackConfig.push({
	module: {
		loaders: [
			{test: /\.s?css$/, loader: 'style!css!postcss'},
			{test: /\.(jpe?g|png|gif)$/i, loader: 'url'},
		]
	},
	entry: {
		styles: paths.src.js + '/styles.js',
	},
	output: {
		path: paths.dist.js,
		filename: '[name].js'
	},
	plugins: [],
	postcss: function () {
		return postcssPlugins;
	}
});

webpackConfig.push({
	module: {
		loaders: [
			{test: /\.swf$/i, loader: 'file?name=[name].[ext]'}
		]
	},
	entry: {
		// Сторонние библиотеки
		vendor: [
			'expose?$!expose?jQuery!jquery/dist/jquery.js',
			'jplayer/dist/jplayer/jquery.jplayer.js',
			'jplayer/dist/jplayer/jquery.jplayer.swf',
			'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
		]
	},
	output: {
		path: paths.dist.js,
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

// Минификация при сборке в продакшн
if (argv.production) {
	gutil.log('Production mode');

	webpackConfig = webpackConfig.map(config => {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: false,
				comments: false,
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
		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': '"production"',
				'process.env.BLUEBIRD_WARNINGS': 0,
			})
		);
		config.devtool = 'source-map';
		return config;
	});
}

module.exports = webpackConfig;
