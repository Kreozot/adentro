var gulp = require('gulp');
var config = require('./config.js');
var paths = config.paths;
var del = require('promised-del');
var posthtml = require('gulp-posthtml');
var posthtmlInclude = require('posthtml-include');
var posthtmlDoctype = require('posthtml-doctype');
var posthtmlExtendAttrs = require('posthtml-extend-attrs');
var version = require('../package.json').version;

gulp.task('clean-html', function () {
    return del(config.paths.dist.html + '/*.html');
});

gulp.task('process-html', ['clean-html'], function () {
    return gulp.src(paths.src.html + '/*.html')
        .pipe(posthtml([
        	posthtmlInclude({
        		root: paths.src.html,
        		encoding: 'utf-8'
        	}),
        	posthtmlDoctype({doctype: 'HTML 5'}),
        	posthtmlExtendAttrs({
        		attrsTree: {
        			'.version': {
        				'data-version': version
        			}
        		}
        	})
        ]))
        .pipe(gulp.dest(paths.dist.html));
});

gulp.task('watch-html', ['connect', 'process-html'], function () {
    return gulp.watch([paths.src.html + '/*.html', paths.src.html + '/html/*.html'], ['process-html']);
});
