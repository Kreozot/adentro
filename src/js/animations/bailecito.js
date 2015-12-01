function BailecitoAnimation(id) {
	BailecitoAnimation.superclass.constructor.apply(this, arguments);

	function BailecitoAvanceRetrocesoElement() {
		BailecitoAvanceRetrocesoElement.superclass.constructor.apply(this, arguments);

		this.manDanceAnimationElement.animationFunction = function(lengthMs, times, direction, startPart, stopPart) {
			this.animation.animateFigurePath(this.figure, -90, this.path, 
				this.pathLength * startPart, this.pathLength * stopPart, 
				lengthMs, times, this.animation.DIRECTION_STRAIGHT_FORWARD);
		}
		this.womanDanceAnimationElement.animationFunction = function(lengthMs, times, direction, startPart, stopPart) {
			this.animation.animateFigurePath(this.figure, 90, this.path, 
				this.pathLength * startPart, this.pathLength * stopPart, 
				lengthMs, times, this.animation.DIRECTION_STRAIGHT_FORWARD);
		}
	}
	extend(BailecitoAvanceRetrocesoElement, DanceAnimationElement);

	this.avanceRetrocesoElement1 = new BailecitoAvanceRetrocesoElement(this,
		{left: "m 40,160 c 0,0 0,40 40,40 140,0 400,0 440,0 40,0 40,-40 40,-40",
		right: "m 560,160 c 0,0 0,-40 -40,-40 -140,0 -400,0 -440,0 -40,0 -40,40 -40,40"});
	this.avanceRetrocesoElement2 = new BailecitoAvanceRetrocesoElement(this,
		{left: "m 560,160 c 0,0 0,-40 -40,-40 -40,0 -220,0 -220,0 l -260,0",
		right: "m 40,160 c 0,0 0,40 40,40 40,0 220,0 220,0 l 260,0"});

	this.avance1 = function(seconds, manPosition, times) {
		this.avanceRetrocesoElement1.fullAnimation(seconds, times, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 0, 1);
	};

	this.retroceso2 = function(seconds, manPosition, times) {
		this.avanceRetrocesoElement1.fullAnimation(seconds, times, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 1, 0);
	};

	this.retroceso1 = function(seconds, manPosition, times) {
		this.avanceRetrocesoElement2.fullAnimation(seconds, times, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 0, 1);
	};

	this.avance2 = function(seconds, manPosition, times) {
		this.avanceRetrocesoElement2.fullAnimation(seconds, times, manPosition, this.DIRECTION_STRAIGHT_FORWARD, 0, 1, 0);
	};
};
extend(BailecitoAnimation, GatoAnimation);