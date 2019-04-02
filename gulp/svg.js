const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const {paths} = require('./config.js');
const cheerio = require('cheerio');
const del = require('promised-del');

const svg = [
	'arrows.svg',
	'bailecito.svg',
	'escondido.svg',
	'gato.svg',
	'huayra_muyoj.svg',
	'remedio.svg',
	'vuelta.svg',
	'zamba.svg',
];

function getSvgPaths(svgFile) {
	const svg = String(fs.readFileSync(path.join(paths.src.animationSvg, svgFile)));
	const $ = cheerio.load(svg, {
		xmlMode: true,
		decodeEntities: true
	});
	let result = {};
	$('path').each((i, pathTag) => {
		const $pathTag = $(pathTag);
		result[$pathTag.attr('id')] = $pathTag.attr('d');
	});
	return result;
}

function getSvgElement(svgFile, selector) {
	const svg = String(fs.readFileSync(path.join(paths.src.animationSvg, svgFile)));
	const $ = cheerio.load(svg, {
		xmlMode: true,
		decodeEntities: true
	});
	const svgCode = $.html(selector);
	const svgCodeString = svgCode.replace(/(\r|\n|  )/g, '');
	return svgCodeString;
}


gulp.task('clean-svg', function () {
	return del([
		path.join(paths.temp.svgCompiled, '**/*'),
	]);
});

gulp.task('build-svg', ['clean-svg'], function () {
	if (!fs.existsSync(paths.temp.svgCompiled)) {
		fs.mkdirSync(paths.temp.svgCompiled);
	}

	svg.forEach((svgFile) => {
		const svgPaths = getSvgPaths(svgFile);
		const name = path.basename(svgFile, '.svg');
		fs.writeFileSync(path.join(paths.temp.svgCompiled, `${ name }.paths.json`), JSON.stringify(svgPaths, null, '\t'));
	});

	const svgElements = {
		man: getSvgElement('figures.svg', '#man'),
		woman: getSvgElement('figures.svg', '#woman'),
	};
	fs.writeFileSync(path.join(paths.temp.svgCompiled, 'figures.elements.json'), JSON.stringify(svgElements, null, '\t'));
});
