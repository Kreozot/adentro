class BailecitoAvanceRetrocesoElement extends DanceAnimationElement {
	constructor() {
		super();

		this.manDanceAnimationElement.animationFunction = function (lengthMs, times, direction, startPart, stopPart) {
			this.animation.animateFigurePath(this.figure, -90, this.path,
				this.pathLength * startPart, this.pathLength * stopPart,
				lengthMs, times, this.animation.DIRECTION_STRAIGHT_FORWARD);
		};
		this.womanDanceAnimationElement.animationFunction = function (lengthMs, times, direction, startPart, stopPart) {
			this.animation.animateFigurePath(this.figure, 90, this.path,
				this.pathLength * startPart, this.pathLength * stopPart,
				lengthMs, times, this.animation.DIRECTION_STRAIGHT_FORWARD);
		};
	}
}

export default class BailecitoAnimation extends GatoAnimation {
	constructor() {
		super(id);

		this.avanceRetrocesoElement1 = new BailecitoAvanceRetrocesoElement(this,
			{left: 'm 40,160 c 0,0 0,40 40,40 140,0 400,0 440,0 40,0 40,-40 40,-40',
			right: 'm 560,160 c 0,0 0,-40 -40,-40 -140,0 -400,0 -440,0 -40,0 -40,40 -40,40'});
		this.avanceRetrocesoElement2 = new BailecitoAvanceRetrocesoElement(this,
			{left: 'm 560,160 c 0,0 0,-40 -40,-40 -40,0 -220,0 -220,0 l -260,0',
			right: 'm 40,160 c 0,0 0,40 40,40 40,0 220,0 220,0 l 260,0'});
	}

	avance1(seconds, manPosition, times) {
		this.avanceRetrocesoElement1.fullAnimation(seconds, times, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 0, 1);
	}

	retroceso2(seconds, manPosition, times) {
		this.avanceRetrocesoElement1.fullAnimation(seconds, times, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 1, 0);
	}

	retroceso1(seconds, manPosition, times) {
		this.avanceRetrocesoElement2.fullAnimation(seconds, times, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 0, 1);
	}

	avance2(seconds, manPosition, times) {
		this.avanceRetrocesoElement2.fullAnimation(seconds, times, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 1, 0);
	}
}
