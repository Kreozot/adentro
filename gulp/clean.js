var gulp = require('gulp');
var del = require('promised-del');
var config = require('./config.js');

gulp.task('clean-svg', function() {
    return del([config.paths.src.svgCompiled]);
});

gulp.task('clean-html', function() {
    return del([config.paths.dist.html] + '/*.html');
});

gulp.task('clean', function() {
    return del([config.paths.dist.js]);
});
