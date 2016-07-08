var gulp = require('gulp');
var config = require('./config.js');
var paths = config.paths;
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var gutil = require('gulp-util');
var del = require('promised-del');
var argv = require('yargs').argv;

gulp.task('clean-js', function () {
	return del([
		paths.dist.js + '/**/*.js',
		paths.dist.js + '/**/*.js.map',
		// paths.dist.js + '/**/*.mp3'
	]);
});

var buildDeps = ['clean-js', 'renderSvg'];
if (argv.mockmp3) {
	buildDeps.push('mock-mp3');
}

gulp.task('build-js', buildDeps, function (callback) {
	webpack(webpackConfig, function (err, stats) {
		if (err) {
			throw new gutil.PluginError('webpack', err);
		}
		gutil.log('[webpack]', stats.toString({}));
		callback();
	});
});

gulp.task('watch-js', ['connect', 'build-js'], function () {
	return gulp.watch([
		paths.src.js + '/**/*',
		paths.src.styles + '/**/*',
		paths.root + '/webpack.config.js',
		paths.root + '/schemesList.js'
	], ['build-js']);
});
