import {cookie} from 'cookie_js';

export default class Tour {
	startFirstTime() {
		if (cookie.get(localize({ru: 'tourPassed_ru', en: 'tourPassed_en'})) != 'true') {
			this.start();
		}
	}

	start() {
		require.ensure(['hopscotch', '../styles/hopscotch.css', './tourConfig.js'], function (require) {
			require('../styles/hopscotch.css');
			var hopscotch = require('hopscotch');
			hopscotch.startTour(require('./tourConfig.js'));
			cookie.set(localize({ru: 'tourPassed_ru', en: 'tourPassed_en'}), 'true', {expires: 365, path: '/'});
		});
	}
}
