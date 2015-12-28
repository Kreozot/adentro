import ZambaAnimation from './ZambaAnimation.js';
import {DanceAnimationElement} from './commons/elements.js';

export default class Zamba2Animation extends ZambaAnimation {
	constructor(id) {
		super(id);

		this.coronacionElement = new DanceAnimationElement(this,
			{left: 'm 40,160 230,0',
			right: 'm 560,160 -230,0'});
	}

	vuelta(seconds, manPosition, times) {
		this.vueltaElement.setAngle(-45);
		this.vueltaElement.fullAnimation(seconds, times, manPosition);
	}

	arresto(seconds, manPosition, times) {
		var partSeconds = seconds / 2;
		var partTimes = times / 2;

		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.mediaVueltaToArrestoElement.drawPath(manPosition);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partTimes);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partTimes, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
	}

	mediaVueltaCoronacion(seconds, manPosition, times) {
		var firstPart = 4 / times;
		var secondPart = 3 / times;
		this.mediaVueltaElement.setAngle(-45);

		this.clearPaths();
		this.mediaVueltaElement.drawPath(manPosition);
		this.coronacionElement.drawPath((manPosition === 'left') ? 'right' : 'left');
		this.mediaVueltaElement.startAnimation(seconds * firstPart, times * firstPart);
		manPosition = (manPosition === 'left') ? 'right' : 'left';
		this.coronacionElement.startAnimation(seconds * secondPart, times * secondPart, this.DIRECTION_FORWARD, seconds * firstPart);
	}
}
