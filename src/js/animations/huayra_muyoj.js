function HuayraMuyojAnimation(id) {
	HuayraMuyojAnimation.superclass.constructor.apply(this, arguments);

	this.width = 440;
	this.height = 440;
	this.startPos = {
		start_left: {x: 50, y: 220, angle: 270},
		start_right: {x: 390, y: 220, angle: 90},
		left: {x: 50, y: 390, angle: 225},
		top: {x: 50, y: 50, angle: 315},
		right: {x: 390, y: 50, angle: 45},
		bottom: {x: 390, y: 390, angle: 135}
	};

	this.esquinaStartElement = new RotateDanceAnimationElement(this, 
		{left: "M 50,220 50,50",
		right: "m 390,220 0,170"}, 315);

	this.esquinaEndElement = new RotateDanceAnimationElement(this, 
		{left: "M 50,390 50,220",
		right: "M 390,50 390,220"}, 315);

	this.contraGiroEndElement = new RotateDanceAnimationElement(this, 
		{left: "m 50,220 1,1",
		right: "m 390,220 1,1"}, -315);

	this.contraGiroElement = new RotateDanceAnimationElement(this, 
		{left: "M 50,50 200,200",
		top: "M 390,50 240,200",
		right: "M 390,390 240,240",
		bottom: "M 50,390 200,240"}, -540);

	this.regresoElement = new DanceAnimationElement(this, 
		{left: "M 200,240 50,390",
		top: "M 200,200 50,50",
		right: "M 240,200 390,50",
		bottom: "M 240,240 390,390"});

	this.giroElement = new RotateDanceAnimationElement(this, 
		{left: "m 50,390 1,1",
		top: "m 50,50 1,1",
		right: "m 390,50 1,1",
		bottom: "m 390,390 1,1"}, 540);

	this.zapateoElement = new ZapateoElement(this);

	this.zarandeoElement = new ZarandeoElement(this,
		{left: "m 50,390 130,0 0,-130 -130,0 z",
		top: "m 50,50 0,130 130,0 0,-130 z",
		right: "m 390,50 -130,0 0,130 130,0 z",
		bottom: "m 390,390 0,-130 -130,0 0,130 z"});

	this.esquinaElement = new RotateDanceAnimationElement(this,
		{left: "M 50,390 50,50",
		top: "m 50,50 340,0",
		right: "m 390,50 0,340",
		bottom: "M 390,390 50,390"}, 270);

	this.avanceElement = new DanceAnimationElement(this, 
		{left: "m 50,220 70,0",
		right: "m 390,220 -70,0"});

	this.coronacionElement = new RotateDanceAnimationElement(this, 
		{left: "m 50,220 140,0",
		right: "m 390,220 -140,0"}, 360);

	this.setAtStart = function(manPosition) {
		this.startPosition(this.startPos.start_left, this.startPos.start_right, manPosition);
	};

	this.esquinaStart = function(seconds, manPosition, times) {
		this.clearPaths();
		var partSeconds = seconds / 2;
		var partTimes = times / 2;
		var manAngle = this.startPos["start_" + manPosition].angle;
		var womanAngle = this.startPos[getOppositePosition("start_" + manPosition)].angle;
		this.esquinaStartElement.drawPath(manPosition);
		this.contraGiroElement.drawPath(manPosition);

		this.initRotateIcon(50, 135, 0, false);
		this.initRotateIcon(390, 305, 0, false);
		this.initRotateIcon(125, 125, -45, true);
		this.initRotateIcon(315, 315, -45, true);

		this.esquinaStartElement.startAnimation(partSeconds, partTimes, manAngle, womanAngle);
		this.contraGiroElement.startAnimation(partSeconds, partTimes, manAngle - 315, womanAngle - 315, this.DIRECTION_FORWARD, partSeconds);
	};

	this.esquina = function(seconds, manPosition, times) {
		this.clearPaths();
		var partSeconds = seconds / 2;
		var partTimes = times / 2;
		var manAngle = this.startPos[manPosition].angle;
		var womanAngle = this.startPos[getOppositePosition(manPosition)].angle;
		this.esquinaElement.drawPath(manPosition);
		this.contraGiroElement.drawPath(manPosition);

		if ((manPosition == "left") || (manPosition == "right")) {
			this.initRotateIcon(50, 220, 0, false);
			this.initRotateIcon(390, 220, 0, false);
			this.initRotateIcon(125, 125, -45, true);
			this.initRotateIcon(315, 315, -45, true);
		} else {
			this.initRotateIcon(220, 50, 90, false);
			this.initRotateIcon(220, 390, 90, false);
			this.initRotateIcon(315, 125, 45, true);
			this.initRotateIcon(125, 315, 45, true);
		}

		this.esquinaElement.startAnimation(partSeconds, partTimes, manAngle, womanAngle);
		this.contraGiroElement.startAnimation(partSeconds, partTimes, manAngle - 270, womanAngle - 270, this.DIRECTION_FORWARD, partSeconds);
	};	

	this.esquinaEnd = function(seconds, manPosition, times) {
		this.clearPaths();
		var partSeconds = seconds / 2;
		var partTimes = times / 2;
		var manAngle = this.startPos[manPosition].angle;
		var womanAngle = this.startPos[getOppositePosition(manPosition)].angle;
		this.esquinaEndElement.drawPath(manPosition);
		this.contraGiroEndElement.drawPath(manPosition, true);

		var arrows1 = this.initRotateIcon(50, 305, 0, false);
		var arrows2 = this.initRotateIcon(390, 135, 0, false);
		var arrows1_2 = this.initRotateIcon(50, 220, 0, true).removeClass("rotationArrows").addClass("invisible");
		var arrows2_2 = this.initRotateIcon(390, 220, 0, true).removeClass("rotationArrows").addClass("invisible");
		this.timeouts[this.timeouts.length] = new Timer(function() {
			arrows1.removeClass("rotationArrows").addClass("invisible");
			arrows2.removeClass("rotationArrows").addClass("invisible");
			arrows1_2.addClass("rotationArrows").removeClass("invisible");
			arrows2_2.addClass("rotationArrows").removeClass("invisible");
		}, partSeconds * 1000);

		this.esquinaEndElement.startAnimation(partSeconds, partTimes, manAngle, womanAngle);
		this.contraGiroEndElement.startAnimation(partSeconds, partTimes, manAngle - 270, womanAngle - 270, this.DIRECTION_FORWARD, partSeconds);
	};

	this.avance = function(seconds, manPosition, times) {
		this.clearPaths();
		var partSeconds = seconds / 2;
		var partTimes = times / 2;
		var manAngle = this.startPos["start_" + manPosition].angle;
		var womanAngle = this.startPos[getOppositePosition("start_" + manPosition)].angle;
		this.avanceElement.drawPath(manPosition);

		this.avanceElement.startAnimation(partSeconds, partTimes);
		this.avanceElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds, 1, 0);
	};

	this.regreso = function(seconds, manPosition, times) {
		this.regresoElement.fullAnimation(seconds, times, manPosition);
	};

	this.giro = function(seconds, manPosition, times) {
		this.giroElement.fullAnimation(seconds, times, 
			this.startPos[manPosition].angle - 180, 
			this.startPos[getOppositePosition(manPosition)].angle - 180, 
			manPosition);
		this.initRotateIcon(this.startPos[manPosition].x, 
			this.startPos[manPosition].y, -45, false);
		this.initRotateIcon(this.startPos[getOppositePosition(manPosition)].x, 
			this.startPos[getOppositePosition(manPosition)].y, -45, false);
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

	this.coronacion = function(seconds, manPosition, times) {
		this.coronacionElement.fullAnimation(seconds, times, 
			this.startPos["start_" + manPosition].angle, 
			this.startPos[getOppositePosition("start_" + manPosition)].angle, 
			manPosition);
		this.initRotateIcon(120, 220, 90, false);
		this.initRotateIcon(320, 220, 90, false);
	};
};
extend(HuayraMuyojAnimation, DanceAnimation);