function VueltaGradientElement(animation, pathStr) {
	VueltaGradientElement.superclass.constructor.apply(this, arguments);

	this.animationFunction = function (lengthMs, times, direction, startPart, stopPart) {
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
	};
}
extend(VueltaGradientElement, VueltaElement);

function Chacarera4Animation(id) {
	Chacarera4Animation.superclass.constructor.apply(this, arguments);

	this.width = 440;
	this.height = 440;

	this.startPos = {
		left1: {x: 50, y: 130, angle: -90},
		right1: {x: 390, y: 130, angle: 90},
		left2: {x: 50, y: 310, angle: -90},
		right2: {x: 390, y: 310, angle: 90}
	};

	this.avanceElement = new FourDanceAnimationElement(this,
		{left: 'm 50,130 60,60 60,-60 -60,-60 z',
		right: 'm 390,130 -60,-60 -60,60 60,60 z'},
		{left: 'm 50,310 60,60 60,-60 -60,-60 z',
		right: 'm 390,310 -60,-60 -60,60 60,60 z'});

	this.giroElement = new FourDanceAnimationElement(this,
		{left: 'm 50,130 c 0,35 25,60 60,60 35,0 60,-25 60,-60 0,-35 -25,-60 -60,-60 -35,0 -60,25 -60,60 z',
		right: 'm 390,130 c 0,-35 -25,-60 -60,-60 -35,0 -60,25 -60,60 0,35 25,60 60,60 35,0 60,-25 60,-60 z'},
		{left: 'm 50,310 c 0,35 25,60 60,60 35,0 60,-25 60,-60 0,-35 -25,-60 -60,-60 -35,0 -60,25 -60,60 z',
		right: 'm 390,310 c 0,-35 -25,-60 -60,-60 -35,0 -60,25 -60,60 0,35 25,60 60,60 35,0 60,-25 60,-60 z'});

	this.mediaVueltaElement = new FourDanceAnimationElement(this,
		{left: 'm 50,130 c -30,60 -30,120 0,180 66,132 274,132 340,0',
		right: 'M 390,130 C 314,0 116,-2 50,130 20,190 20,250 50,310'},
		{left: 'm 50,310 c 76,130 274,132 340,0 30,-60 30,-120 0,-180',
		right: 'M 390,310 C 420,250 420,190 390,130 324,-2 116,-2 50,130'});

	this.vueltaGradientElement = new VueltaGradientElement(this,
		'm 50,310 c 76,130 274,132 340,0 30,-60 30,-120 0,-180 C 324,-2 116,-2 50,130 20,190 20,260 50,310 z');

	this.zapateoElement1 = new ZapateoElement(this, this.man);
	this.zapateoElement2 = new ZapateoElement(this, this.man2);

	this.zarandeoElement1 = new ZarandeoElement(this,
		{left: 'm 50,130 60,60 60,-60 -60,-60 z',
		right: 'm 390,130 -60,-60 -60,60 60,60 z'},
		this.woman);
	this.zarandeoElement2 = new ZarandeoElement(this,
		{left: 'm 50,310 60,60 60,-60 -60,-60 z',
		right: 'm 390,310 -60,-60 -60,60 60,60 z'},
		this.woman2);

	this.coronacionElement = new FourDanceAnimationElement(this,
		{left: 'm 50,130 c 0,25 70,40 100,40 30,0 55,-20 55,-40 0,-15 -10,-25 -25,-25 -15,0 -25,10 -25,25 0,15 10,25 25,25 15,0 25,-5 30,-20',
		right: 'm 390,130 c 0,-25 -70,-40 -100,-40 -30,0 -55,20 -55,40 0,15 10,25 25,25 15,0 25,-10 25,-25 0,-15 -10,-25 -25,-25 -15,0 -25,5 -30,20'},
		{left: 'm 50,310 c 0,25 70,40 100,40 30,0 55,-20 55,-40 0,-15 -10,-25 -25,-25 -15,0 -25,10 -25,25 0,15 10,25 25,25 15,0 25,-5 30,-20',
		right: 'm 390,310 c 0,-25 -70,-40 -100,-40 -30,0 -55,20 -55,40 0,15 10,25 25,25 15,0 25,-10 25,-25 0,-15 -10,-25 -25,-25 -15,0 -25,5 -30,20'});

	this.avance = function (seconds, manPosition, times) {
		this.clearPaths();
		this.avanceElement.drawPath(manPosition);
		var partSeconds = seconds / 2;
		var partTimes = times / 2;
		this.avanceElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.avanceElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
	};

	this.giro = function (seconds, manPosition, times) {
		this.giroElement.fullAnimation(seconds, times, manPosition);
	};

	this.contraGiro = function (seconds, manPosition, times) {
		this.giroElement.fullAnimation(seconds, times, manPosition, this.DIRECTION_BACKWARD, 0, 1, 0);
	};

	this.vuelta = function (seconds, manPosition, times) {
		this.clearPaths();
		this.vueltaGradientElement.drawPath(manPosition);
		this.vueltaGradientElement.startAnimation(seconds, times);

		var partSeconds = seconds / 2;
		var partTimes = times / 2;

		this.mediaVueltaElement.drawPath(manPosition, true);
		this.mediaVueltaElement.startAnimation(partSeconds, partTimes);
		this.mediaVueltaElement.drawPath(getOppositePosition(manPosition), true);
		this.mediaVueltaElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds);
	};

	this.mediaVuelta = function (seconds, manPosition, times) {
		this.clearPaths();
		this.vueltaGradientElement.drawPath(manPosition);
		this.vueltaGradientElement.startAnimation(seconds, times, this.DIRECTION_FORWARD, 0, 0, 0.5);

		this.mediaVueltaElement.drawPath(manPosition, true);
		this.mediaVueltaElement.startAnimation(seconds, times);
	};

	this.zapateoZarandeo = function (seconds, manPosition, times) {
		this.clearPaths();
		this.zarandeoElement1.drawPath(getOppositePosition(manPosition));
		this.zarandeoElement2.drawPath(getOppositePosition(manPosition));
		if (times >= 8) {
			var partSeconds = seconds / 4;
			var partTimes = times / 4;
		} else {
			var partSeconds = seconds / 2;
			var partTimes = times / 2;
		}
		this.zarandeoElement1.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.zarandeoElement1.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		this.zarandeoElement2.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.zarandeoElement2.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		if (times >= 8) {
			this.zarandeoElement1.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.zarandeoElement1.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
			this.zarandeoElement2.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.zarandeoElement2.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
		}

		this.zapateoElement1.drawPath(manPosition + 1);
		this.zapateoElement2.drawPath(manPosition + 2);
		this.zapateoElement1.startAnimation(seconds, times);
		this.zapateoElement2.startAnimation(seconds, times);
	};

	this.coronacion = function (seconds, manPosition, times) {
		this.coronacionElement.fullAnimation(seconds, times, manPosition);
	};
};
extend(Chacarera4Animation, Dance4Animation);

module.exports = Chacarera4Animation;
