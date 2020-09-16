import * as cookie from 'cookie_js';
import locale from 'js/locale';

const TOUR_PASSED_LOCALES = {ru: 'tourPassed_ru', en: 'tourPassed_en'};

export default class Tour {
	startFirstTime() {
		if (cookie.get(locale.get(TOUR_PASSED_LOCALES)) != 'true') {
			this.start();
		}
	}

	start() {
		require.ensure(['hopscotch', '../styles/hopscotch.css', './tourConfig.js'], function (require) {
			require('../styles/hopscotch.css');
			var hopscotch = require('hopscotch');
			hopscotch.startTour(require('./tourConfig.js'));
			cookie.set(locale.get(TOUR_PASSED_LOCALES), 'true', {expires: 365, path: '/'});
		});
	}
}
