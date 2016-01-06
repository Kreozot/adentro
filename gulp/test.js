var gulp = require('gulp');
var mocha = require('gulp-mocha');
var config = require('./config.js');

gulp.task('test', ['connect'], function () {
	return gulp.src([config.paths.src.tests + '/*.js'], {read: false})
		.pipe(mocha())
		.once('error', function (error) {
			console.log('Error: ' + error);
			process.exit(1);
		})
		.once('end', function () {
			process.exit(1);
		});
});