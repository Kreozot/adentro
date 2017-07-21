import DanceAnimation from './commons/DanceAnimation';
import PairElement from './commons/elements/double/PairElement';
import RotatePairElement from './commons/elements/double/RotatePairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {getOppositePosition} from './commons/utils';
import {escondido} from './svg/svg';

export default class EscondidoAnimation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.width = 440;
		this.height = 440;
		this.startPos = {
			left: {x: 50, y: 390, angle: 225},
			top: {x: 50, y: 50, angle: 315},
			right: {x: 390, y: 50, angle: 45},
			bottom: {x: 390, y: 390, angle: 135}
		};

		this.elements = {
			giro: new PairElement(this, {
				left: escondido.giro_left,
				right: escondido.giro_right
			}),

			vuelta: new VueltaElement(this, escondido.vuelta),

			zapateo: new ZapateoElement(this),

			zarandeo: new ZarandeoElement(this, {
				left: escondido.zarandeo_left,
				top: escondido.zarandeo_top,
				right: escondido.zarandeo_right,
				bottom: escondido.zarandeo_bottom
			}),

			mediaVuelta: new PairElement(this, {
				left: escondido.media_vuelta_left,
				right: escondido.media_vuelta_right
			}),

			coronacion: new PairElement(this, {
				left: escondido.coronacion_left,
				right: escondido.coronacion_right
			}),

			esquina: new RotatePairElement(this, {
				left: escondido.esquina_left,
				top: escondido.esquina_top,
				right: escondido.esquina_right,
				bottom: escondido.esquina_bottom
			}, 270),

			balanceo1: new PairElement(this, {
				left: escondido.balanceo_left,
				top: escondido.balanceo_top,
				right: escondido.balanceo_right,
				bottom: escondido.balanceo_bottom
			}),

			balanceo2: new PairElement(this, {
				left: escondido.balanceo2_left,
				top: escondido.balanceo2_top,
				right: escondido.balanceo2_right,
				bottom: escondido.balanceo2_bottom
			})
		};
	}

	esquina(seconds, manPosition, beats) {
		this.clearPaths();
		const partSeconds = seconds / 4;
		const firstPartSeconds = partSeconds * 2;
		const partBeats = beats / 4;
		const manAngle = this.startPos[manPosition].angle;
		const womanAngle = this.startPos[getOppositePosition(manPosition)].angle;
		this.elements.esquina.drawPath(manPosition);
		this.elements.balanceo1.drawPath(manPosition, true);
		this.elements.balanceo2.drawPath(manPosition, true);

		if ((manPosition == 'left') || (manPosition == 'right')) {
			this.initRotateIcon(50, 220, 0, false);
			this.initRotateIcon(390, 220, 0, false);
		} else {
			this.initRotateIcon(220, 50, 90, false);
			this.initRotateIcon(220, 390, 90, false);
		}

		this.elements.balanceo1.setAngles(manAngle, womanAngle);
		this.elements.balanceo2.setAngles(manAngle, womanAngle);
		this.elements.balanceo1.easing = mina.easeout;
		this.elements.balanceo2.easing = mina.easeout;

		return this.elements.esquina.startAnimation(firstPartSeconds, partBeats * 2, manAngle, womanAngle)
			.then(() => this.elements.balanceo1.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD))
			.then(() => this.elements.balanceo2.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD));
	}

	vueltaGiro(seconds, manPosition, beats) {
		const firstPart = 6 / beats;
		const secondPart = 2 / beats;

		return this.elements.vuelta.fullAnimation(seconds * firstPart, beats * firstPart, manPosition)
			.then(() => this.elements.giro.fullAnimation(seconds * secondPart, beats * secondPart, manPosition));
	}

	zapateo(seconds, manPosition, beats) {
		this.setAtStart(manPosition);
		return this.elements.zapateo.fullAnimation(seconds, beats, manPosition);
	}

	zarandeo(seconds, manPosition, beats) {
		this.setAtStart(manPosition);
		this.clearPaths();
		this.elements.zarandeo.drawPath(getOppositePosition(manPosition));
		const parts = beats >= 8 ? 4 : 2;
		const partSeconds = seconds / parts;
		const partBeats = beats / parts;

		const zarandeoPromise = this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0.5)
			.then(() => this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, 0.5, 1));
		if (beats >= 8) {
			zarandeoPromise
				.then(() => this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0.5))
				.then(() => this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, 0.5, 1));
		}

		return zarandeoPromise;
	}

	mediaVuelta(seconds, manPosition, beats) {
		return this.elements.mediaVuelta.fullAnimation(seconds, beats, manPosition);
	}

	coronacion(seconds, manPosition, beats) {
		return this.elements.coronacion.fullAnimation(seconds, beats, manPosition);
	}
}
