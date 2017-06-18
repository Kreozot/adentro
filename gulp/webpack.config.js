const webpack = require('webpack');
const gutil = require('gulp-util');
const argv = require('yargs').argv;
const config = require('./config.js');
const paths = config.paths;
// const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
const Visualizer = require('webpack-visualizer-plugin');
const schemesList = require('./schemesList.js');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const htmlmin = require('html-minifier');
const schemeTemplate = ejs.compile(String(fs.readFileSync('./src/schemeTemplate/scheme.ejs')), {
	filename: path.resolve('./src/schemeTemplate/scheme.ejs')
});

const postcssPlugins = [
	require('cssnano')(),
	require('autoprefixer')(),
	require('postcss-cssnext')(),
	require('precss')()
];

var webpackConfig = [
	{
		resolve: {
			root: paths.root,
			alias: {
				musicData: 'src/music',
				svgData: paths.temp.svgCompiled,
				infoData: 'src/info',
				animationClasses: 'src/js/animations',
				schemeParams: 'src/music',
				schemeTemplate: 'src/schemeTemplate',
				styles: 'src/styles',
				mp3Files: argv.mockmp3 ? paths.temp.mp3Mock : 'src/music'
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
				{test: /\.js$/, exclude: /node_modules/, loader: 'callback!babel?cacheDirectory&presets[]=es2015'},
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
						require.ensure(['schemeParams/${id}'], function (require) {
							callback(require('schemeParams/${id}'));
						}, '${id}');
					}`;
			}).join(',\n') + '}',
			compileSchemeTemplate: id => {
				const scheme = yaml.safeLoad(fs.readFileSync(`./src/music/${id}/scheme.yaml`));
				const svgSource = htmlmin.minify(schemeTemplate({scheme}), {
					collapseWhitespace: true
				});
				return `\`${svgSource}\``;
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
