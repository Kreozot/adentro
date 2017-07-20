import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {bailecito} from './svg/svg';

class BailecitoAvanceRetrocesoElement extends PairElement {
	constructor(animation, pathStrings) {
		super(animation, pathStrings);

		this.manDanceAnimationElement.animationFunction = function (lengthMs, beats, direction, startPart, stopPart) {
			var angle = this.position === 'left' ? -90 : 90;
			this.animation.animateFigurePath(this.figure, angle, this.path,
				this.pathLength * startPart, this.pathLength * stopPart,
				lengthMs, beats, this.animation.DIRECTION_STRAIGHT_FORWARD);
		};
		this.womanDanceAnimationElement.animationFunction = function (lengthMs, beats, direction, startPart, stopPart) {
			var angle = this.position === 'left' ? -90 : 90;
			this.animation.animateFigurePath(this.figure, angle, this.path,
				this.pathLength * startPart, this.pathLength * stopPart,
				lengthMs, beats, this.animation.DIRECTION_STRAIGHT_FORWARD);
		};
	}
}

export default class BailecitoAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			avanceRetroceso1: new BailecitoAvanceRetrocesoElement(this, {
				left: bailecito.avance_retroceso_1_left,
				right: bailecito.avance_retroceso_1_right
			}),

			avanceRetroceso2: new BailecitoAvanceRetrocesoElement(this, {
				left: bailecito.avance_retroceso_2_left,
				right: bailecito.avance_retroceso_2_right
			})
		};
	}

	avance1(seconds, manPosition, beats) {
		return this.elements.avanceRetroceso1.fullAnimation(seconds, beats, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 0, 1);
	}

	retroceso2(seconds, manPosition, beats) {
		return this.elements.avanceRetroceso1.fullAnimation(seconds, beats, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 1, 0);
	}

	retroceso1(seconds, manPosition, beats) {
		return this.elements.avanceRetroceso2.fullAnimation(seconds, beats, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 0, 1);
	}

	avance2(seconds, manPosition, beats) {
		return this.elements.avanceRetroceso2.fullAnimation(seconds, beats, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 1, 0);
	}
}
