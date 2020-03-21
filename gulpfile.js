const gulp = require('gulp');
require('./gulp/svg');
require('./gulp/scripts');
require('./gulp/html');
require('./gulp/build');
require('./gulp/connect');
require('./gulp/ftp');
require('./gulp/mockMp3');
require('./gulp/watch');
// require('require-dir')('./gulp');

gulp.task('default', gulp.series('build'));
