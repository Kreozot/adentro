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

module.exports = ZambaSimpleAnimation;
