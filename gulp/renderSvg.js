var gulp = require('gulp');
var config = require('./config.js');
var paths = config.paths;
var connect = require('gulp-connect');
var Nightmare = require('nightmare');
var vo = require('vo');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var del = require('promised-del');

//TODO: оформить в виде loader-а с кешированием

var port = 8081;

function getSvgList(dir) {
	var files = fs.readdirSync(dir);
	return files.reduce(function(result, file) {
		if (path.extname(file) === '.svg') {
			result.push(file);
		}
		return result;
	}, []);
}

function saveSvg(svgData, filename) {
	fs.writeFileSync(filename, svgData);
}

function renderAndSaveSvg(done) {
	vo(function* () {
		var nightmare = Nightmare({
			show: false
		});

		var svgList = getSvgList(paths.src.svg);

		for (var i = 0; i < svgList.length; i++) {
			var svgData = yield nightmare
				.goto('http://localhost:' + port + '/index.html')
				.wait('#schema')
				.evaluate(function (filename) {
					document.querySelector('#schema').setAttribute('data', filename);
				}, svgList[i])
				.wait(300)
				.evaluate(function () {
					var svgData = document.querySelector('#schema').contentDocument.documentElement.outerHTML;
					return svgData;
				});

			saveSvg(svgData, paths.temp.svgCompiled + '/' + svgList[i]);
		}

		yield nightmare.end();
	})(function (error, result) {
		done();
		if (error) {
			return console.error(error)
		};
	});
}

gulp.task('clean-svg', function() {
    return del([paths.temp.svgCompiled]);
});

gulp.task('renderSvg', ['clean-svg'], function (done) {
	connect.server({
		root: paths.src.svg,
		port: port
	});

	mkdirp(paths.temp.svgCompiled, function() {
		renderAndSaveSvg(function() {
			connect.serverClose();
			done();
		})
	});
});

