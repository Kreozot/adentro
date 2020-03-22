const gulp = require('gulp');

gulp.task('build', gulp.series('build-js', 'process-html'));
