import ZambaAnimation from './ZambaAnimation';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';

export default class Zamba2Animation extends ZambaAnimation {
	constructor(id) {
		super(id);

		this.coronacionElement = new PairElement(this,
			{left: 'm 40,160 230,0',
			right: 'm 560,160 -230,0'});
	}

	vuelta(seconds, manPosition, beats) {
		this.vueltaElement.setAngle(-45);
		this.vueltaElement.fullAnimation(seconds, beats, manPosition);
	}

	arresto(seconds, manPosition, beats) {
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.mediaVueltaToArrestoElement.drawPath(manPosition);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partBeats);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
	}

	mediaVueltaCoronacion(seconds, manPosition, beats) {
		const firstPart = 4 / beats;
		const secondPart = 3 / beats;
		this.mediaVueltaElement.setAngle(-45);

		this.clearPaths();
		this.mediaVueltaElement.drawPath(manPosition);
		this.coronacionElement.drawPath(getOppositePosition(manPosition));
		this.mediaVueltaElement.startAnimation(seconds * firstPart, beats * firstPart);
		manPosition = getOppositePosition(manPosition);
		this.coronacionElement.startAnimation(seconds * secondPart, beats * secondPart, this.DIRECTION_FORWARD, seconds * firstPart);
	}
}
