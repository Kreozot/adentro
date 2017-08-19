const gulp = require('gulp');
const config = require('./config.js');
const paths = config.paths;
const fs = require('fs');
const del = require('promised-del');
const posthtml = require('gulp-posthtml');
const ejs = require('gulp-ejs');
const gutil = require('gulp-util');
const version = require('../package.json').version;
const rename = require('gulp-rename');
const yaml = require('js-yaml');
const argv = require('yargs').argv;

gulp.task('clean-html', function () {
	return del([
		config.paths.dist.html + '/*.html'
	]);
});

gulp.task('copy-static', ['clean-html'], function () {
	return gulp.src(paths.src.static + '/**/*')
		.pipe(gulp.dest(paths.dist.html));
});

gulp.task('process-html', ['clean-html', 'copy-static'], function () {
	return gulp.src(paths.src.templates + '/*.ejs')
		.pipe(ejs({
			version,
			production: Boolean(argv.production),
			menuItems: yaml.safeLoad(fs.readFileSync(`./src/config/menu.yaml`))
		}).on('error', gutil.log))
		.pipe(posthtml([
			require('htmlnano')({
				removeEmptyAttributes: false,
				removeRedundantAttributes: false,
				collapseWhitespace: 'conservative',
				mergeStyles: false,
				mergeScripts: false,
				minifyJs: false,
				minifySvg: false
			})
		]))
		.pipe(rename({
			extname: '.html'
		}))
		.pipe(gulp.dest(paths.dist.html));
});

gulp.task('watch-html', ['connect', 'process-html'], function () {
	return gulp.watch([paths.src.templates + '/**/*.ejs'], ['process-html']);
});
