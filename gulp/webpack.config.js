const webpack = require('webpack');
const gutil = require('gulp-util');
const path = require('path');
const argv = require('yargs').argv;

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
		// devtool: 'eval',
		devtool: 'source-map',
		module: {
			loaders: [
				{test: /\.js$/, exclude: /node_modules/, loader: 'callback!babel?cacheDirectory&sourceMap=true'},
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
				sourceMap: true,
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
