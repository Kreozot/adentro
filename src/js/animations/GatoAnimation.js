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

		this.elements = {
			giro: new PairElement(this, {
				left: gato.giro_left,
				right: gato.giro_right
			}),

			mediaVuelta: new PairElement(this, {
				left: gato.media_vuelta_left,
				right: gato.media_vuelta_right
			}),

			coronacion: new PairElement(this, {
				left: gato.coronacion_left,
				right: gato.coronacion_right
			}),

			zapateo: new ZapateoElement(this),

			zarandeo: new ZarandeoElement(this, {
				left: gato.zarandeo_left,
				right: gato.zarandeo_right
			}),

			vuelta: new VueltaElement(this, vuelta.vuelta)
		};
	}

	vuelta(seconds, manPosition, beats) {
		return this.elements.vuelta.fullAnimation(seconds, beats, manPosition);
	}

	giro(seconds, manPosition, beats) {
		return this.elements.giro.fullAnimation(seconds, beats, manPosition);
	}

	contraGiro(seconds, manPosition, beats) {
		return this.elements.giro.fullAnimation(seconds, beats, manPosition, this.DIRECTION_BACKWARD, 0, 1, 0);
	}

	zapateoZarandeo(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.zarandeo.drawPath(getOppositePosition(manPosition));
		const parts = beats >= 8 ? 4 : 2;
		const partSeconds = seconds / parts;
		const partBeats = beats / parts;
		this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		if (beats >= 8) {
			this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
		}

		this.elements.zapateo.drawPath(manPosition);
		this.elements.zapateo.startAnimation(seconds, beats);
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.elements.mediaVuelta.fullAnimation(seconds, beats, manPosition);
	}

	coronacion(seconds, manPosition, beats) {
		this.elements.coronacion.fullAnimation(seconds, beats, manPosition);
	}
}
