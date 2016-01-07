var gulp = require('gulp');
var rename = require('gulp-rename');
var del = require('promised-del');
var mergeStream = require('merge-stream');
var config = require('./config.js');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

function getMp3List() {
	var mp3Regexp = /require\('mp3Files\/([\S]+)\/([\S]+.mp3)'\)/;

	return fs.readdirAsync(config.paths.src.musicData)
		.map(function (filename) {
			return config.paths.src.musicData + '/' + filename;
		})
		.filter(function (filename) {
			return fs.statAsync(filename)
				.then(function (stat) {
					return stat.isFile();
				});
		})
		.map(function (filename) {
			return fs.readFileAsync(filename)
				.then(function (data) {
					var match = mp3Regexp.exec(data);
					return {
						dir: match[1],
						file: match[2]
					};
				})
		})
}

gulp.task('clean-mp3-mock', function() {
    return del([config.paths.temp.mp3Mock]);
});

gulp.task('mock-mp3', ['clean-mp3-mock'], function () {
	return getMp3List()
		.then(function (mp3List) {
			var merged = mergeStream();
			mp3List.forEach(function (mp3) {
				merged.add(
					gulp.src(config.files.mockMp3)
						.pipe(rename(mp3.file))
						.pipe(gulp.dest(config.paths.temp.mp3Mock + '/' + mp3.dir))
				);
			});
			return merged;
		});
})