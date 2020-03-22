const gulp = require('gulp');
const config = require('./config.js');
const paths = config.paths;
const open = require('gulp-open');

gulp.task('watch-js', gulp.series('connect', function watchJs() {
	return gulp.watch([
		paths.src.js + '/**/*',
		paths.src.music + '/**/*',
		paths.src.styles + '/**/*',
		paths.root + '/webpack.config.js',
		paths.root + '/schemesList.js'
	], gulp.series('build-js'));
}));

gulp.task('watch-html', gulp.series('connect', function watchHtml() {
	return gulp.watch([paths.src.templates + '/**/*.ejs'], gulp.series('process-html'));
}));

gulp.task('watch', gulp.series('watch-js', 'watch-html', function watch() {
	return gulp.src(__filename)
		.pipe(open({uri: 'http://localhost:' + config.devServer.port}));
}));
