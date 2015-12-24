import GatoAnimation from './GatoAnimation.js';

class ChacareraAnimation extends GatoAnimation  {
	constructor(id) {
		super(id);
		this.avanceElement = new DanceAnimationElement(this,
			{left: 'M 40,160 140,260 240,160 140,60 z',
			right: 'M 560,160 460,60 360,160 460,260 z'});
	}

	avance(seconds, manPosition, times) {
		this.clearPaths();
		this.avanceElement.drawPath(manPosition);
		const partSeconds = seconds / 2;
		const partTimes = times / 2;
		this.avanceElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.avanceElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
	}
};

module.exports = ChacareraAnimation;
