var gulp = require('gulp');
var config = require('./config.js');
var connect = require('gulp-connect');
var open = require('gulp-open');

gulp.task('connect', ['build'], function (done) {
	connect.server({
		root: config.paths.dist.html,
		port: config.devServer.port
	});
	done();
});

gulp.task('watch', ['watch-js', 'watch-html', 'watch-styles'], function () {
	gulp.src(__filename)
		.pipe(open({uri: 'http://localhost:' + config.devServer.port}));
});
