var gulp = require('gulp');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var config = require('./config.js');
var paths = config.paths;
var gutil = require('gulp-util');

gulp.task('webpack-dev-server', function(callback) {
    var url = 'http://' + config.devServer.host + ':' + config.devServer.port;

    webpackConfig = webpackConfig.map(function (config) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        config.entry.forEach(function (entry) {
            entry.main.unshift('webpack-dev-server/client?' + url, 'webpack/hot/dev-server');
        })
        return config;
    });

    var compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
            contentBase: config.paths.dist.js
        })
        .listen(config.devServer.port, config.devServer.host, function(err) {
            if (err) {
                throw new gutil.PluginError('webpack-dev-server', err);
            }

            gutil.log('[webpack-dev-server]', gutil.colors.blue(url));
            callback();
        });
});

// gulp.task('watch', ['webpack-dev-server']);
