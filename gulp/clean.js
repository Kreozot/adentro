var gulp = require('gulp');
var del = require('promised-del');
var config = require('./config.js');

gulp.task('clean', function() {
    return del([config.paths.dist.js]);
});
