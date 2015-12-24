var gulp = require('gulp');
var config = require('./config.js');
var paths = config.paths;
var del = require('promised-del');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var precss = require('precss');

var stylesSrc = [
	paths.src.styles + '/menu.css',
	paths.src.styles + '/danceschema.css'
];

gulp.task('clean-styles', function() {
    return del([config.paths.dist.styles] + '/*.css');
});

gulp.task('build-styles', ['clean-styles'], function () {
	var postcssProcessors = [
		// precss(),
		autoprefixer({
			browsers: ['> 1%', 'IE 9', 'Firefox > 20']
		})
	];

	return gulp.src(stylesSrc)
		.pipe(postcss(postcssProcessors))
		.pipe(gulp.dest(paths.dist.styles));
});

gulp.task('watch-styles', ['connect', 'build-styles'], function() {
    return gulp.watch(stylesSrc, ['build-styles']);
});
