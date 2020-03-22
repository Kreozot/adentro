const gulp = require('gulp');
const config = require('./config.js');
const gulpConnect = require('gulp-connect');

gulp.task('connect', gulp.series('build', function connect(done) {
	gulpConnect.server({
		root: config.paths.dist.html,
		port: config.devServer.port
	});
	done();
}));

