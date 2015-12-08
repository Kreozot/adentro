var fs = require('fs');
var path = require('path');
var config = require('./config.js');

module.exports = fs.readdirSync(config.paths.src.schemes).reduce(function (list, filename) {
	if (path.extname(filename) === '.js') {
		list.push(path.basename(filename, '.js'));
	}
	return list;
}, []);