import DanceAnimation from './commons/DanceAnimation';
import PairElement from './commons/elements/double/PairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {getOppositePosition} from './commons/utils';
import {gato, vuelta} from './svg/svg';

export default class GatoAnimation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.width = 600;
		this.height = 325;
		this.startPos = {
			left: {x: 40, y: 160, angle: -90},
			right: {x: 560, y: 160, angle: 90}
		};

		this.giroElement = new PairElement(this, {
			left: gato.giro_left,
			right: gato.giro_right
		});

		this.mediaVueltaElement = new PairElement(this, {
			left: gato.media_vuelta_left,
			right: gato.media_vuelta_right
		});

		this.coronacionElement = new PairElement(this, {
			left: gato.coronacion_left,
			right: gato.coronacion_right
		});

		this.zapateoElement = new ZapateoElement(this);

		this.zarandeoElement = new ZarandeoElement(this, {
			left: gato.zarandeo_left,
			right: gato.zarandeo_right
		});

		this.vueltaElement = new VueltaElement(this, vuelta.vuelta);

	}

	vuelta(seconds, manPosition, beats) {
		this.vueltaElement.fullAnimation(seconds, beats, manPosition);
	}

	giro(seconds, manPosition, beats) {
		this.giroElement.fullAnimation(seconds, beats, manPosition);
	}

	contraGiro(seconds, manPosition, beats) {
		this.giroElement.fullAnimation(seconds, beats, manPosition, this.DIRECTION_BACKWARD, 0, 1, 0);
	}

	zapateoZarandeo(seconds, manPosition, beats) {
		this.clearPaths();
		this.zarandeoElement.drawPath(getOppositePosition(manPosition));
		const parts = beats >= 8 ? 4 : 2;
		const partSeconds = seconds / parts;
		const partBeats = beats / parts;
		this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		if (beats >= 8) {
			this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
		}

		this.zapateoElement.drawPath(manPosition);
		this.zapateoElement.startAnimation(seconds, beats);
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.mediaVueltaElement.fullAnimation(seconds, beats, manPosition);
	}

	coronacion(seconds, manPosition, beats) {
		this.coronacionElement.fullAnimation(seconds, beats, manPosition);
	}
}
