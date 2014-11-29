function GatoAnimation(id) {
	GatoAnimation.superclass.constructor.apply(this, arguments);

	this.width = 600;
	this.height = 325;
	this.startPos = {
		left: {x: 40, y: 160, angle: -90},
		right: {x: 560, y: 160, angle: 90}		
	};

	this.giroElement = new DanceAnimationElement(this, 
		{left: "m 40,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 C 240,80 200,40 140,40 80,40 40,80 40,140 z",
		right: "M 560,140 C 560,80 520,40 460,40 400,40 360,80 360,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 z"});

	this.mediaVueltaElement = new DanceAnimationElement(this,
		{left: "m 40,160 c 0,50 120,120 260,120 140,0 260,-70 260,-120",
		right: "M 560,160 C 560,110 440,40 300,40 160,40 40,110 40,160"});

	this.coronacionElement = new DanceAnimationElement(this,
		{left: "m 40,160 c 0,40 120,60 160,60 40,0 80,-20 80,-60 0,-25 -15,-40 -40,-40 -25,0 -40,15 -40,40 0,25 15,40 40,40 25,0 40,-20 50,-40",
		right: "m 560,160 c 0,-40 -120,-60 -160,-60 -40,0 -80,20 -80,60 0,25 15,40 40,40 25,0 40,-15 40,-40 0,-25 -15,-40 -40,-40 -25,0 -40,20 -50,40"});

	this.zapateoElement = new ZapateoElement(this);

	this.zarandeoElement = new ZarandeoElement(this,
		{left: "M 40,160 140,260 240,160 140,60 z",
		right: "M 560,160 460,60 360,160 460,260 z"});

	this.vueltaElement = new VueltaElement(this,
		"m 45,150 c 0,45 105,105 255,105 150,0 255,-60 255,-105 C 555,105 450,45 300,45 150,45 45,105 45,150 z");

	this.vuelta = function(seconds, manPosition, times) {
		this.vueltaElement.fullAnimation(seconds, times, manPosition);
	};

	this.giro = function(seconds, manPosition, times) {
		this.giroElement.fullAnimation(seconds, times, manPosition);
	};

	this.contraGiro = function(seconds, manPosition, times) {
		this.giroElement.fullAnimation(seconds, times, manPosition, this.DIRECTION_BACKWARD, 0, 1, 0);
	};

	this.zapateoZarandeo = function(seconds, manPosition, times) {
		this.clearPaths();
		this.zarandeoElement.drawPath(getOppositePosition(manPosition));
		if (times >= 8) {
			var partSeconds = seconds / 4;
			var partTimes = times / 4;
		} else {
			var partSeconds = seconds / 2;
			var partTimes = times / 2;			
		}
		this.zarandeoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.zarandeoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		if (times >= 8) {
			this.zarandeoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.zarandeoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
		}

		this.zapateoElement.drawPath(manPosition);
		this.zapateoElement.startAnimation(seconds, times);
	};

	this.mediaVuelta = function(seconds, manPosition, times) {
		this.mediaVueltaElement.fullAnimation(seconds, times, manPosition);
	};

	this.coronacion = function(seconds, manPosition, times) {
		this.coronacionElement.fullAnimation(seconds, times, manPosition);
	};
};
extend(GatoAnimation, DanceAnimation);