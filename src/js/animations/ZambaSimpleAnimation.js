import ZambaAnimation from './ZambaAnimation';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';

export default class ZambaSimpleAnimation extends ZambaAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			arresto2: this.elements.arresto,

			arrestoSimple: new PairElement(this, {
				left: 'm 40,160 c 0,40 80,80 160,80 80,0 160,-40 160,-80 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 z',
				right: 'm 560,160 c 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 0,40 80,80 160,80 80,0 160,-40 160,-80 z'
			}),

			coronacion: new PairElement(this, {
				left: 'm 40,160 230,0',
				right: 'm 560,160 -230,0'
			})
		};
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.elements.mediaVuelta.setAngle(-45);
		this.elements.mediaVuelta.fullAnimation(seconds, beats, manPosition);
	}

	vuelta(seconds, manPosition, beats) {
		this.elements.vuelta.setAngle(-45);
		this.elements.vuelta.fullAnimation(seconds, beats, manPosition);
	}

	arresto(seconds, manPosition, beats) {
		this.elements.arrestoSimple.setAngle(-45);
		this.elements.arrestoSimple.fullAnimation(seconds, beats, manPosition);
	}

	arrestoDoble(seconds, manPosition, beats) {
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;
		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);

		this.clearPaths();
		this.elements.mediaVueltaToArresto.drawPath(manPosition);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);

		this.elements.mediaVueltaToArresto.startAnimation(partSeconds, partBeats);
		this.elements.arresto.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
		this.elements.arresto.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2);
		this.elements.arrestoBack.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 3);
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
