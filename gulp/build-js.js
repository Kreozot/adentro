var gulp = require('gulp');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var gutil = require('gulp-util');
var argv = require('yargs').argv;

gulp.task('build-js', ['clean', 'renderSvg'], function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err)
        };
        gutil.log('[webpack]', stats.toString({}));
        callback();
    });
});
