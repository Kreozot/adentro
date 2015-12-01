function ZambaAnimation(id) {
	ZambaAnimation.superclass.constructor.apply(this, arguments);

	this.mediaVueltaToArrestoElement = new DanceAnimationElement(this,
		{left: "m 40,160 c 0,40 160,80 240,80 110,0 110,-130 20,-130",
		right: "M 560,160 C 560,120 400,80 320,80 210,80 210,210 300,210"});

	this.arrestoElement = new DanceAnimationElement(this,
		{left: "m 300,210 c -30,0 -50,-20 -50,-50 0,-30 20,-50 50,-50",
		right: "m 300,110 c 30,0 50,20 50,50 0,30 -20,50 -50,50"});

	this.arrestoBackElement = new DanceAnimationElement(this,
		{left: "M 300,110 C 240,90 40,120 40,160",
		right: "m 300,210 c 60,20 260,-10 260,-50"});

	this.mediaVueltaCoronacionElement = new DanceAnimationElement(this,
		{left: "m 40,160 c 0,40 160,100 260,100 180,0 100,-200 20,-120",
		right: "M 560,160 C 560,120 400,60 300,60 120,60 200,260 280,180"});

	this.vueltaGato = this.vuelta;

	this.vuelta = function(seconds, manPosition, times) {
		var partSeconds = seconds / 2;
		var partTimes = times / 2;

		this.clearPaths();
		this.mediaVueltaElement.setAngle(-45);
		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.mediaVueltaElement.drawPath(manPosition);
		this.mediaVueltaToArrestoElement.drawPath((manPosition === "left") ? "right" : "left");
		this.mediaVueltaElement.startAnimation(partSeconds, partTimes);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds);
	};

	this.zapateoZarandeo = function(seconds, manPosition, times) {
		this.clearPaths();
		this.zarandeoElement.drawPath(getOppositePosition(manPosition));
		var partSeconds = seconds * 2 / 7;
		this.zarandeoElement.startAnimation(partSeconds, 2, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.zarandeoElement.startAnimation(partSeconds, 2, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		this.zarandeoElement.startAnimation(partSeconds, 2, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
		this.zarandeoElement.startAnimation(partSeconds, 2, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);

		this.zapateoElement.drawPath(manPosition);
		this.zapateoElement.startAnimation(seconds, times);
	};

	this.mediaVuelta = function(seconds, manPosition, times) {
		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.mediaVueltaToArrestoElement.fullAnimation(seconds, times, manPosition);
	};

	this.arresto = function(seconds, manPosition, times) {
		var partSeconds = seconds / 2;
		var partTimes = times / 2;

		this.clearPaths();
		this.arrestoElement.setAngle(45);
		this.arrestoBackElement.setAngle(-45);
		this.arrestoElement.drawPath(manPosition);
		this.arrestoBackElement.drawPath(manPosition);
		this.arrestoElement.startAnimation(partSeconds, partTimes);
		this.arrestoBackElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds);
	};

	this.arresto2 = this.arresto;

	this.arrestoDoble = function(seconds, manPosition, times) {
		var partSeconds = seconds / 4;
		var partTimes = times / 4;

		this.clearPaths();
		this.arrestoElement.setAngle(45);
		this.arrestoBackElement.setAngle(-45);
		this.arrestoElement.drawPath(manPosition);
		this.arrestoBackElement.drawPath(manPosition);
		this.arrestoElement.startAnimation(partSeconds, partTimes);
		this.arrestoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
		this.arrestoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 2);
		this.arrestoBackElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 3);
	};

	this.mediaVueltaCoronacion = function(seconds, manPosition, times) {
		this.mediaVueltaCoronacionElement.fullAnimation(seconds, times, manPosition);
	};
};
extend(ZambaAnimation, GatoAnimation);

function Zamba2Animation(id) {
	ZambaSimpleAnimation.superclass.constructor.apply(this, arguments);
	
	this.coronacionElement = new DanceAnimationElement(this,
		{left: "m 40,160 230,0",
		right: "m 560,160 -230,0"});

	this.vuelta = function(seconds, manPosition, times) {
		this.vueltaElement.setAngle(-45);
		this.vueltaElement.fullAnimation(seconds, times, manPosition);
	};

	this.arresto = function(seconds, manPosition, times) {
		var partSeconds = seconds / 2;
		var partTimes = times / 2;

		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.mediaVueltaToArrestoElement.drawPath(manPosition);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partTimes);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
	};

	this.mediaVueltaCoronacion = function(seconds, manPosition, times) {
		var firstPart = 4 / times;
		var secondPart = 3 / times;
		this.mediaVueltaElement.setAngle(-45);

		this.clearPaths();
		this.mediaVueltaElement.drawPath(manPosition);
		this.coronacionElement.drawPath((manPosition === "left") ? "right" : "left");
		this.mediaVueltaElement.startAnimation(seconds * firstPart, times * firstPart);
		manPosition = (manPosition === "left") ? "right" : "left";
		this.coronacionElement.startAnimation(seconds * secondPart, times * secondPart, this.DIRECTION_FORWARD, seconds * firstPart);
	};
};
extend(ZambaSimpleAnimation, ZambaAnimation);

function ZambaSimpleAnimation(id) {
	ZambaSimpleAnimation.superclass.constructor.apply(this, arguments);

	this.arrestoSimpleElement = new DanceAnimationElement(this,
		{left: "m 40,160 c 0,40 80,80 160,80 80,0 160,-40 160,-80 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 z",
		right: "m 560,160 c 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 0,40 80,80 160,80 80,0 160,-40 160,-80 z"});

	this.coronacionElement = new DanceAnimationElement(this,
		{left: "m 40,160 230,0",
		right: "m 560,160 -230,0"});


	this.mediaVuelta = function(seconds, manPosition, times) {
		this.mediaVueltaElement.setAngle(-45);
		this.mediaVueltaElement.fullAnimation(seconds, times, manPosition);
	};

	this.vuelta = function(seconds, manPosition, times) {
		this.vueltaElement.setAngle(-45);
		this.vueltaElement.fullAnimation(seconds, times, manPosition);
	};

	this.arresto = function(seconds, manPosition, times) {
		this.arrestoSimpleElement.setAngle(-45);
		this.arrestoSimpleElement.fullAnimation(seconds, times, manPosition);
	};

	this.arresto2 = this.arresto;

	this.arrestoDoble = function(seconds, manPosition, times) {
		var partSeconds = seconds / 4;
		var partTimes = times / 4;
		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.arrestoElement.setAngle(45);
		this.arrestoBackElement.setAngle(-45);

		this.clearPaths();
		this.mediaVueltaToArrestoElement.drawPath(manPosition);
		this.arrestoElement.drawPath(manPosition);
		this.arrestoBackElement.drawPath(manPosition);

		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partTimes);
		this.arrestoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
		this.arrestoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 2);
		this.arrestoBackElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 3);
	};

	this.mediaVueltaCoronacion = function(seconds, manPosition, times) {
		var firstPart = 4 / times;
		var secondPart = 3 / times;
		this.mediaVueltaElement.setAngle(-45);

		this.clearPaths();
		this.mediaVueltaElement.drawPath(manPosition);
		this.coronacionElement.drawPath((manPosition === "left") ? "right" : "left");
		this.mediaVueltaElement.startAnimation(seconds * firstPart, times * firstPart);
		manPosition = (manPosition === "left") ? "right" : "left";
		this.coronacionElement.startAnimation(seconds * secondPart, times * secondPart, this.DIRECTION_FORWARD, seconds * firstPart);
	};
};
extend(ZambaSimpleAnimation, ZambaAnimation);