const gulp = require('gulp');
const config = require('./config.js');
const open = require('gulp-open');

gulp.task('watch-js', gulp.series('connect', function watchJs() {
	gulp.watch([
		'./src/js/**/*',
		'./src/music/**/*',
		'./src/styles/**/*',
		'./webpack.config.js',
		'./gulp/schemesList.js',
	], gulp.series('build-js'));
}));

gulp.task('watch-html', gulp.series('connect', function watchHtml() {
	gulp.watch([
		'./src/templates/**/*.ejs',
	], gulp.series('process-html'));
}));

gulp.task('watch', gulp.series('watch-js', 'watch-html', function watch() {
	return gulp.src(__filename)
		.pipe(open({uri: 'http://localhost:' + config.devServer.port}));
}));
