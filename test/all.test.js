var should = require("should");
var Nightmare = require('nightmare');
var vo = require('vo');
var config = require('../gulp/config.js');
require('mocha-generators').install();

describe("Adentro", function () {
	this.timeout(120000);

	it('should not breaks nowhere', function* () {
		var nightmare = Nightmare({
				//show: true
			})
			.on('page-error', function (error, stacktrace) {
				console.log(error + (stacktrace || ''));
				throw 'Error! ' + error;
			});
		var schemes = yield nightmare
			.goto('http://localhost:' + config.devServer.port)
			.evaluate(function () {
				return $('.menu-item').map(function() {
					return $(this).data('scheme');
				}).get();
			});

		for (var i = 0; i < schemes.length; i++) {
			var elems = yield nightmare
				.click('.menu-item[data-scheme="' + schemes[i] + '"]')
				.wait(1000)
				.evaluate(function () {
					return $('.element').map(function() {
						return $(this).attr('id');
					}).get();
				});

			for (var j = 0; j < elems.length; j++) {
				var time = yield nightmare
					.click('#' + elems[j])
					.wait(100)
					.evaluate(function () {
						return $('.element').map(function() {
							return $(this).attr('id');
						}).get();
					});
			};
		};
	});
});