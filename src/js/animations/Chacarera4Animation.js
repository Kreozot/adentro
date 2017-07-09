import QuatroElement from './commons/elements/quatro/QuatroElement';
import Dance4Animation from './commons/Dance4Animation';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {getOppositePosition} from './commons/utils';
import {escondido} from './svg/svg';

class VueltaGradientElement extends VueltaElement {
	constructor(animation, pathStr) {
		super(animation, pathStr);
	}

	animationFunction(lengthMs, beats, direction, startPart, stopPart) {
		//Если идём из начала в конец, то инвертируем цвета градиента
		if (startPart > stopPart) {
			this.setColors(this.rightColor, this.leftColor);
		}

		var self = this;
		this.animation.animations[this.animation.animations.length] = Snap.animate(startPart * this.pathLength,
			stopPart * this.pathLength,
			function (value) {
				this.lastValue = value;
				self.drawGradientAtPoint(value);
			}, lengthMs, mina.linear);
	}
}

export default class Chacarera4Animation extends Dance4Animation {
	constructor(id) {
		super(id);

		this.width = 440;
		this.height = 440;

		this.startPos = {
			left1: {x: 50, y: 130, angle: -90},
			right1: {x: 390, y: 130, angle: 90},
			left2: {x: 50, y: 310, angle: -90},
			right2: {x: 390, y: 310, angle: 90}
		};

		this.elements = {
			avance: new QuatroElement(this, {
				left: escondido.avance_1_left,
				right: escondido.avance_1_right
			}, {
				left: escondido.avance_2_left,
				right: escondido.avance_2_right
			}),

			giro: new QuatroElement(this, {
				left: escondido.giro_1_left,
				right: escondido.giro_1_right
			}, {
				left: escondido.giro_2_left,
				right: escondido.giro_2_right
			}),

			mediaVuelta: new QuatroElement(this, {
				left: escondido.media_vuelta_1_left,
				right: escondido.media_vuelta_1_right
			}, {
				left: escondido.media_vuelta_2_left,
				right: escondido.media_vuelta_2_right
			}),

			vueltaGradient: new VueltaGradientElement(this, escondido.vuelta_all),

			zapateo1: new ZapateoElement(this, this.man),

			zapateo2: new ZapateoElement(this, this.man2),

			zarandeo1: new ZarandeoElement(this, {
				left: escondido.avance_1_left,
				right: escondido.avance_1_right
			}, this.woman),

			zarandeo2: new ZarandeoElement(this, {
				left: escondido.avance_2_left,
				right: escondido.avance_2_right
			}, this.woman2),

			coronacion: new QuatroElement(this, {
				left: escondido.coronacion_1_left,
				right: escondido.coronacion_1_right
			}, {
				left: escondido.coronacion_2_left,
				right: escondido.coronacion_2_right
			})
		};
	}

	avance(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.avance.drawPath(manPosition);
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;
		this.elements.avance.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.elements.avance.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
	}

	giro(seconds, manPosition, beats) {
		this.elements.giro.fullAnimation(seconds, beats, manPosition);
	}

	contraGiro(seconds, manPosition, beats) {
		this.elements.giro.fullAnimation(seconds, beats, manPosition, this.DIRECTION_BACKWARD, 0, 1, 0);
	}

	vuelta(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.vueltaGradient.drawPath(manPosition);
		this.elements.vueltaGradient.startAnimation(seconds, beats);

		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.elements.mediaVuelta.drawPath(manPosition, true);
		this.elements.mediaVuelta.startAnimation(partSeconds, partBeats);
		this.elements.mediaVuelta.drawPath(getOppositePosition(manPosition), true);
		this.elements.mediaVuelta.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds);
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.vueltaGradient.drawPath(manPosition);
		this.elements.vueltaGradient.startAnimation(seconds, beats, this.DIRECTION_FORWARD, 0, 0, 0.5);

		this.elements.mediaVuelta.drawPath(manPosition, true);
		this.elements.mediaVuelta.startAnimation(seconds, beats);
	}

	zapateoZarandeo(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.zarandeo1.drawPath(getOppositePosition(manPosition));
		this.elements.zarandeo2.drawPath(getOppositePosition(manPosition));
		const parts = beats >= 8 ? 4 : 2;
		const partSeconds = seconds / parts;
		const partBeats = beats / parts;
		this.elements.zarandeo1.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.elements.zarandeo1.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		this.elements.zarandeo2.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.elements.zarandeo2.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		if (beats >= 8) {
			this.elements.zarandeo1.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.elements.zarandeo1.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
			this.elements.zarandeo2.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.elements.zarandeo2.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
		}

		this.elements.zapateo1.drawPath(manPosition + 1);
		this.elements.zapateo2.drawPath(manPosition + 2);
		this.elements.zapateo1.startAnimation(seconds, beats);
		this.elements.zapateo2.startAnimation(seconds, beats);
	}

	coronacion(seconds, manPosition, beats) {
		this.elements.coronacion.fullAnimation(seconds, beats, manPosition);
	}
}
