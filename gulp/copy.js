var gulp = require('gulp');
var config = require('./config.js');
var paths = config.paths;

// Копирование всего, кроме стилей и JS
gulp.task('copy-html', ['clean-html'], function () {
	return gulp.src(paths.src.html + '/*.html')
		.pipe(gulp.dest(paths.dist.html));
});
