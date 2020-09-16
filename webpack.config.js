const webpack = require('webpack');
const path = require('path');
const { argv } = require('yargs');
const { version } = require('./package.json');
const { paths } = require('./gulp/config.js');

const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const Visualizer = require('webpack-visualizer-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');

const { isWebpackDebug, isProduction } = argv;

const webpackConfig = {
	mode: isProduction ? 'production' : 'development',
	resolve: {
		modules: [
			path.join(paths.root, 'src'),
			'node_modules',
		],
		alias: {
			svgData: paths.temp.svgCompiled,
			snapsvg: 'snapsvg/dist/snap.svg.js',
		},
		extensions: ['.ts', '.js', '.json'],
	},
	entry: {
		// Главный модуль для интерфейса и навигации
		main: path.join(paths.src.js, 'main'),
		vendor: [
			'jquery/dist/jquery.js',
			'snapsvg/dist/snap.svg.js'
		]
	},
	output: {
		path: paths.dist.js,
		filename: '[name].js'
	},
	// devtool: 'eval',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
						}
					},
					{
						loader: 'ts-loader'
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
						}
					},
				],
			},
			{
				test: /\.ejs$/,
				use: [
					{
						loader: 'compile-ejs-loader',
						options: {
							htmlmin: false,
							compileDebug: true,
							beautify: false
						}
					}
				],
			},
			{
				test: /\.yaml$/,
				use: [
					'js-yaml-loader',
				],
			},
			{
				test: /\.s?css$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						}
					},
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.css$/,
				include: /node_modules/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						}
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				use: [
					'url-loader',
				],
			},
			{
				test: /\.mp3$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'dist/music',
							name: '[name].[hash:6].[ext]',
						}
					},
				],
			},
			{
				test: /\.svg$/i,
				use: [
					'raw-loader',
				],
			},
			{
				test: /\.inc$/i,
				use: [
					'raw-loader',
				],
			},
			{
				test: require.resolve('jquery/dist/jquery.js'),
				use: [
					{
						loader: 'expose-loader',
						options: 'jQuery'
					},{
						loader: 'expose-loader',
						options: '$'
					}
				]
			},
			{
				test: require.resolve('snapsvg/dist/snap.svg.js'),
				use: 'imports-loader?this=>window,fix=>module.exports=0'
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'global.$': 'jquery',
			'global.jQuery': 'jquery'
		}),
		Boolean(isProduction) && new SentryCliPlugin({
			include: './dist',
			release: version,
		}),
		isWebpackDebug && new StatsWriterPlugin({
			filename: 'stats.json'
		}),
		Boolean(isWebpackDebug) && new Visualizer(),
	].filter(Boolean),
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 10000,
			maxSize: 0,
			minChunks: 2,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				},
			},
		},
	},
	performance: {
		assetFilter: (assetFilename) => {
			return !assetFilename.endsWith('.mp3');
		}
	}
};

module.exports = webpackConfig;
