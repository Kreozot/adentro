import hopscotch from 'hopscotch';
import config from './tourConfig.js';

//TODO hopscotch lazy loading

class Tour {
	start() {
		if ($.cookie('tourPassed_' + i18n.lng()) != "true") {
			hopscotch.startTour(config);
			$.cookie('tourPassed_' + i18n.lng(), 'true', {expires: 365, path: '/'});
		}
	}
}
