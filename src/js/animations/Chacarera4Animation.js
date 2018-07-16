import Promise from 'bluebird';
import QuatroElement from './commons/elements/quatro/QuatroElement';
import Dance4Animation from './commons/Dance4Animation';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {DIRECTIONS} from './commons/const';
import {getOppositePosition} from './commons/utils';
import svg from 'js/animations/svg';

class VueltaGradientElement extends VueltaElement {
	constructor(animation, pathStr) {
		super(animation, pathStr);
	}

	animationFunction({lengthMs, startPart = 0, stopPart = 1}) {
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
				left: svg.escondido.avance_1_left,
				right: svg.escondido.avance_1_right
			}, {
				left: svg.escondido.avance_2_left,
				right: svg.escondido.avance_2_right
			}),

			giro: new QuatroElement(this, {
				left: svg.escondido.giro_1_left,
				right: svg.escondido.giro_1_right
			}, {
				left: svg.escondido.giro_2_left,
				right: svg.escondido.giro_2_right
			}),

			mediaVuelta: new QuatroElement(this, {
				left: svg.escondido.media_vuelta_1_left,
				right: svg.escondido.media_vuelta_1_right
			}, {
				left: svg.escondido.media_vuelta_2_left,
				right: svg.escondido.media_vuelta_2_right
			}),

			vueltaGradient: new VueltaGradientElement(this, svg.escondido.vuelta_all),

			zapateo1: new ZapateoElement(this, this.man),

			zapateo2: new ZapateoElement(this, this.man2),

			zarandeo1: new ZarandeoElement(this, {
				left: svg.escondido.avance_1_left,
				right: svg.escondido.avance_1_right
			}, this.woman),

			zarandeo2: new ZarandeoElement(this, {
				left: svg.escondido.avance_2_left,
				right: svg.escondido.avance_2_right
			}, this.woman2),

			coronacion: new QuatroElement(this, {
				left: svg.escondido.chacarera_4_coronacion1_left,
				right: svg.escondido.chacarera_4_coronacion1_right
			}, {
				left: svg.escondido.chacarera_4_coronacion2_left,
				right: svg.escondido.chacarera_4_coronacion2_right
			})
		};
	}

	avance(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.avance.drawPath(manPosition);
		const partSeconds = lengthS / 2;
		const partBeats = beats / 2;

		return this.elements.avance.startAnimation({lengthS: partSeconds, beats: partBeats, startPart: 0, stopPart: 0.5})
			.then(() => this.elements.avance.startAnimation({lengthS: partSeconds, beats: partBeats, direction: DIRECTIONS.BACKWARD, startPart: 0.5, stopPart: 1}));
	}

	giro(lengthS, manPosition, beats) {
		return this.elements.giro.fullAnimation({lengthS, beats, manPosition});
	}

	contraGiro(lengthS, manPosition, beats) {
		return this.elements.giro.fullAnimation({lengthS, beats, manPosition, direction: DIRECTIONS.BACKWARD, startPart: 1, stopPart: 0});
	}

	vuelta(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.vueltaGradient.drawPath(manPosition);
		this.elements.vueltaGradient.startAnimation({lengthS, beats});

		const partSeconds = lengthS / 2;
		const partBeats = beats / 2;

		// TODO: Promise
		this.elements.mediaVuelta.drawPath(manPosition, true);
		return this.elements.mediaVuelta.startAnimation({lengthS: partSeconds, beats: partBeats})
			.then(() => {
				this.elements.mediaVuelta.drawPath(getOppositePosition(manPosition), true);
				return this.elements.mediaVuelta.startAnimation({lengthS: partSeconds, beats: partBeats, direction: DIRECTIONS.FORWARD});
			});
	}

	mediaVuelta(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.vueltaGradient.drawPath(manPosition);
		this.elements.mediaVuelta.drawPath(manPosition, true);
		return Promise.all([
			this.elements.vueltaGradient.startAnimation({lengthS, beats, startPart: 0, stopPart: 0.5}),
			this.elements.mediaVuelta.startAnimation({lengthS, beats})
		]);
	}

	zapateoZarandeo(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.zarandeo1.drawPath(getOppositePosition(manPosition));
		this.elements.zarandeo2.drawPath(getOppositePosition(manPosition));
		const parts = beats >= 8 ? 4 : 2;
		const partOptions = {
			lengthS: lengthS / parts,
			beats: beats / parts
		};
		const forwardOptions = {
			...partOptions,
			startPart: 0,
			stopPart: 0.5
		};
		const backwardOptions = {
			...partOptions,
			direction: DIRECTIONS.BACKWARD,
			startPart: 0.5,
			stopPart: 1
		};

		let zarandeoPromise = Promise.all([
			this.elements.zarandeo1.startAnimation(forwardOptions),
			this.elements.zarandeo2.startAnimation(forwardOptions)
		]).then(() => Promise.all([
			this.elements.zarandeo1.startAnimation(backwardOptions),
			this.elements.zarandeo2.startAnimation(backwardOptions)
		]));
		if (beats >= 8) {
			zarandeoPromise = zarandeoPromise
				.then(() => Promise.all([
					this.elements.zarandeo1.startAnimation(forwardOptions),
					this.elements.zarandeo2.startAnimation(forwardOptions)
				])).then(() => Promise.all([
					this.elements.zarandeo1.startAnimation(backwardOptions),
					this.elements.zarandeo2.startAnimation(backwardOptions)
				]));
		}

		this.elements.zapateo1.drawPath(manPosition + 1);
		this.elements.zapateo2.drawPath(manPosition + 2);
		const zapateoPromise = Promise.all([
			this.elements.zapateo1.startAnimation({lengthS, beats}),
			this.elements.zapateo2.startAnimation({lengthS, beats})
		]);

		return Promise.all([zarandeoPromise, zapateoPromise]);
	}

	coronacion(lengthS, manPosition, beats) {
		return this.elements.coronacion.fullAnimation({lengthS, beats, manPosition, isLastElemet: true});
	}
}
