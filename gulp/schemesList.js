var fs = require('fs');
var path = require('path');
var config = require('./config.js');

const FileHound = require('filehound');

module.exports = FileHound.create()
	.paths(config.paths.src.schemes)
	.depth(1)
	.directory()
	.findSync()
	.map(dirname => path.basename(dirname));
