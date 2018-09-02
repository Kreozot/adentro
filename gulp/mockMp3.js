const gulp = require('gulp');
const rename = require('gulp-rename');
const del = require('promised-del');
const mergeStream = require('merge-stream');
const config = require('./config.js');
const Promise = require('bluebird');
const readdir = require('recursive-readdir');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));

/**
 * Получение списка mp3-композиций для подмены
 * @return {Promise} Promise, возвращающий массив объектов {dir, file}
 */
function getMp3List() {
	const mp3Regexp = /require\('.\/([\S]+.mp3)'\)/;
	const jsRegexp = /\.js$/;

	return Promise.resolve(readdir(config.paths.src.musicData))
		// Получаем все js-файлы в папке с музыкой
		.filter((filename) => jsRegexp.test(filename))
		// Получаем из файлов описания названия файлов и папок композиций
		.map((jsFilepath) => fs.readFileAsync(jsFilepath)
			.then((buffer) => String(buffer))
			.then((data) => {
				const match = mp3Regexp.exec(data);
				const dirname = path.dirname(jsFilepath);
				return match ? path.join(dirname, match[1]) : null;
			})
		)
		// Убираем пустые вхождения
		.filter((filepath) => filepath);
}

gulp.task('clean-mp3-mock', function () {
	return del([config.paths.temp.mp3Mock]);
});

gulp.task('mock-mp3', ['clean-mp3-mock'], function () {
	return getMp3List()
		.then((mp3List) => {
			const merged = mergeStream();
			mp3List.forEach((mp3Filepath) => {
				merged.add(
					gulp.src(config.files.mockMp3)
						.pipe(rename(path.relative(config.paths.src.musicData, mp3Filepath)))
						.pipe(gulp.dest(config.paths.src.musicData))
				);
			});
			return merged;
		});
});
