var gulp = require('gulp');
var config = require('./config.js');
var connect = require('gulp-connect');

gulp.task('connect', gulp.series('build', function (done) {
	connect.server({
		root: config.paths.dist.html,
		port: config.devServer.port
	});
	done();
}));

