var gulp = require('gulp');
var config = require('./config.js');
var paths = config.paths;
var del = require('promised-del');

gulp.task('clean-html', function() {
    return del([config.paths.dist.html] + '/*.html');
});

gulp.task('copy-html', ['clean-html'], function () {
	return gulp.src(paths.src.html + '/*.html')
		.pipe(gulp.dest(paths.dist.html));
});

gulp.task('watch-html', ['connect', 'copy-html'], function() {
    return gulp.watch(paths.src.html, ['copy-html']);
});
