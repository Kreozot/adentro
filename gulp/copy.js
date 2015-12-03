var gulp = require('gulp');
var config = require('./config.js');
var paths = config.paths;

// Копирование всего, кроме стилей и JS
gulp.task('copy-template', ['clean-template'], function () {
	var merged = mergeStream();

	modules.forEach(function (module) {
		var dirs = [
			paths.src.components + '/' + module + '/*.*',
			'!' + paths.src.components + '/' + module + '/*.scss',
			'!' + paths.src.components + '/' + module + '/*.js'
		];

		merged.add(
			gulp.src(dirs)
				.pipe(gulp.dest(paths.dist.template + '/' + module))
		);
	});
	return merged;
});
