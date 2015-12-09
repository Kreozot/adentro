function ChacareraAnimation(id) {
	ChacareraAnimation.superclass.constructor.apply(this, arguments);

	this.avanceElement = new DanceAnimationElement(this,
		{left: 'M 40,160 140,260 240,160 140,60 z',
		right: 'M 560,160 460,60 360,160 460,260 z'});

	this.avance = function (seconds, manPosition, times) {
		this.clearPaths();
		this.avanceElement.drawPath(manPosition);
		var partSeconds = seconds / 2;
		var partTimes = times / 2;
		this.avanceElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.avanceElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
	};
};
extend(ChacareraAnimation, GatoAnimation);

module.exports = ChacareraAnimation;
