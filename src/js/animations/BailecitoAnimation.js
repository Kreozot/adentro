import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';

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

		this.avanceRetrocesoElement1 = new BailecitoAvanceRetrocesoElement(this,
			{left: 'm 40,160 c 0,0 0,40 40,40 140,0 400,0 440,0 40,0 40,-40 40,-40',
			right: 'm 560,160 c 0,0 0,-40 -40,-40 -140,0 -400,0 -440,0 -40,0 -40,40 -40,40'});
		this.avanceRetrocesoElement2 = new BailecitoAvanceRetrocesoElement(this,
			{left: 'm 560,160 c 0,0 0,-40 -40,-40 -40,0 -220,0 -220,0 l -260,0',
			right: 'm 40,160 c 0,0 0,40 40,40 40,0 220,0 220,0 l 260,0'});
	}

	avance1(seconds, manPosition, beats) {
		this.avanceRetrocesoElement1.fullAnimation(seconds, beats, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 0, 1);
	}

	retroceso2(seconds, manPosition, beats) {
		this.avanceRetrocesoElement1.fullAnimation(seconds, beats, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 1, 0);
	}

	retroceso1(seconds, manPosition, beats) {
		this.avanceRetrocesoElement2.fullAnimation(seconds, beats, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 0, 1);
	}

	avance2(seconds, manPosition, beats) {
		this.avanceRetrocesoElement2.fullAnimation(seconds, beats, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 1, 0);
	}
}
