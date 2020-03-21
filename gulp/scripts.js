const gulp = require('gulp');
const config = require('./config.js');
const paths = config.paths;
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const gutil = require('gulp-util');
const del = require('promised-del');
const argv = require('yargs').argv;

gulp.task('clean-js', async function () {
	return del([
		paths.dist.js + '/**/*.js',
		paths.dist.js + '/**/*.js.map',
		paths.dist.js + '/**/*.mp3'
	]);
});

const buildDeps = ['clean-js', 'build-svg'];
if (argv.mockmp3) {
	buildDeps.push('mock-mp3');
}

gulp.task('build-js', gulp.series(...buildDeps, function (callback) {
	webpack(webpackConfig, function (err, stats) {
		if (err) {
			throw new gutil.PluginError('webpack', err);
		}
		gutil.log('[webpack]', stats.toString({}));
		callback();
	});
}));
