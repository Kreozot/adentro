import QuatroElement from './commons/elements/quatro/QuatroElement';
import Dance4Animation from './commons/Dance4Animation';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {getOppositePosition} from './commons/utils';

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
				left: 'm 50,130 60,60 60,-60 -60,-60 z',
				right: 'm 390,130 -60,-60 -60,60 60,60 z'
			}, {
				left: 'm 50,310 60,60 60,-60 -60,-60 z',
				right: 'm 390,310 -60,-60 -60,60 60,60 z'
			}),

			giro: new QuatroElement(this, {
				left: 'm 50,130 c 0,35 25,60 60,60 35,0 60,-25 60,-60 0,-35 -25,-60 -60,-60 -35,0 -60,25 -60,60 z',
				right: 'm 390,130 c 0,-35 -25,-60 -60,-60 -35,0 -60,25 -60,60 0,35 25,60 60,60 35,0 60,-25 60,-60 z'
			}, {
				left: 'm 50,310 c 0,35 25,60 60,60 35,0 60,-25 60,-60 0,-35 -25,-60 -60,-60 -35,0 -60,25 -60,60 z',
				right: 'm 390,310 c 0,-35 -25,-60 -60,-60 -35,0 -60,25 -60,60 0,35 25,60 60,60 35,0 60,-25 60,-60 z'
			}),

			mediaVuelta: new QuatroElement(this, {
				left: 'm 50,130 c -30,60 -30,120 0,180 66,132 274,132 340,0',
				right: 'M 390,130 C 314,0 116,-2 50,130 20,190 20,250 50,310'
			}, {
				left: 'm 50,310 c 76,130 274,132 340,0 30,-60 30,-120 0,-180',
				right: 'M 390,310 C 420,250 420,190 390,130 324,-2 116,-2 50,130'
			}),

			vueltaGradient: new VueltaGradientElement(this,
				'm 50,310 c 76,130 274,132 340,0 30,-60 30,-120 0,-180 C 324,-2 116,-2 50,130 20,190 20,260 50,310 z'),

			zapateo1: new ZapateoElement(this, this.man),

			zapateo2: new ZapateoElement(this, this.man2),

			zarandeo1: new ZarandeoElement(this, {
				left: 'm 50,130 60,60 60,-60 -60,-60 z',
				right: 'm 390,130 -60,-60 -60,60 60,60 z'
			}, this.woman),

			zarandeo2: new ZarandeoElement(this, {
				left: 'm 50,310 60,60 60,-60 -60,-60 z',
				right: 'm 390,310 -60,-60 -60,60 60,60 z'
			}, this.woman2),

			coronacion: new QuatroElement(this, {
				left: 'm 50,130 c 0,25 70,40 100,40 30,0 55,-20 55,-40 0,-15 -10,-25 -25,-25 -15,0 -25,10 -25,25 0,15 10,25 25,25 15,0 25,-5 30,-20',
				right: 'm 390,130 c 0,-25 -70,-40 -100,-40 -30,0 -55,20 -55,40 0,15 10,25 25,25 15,0 25,-10 25,-25 0,-15 -10,-25 -25,-25 -15,0 -25,5 -30,20'
			}, {
				left: 'm 50,310 c 0,25 70,40 100,40 30,0 55,-20 55,-40 0,-15 -10,-25 -25,-25 -15,0 -25,10 -25,25 0,15 10,25 25,25 15,0 25,-5 30,-20',
				right: 'm 390,310 c 0,-25 -70,-40 -100,-40 -30,0 -55,20 -55,40 0,15 10,25 25,25 15,0 25,-10 25,-25 0,-15 -10,-25 -25,-25 -15,0 -25,5 -30,20'
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
