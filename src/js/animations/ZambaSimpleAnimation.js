import ZambaAnimation from './ZambaAnimation.js';
import {DanceAnimationElement} from './commons/elements.js';

export default class ZambaSimpleAnimation extends ZambaAnimation {
	constructor(id) {
		super(id);

		this.arrestoSimpleElement = new DanceAnimationElement(this,
			{left: 'm 40,160 c 0,40 80,80 160,80 80,0 160,-40 160,-80 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 z',
			right: 'm 560,160 c 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 0,40 80,80 160,80 80,0 160,-40 160,-80 z'});

		this.coronacionElement = new DanceAnimationElement(this,
			{left: 'm 40,160 230,0',
			right: 'm 560,160 -230,0'});

		this.arresto2 = this.arresto;
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.mediaVueltaElement.setAngle(-45);
		this.mediaVueltaElement.fullAnimation(seconds, beats, manPosition);
	}

	vuelta(seconds, manPosition, beats) {
		this.vueltaElement.setAngle(-45);
		this.vueltaElement.fullAnimation(seconds, beats, manPosition);
	}

	arresto(seconds, manPosition, beats) {
		this.arrestoSimpleElement.setAngle(-45);
		this.arrestoSimpleElement.fullAnimation(seconds, beats, manPosition);
	}

	arrestoDoble(seconds, manPosition, beats) {
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;
		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.arrestoElement.setAngle(45);
		this.arrestoBackElement.setAngle(-45);

		this.clearPaths();
		this.mediaVueltaToArrestoElement.drawPath(manPosition);
		this.arrestoElement.drawPath(manPosition);
		this.arrestoBackElement.drawPath(manPosition);

		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partBeats);
		this.arrestoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
		this.arrestoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2);
		this.arrestoBackElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 3);
	}

	mediaVueltaCoronacion(seconds, manPosition, beats) {
		const firstPart = 4 / beats;
		const secondPart = 3 / beats;
		this.mediaVueltaElement.setAngle(-45);

		this.clearPaths();
		this.mediaVueltaElement.drawPath(manPosition);
		this.coronacionElement.drawPath((manPosition === 'left') ? 'right' : 'left');
		this.mediaVueltaElement.startAnimation(seconds * firstPart, beats * firstPart);
		manPosition = (manPosition === 'left') ? 'right' : 'left';
		this.coronacionElement.startAnimation(seconds * secondPart, beats * secondPart, this.DIRECTION_FORWARD, seconds * firstPart);
	}
}
