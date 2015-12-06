var gulp = require('gulp');
var config = require('./config.js');
var connect = require('gulp-connect');
var Nightmare = require('nightmare');
var vo = require('vo');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var port = 8080;

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
			show: true,
			width: 1024,
			height: 768
		});

		var svgList = getSvgList(config.paths.src.svg);

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

			saveSvg(svgData, config.paths.src.svgCompiled + '/' + svgList[i]);
		}

		yield nightmare.end();
		return link;
	})(function (error, result) {
		done();
		if (error) {
			return console.error(error)
		};
		console.log(result);
	});
}

gulp.task('renderSvg', function () {
	connect.server({
		root: config.paths.src.svg,
		port: port
	});

	mkdirp(config.paths.src.svgCompiled, function() {
		renderAndSaveSvg(connect.serverClose)
	});
});

