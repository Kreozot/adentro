function Zamba2Animation(id) {
	ZambaSimpleAnimation.superclass.constructor.apply(this, arguments);

	this.coronacionElement = new DanceAnimationElement(this,
		{left: 'm 40,160 230,0',
		right: 'm 560,160 -230,0'});

	this.vuelta = function (seconds, manPosition, times) {
		this.vueltaElement.setAngle(-45);
		this.vueltaElement.fullAnimation(seconds, times, manPosition);
	};

	this.arresto = function (seconds, manPosition, times) {
		var partSeconds = seconds / 2;
		var partTimes = times / 2;

		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.mediaVueltaToArrestoElement.drawPath(manPosition);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partTimes);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
	};

	this.mediaVueltaCoronacion = function (seconds, manPosition, times) {
		var firstPart = 4 / times;
		var secondPart = 3 / times;
		this.mediaVueltaElement.setAngle(-45);

		this.clearPaths();
		this.mediaVueltaElement.drawPath(manPosition);
		this.coronacionElement.drawPath((manPosition === 'left') ? 'right' : 'left');
		this.mediaVueltaElement.startAnimation(seconds * firstPart, times * firstPart);
		manPosition = (manPosition === 'left') ? 'right' : 'left';
		this.coronacionElement.startAnimation(seconds * secondPart, times * secondPart, this.DIRECTION_FORWARD, seconds * firstPart);
	};
};
extend(Zamba2Animation, ZambaAnimation);

module.exports = Zamba2Animation;
