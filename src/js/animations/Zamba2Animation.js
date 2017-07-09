import ZambaAnimation from './ZambaAnimation';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';

export default class Zamba2Animation extends ZambaAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			coronacion: new PairElement(this, {
				left: 'm 40,160 230,0',
				right: 'm 560,160 -230,0'
			})
		};
	}

	vuelta(seconds, manPosition, beats) {
		this.elements.vuelta.setAngle(-45);
		this.elements.vuelta.fullAnimation(seconds, beats, manPosition);
	}

	arresto(seconds, manPosition, beats) {
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.mediaVueltaToArresto.drawPath(manPosition);
		this.elements.mediaVueltaToArresto.startAnimation(partSeconds, partBeats);
		this.elements.mediaVueltaToArresto.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
	}

	mediaVueltaCoronacion(seconds, manPosition, beats) {
		const firstPart = 4 / beats;
		const secondPart = 3 / beats;
		this.elements.mediaVuelta.setAngle(-45);

		this.clearPaths();
		this.elements.mediaVuelta.drawPath(manPosition);
		this.elements.coronacion.drawPath(getOppositePosition(manPosition));
		this.elements.mediaVuelta.startAnimation(seconds * firstPart, beats * firstPart);
		manPosition = getOppositePosition(manPosition);
		this.elements.coronacion.startAnimation(seconds * secondPart, beats * secondPart, this.DIRECTION_FORWARD, seconds * firstPart);
	}
}
