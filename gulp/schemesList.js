const path = require('path');
const FileHound = require('filehound');
const config = require('./config.js');

module.exports = FileHound.create()
	.paths(config.paths.src.schemes)
	.depth(1)
	.directory()
	.findSync()
	.map(dirname => path.basename(dirname));
