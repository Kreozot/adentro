import ZambaAnimation from './ZambaAnimation';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';

export default class ZambaSimpleAnimation extends ZambaAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			arrestoSimple: new PairElement(this, {
				left: 'm 40,160 c 0,40 80,80 160,80 80,0 160,-40 160,-80 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 z',
				right: 'm 560,160 c 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 0,40 80,80 160,80 80,0 160,-40 160,-80 z'
			}),

			coronacion: new PairElement(this, {
				left: 'm 40,160 230,0',
				right: 'm 560,160 -230,0'
			})
		};

		this.vueltaGato = this.vuelta;
		this.arresto2 = this.arresto;
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.elements.mediaVuelta.setAngle(-45);
		return this.elements.mediaVuelta.fullAnimation(seconds, beats, manPosition);
	}

	vuelta(seconds, manPosition, beats) {
		this.elements.vuelta.setAngle(-45);
		return this.elements.vuelta.fullAnimation(seconds, beats, manPosition);
	}

	arresto(seconds, manPosition, beats) {
		this.elements.arrestoSimple.setAngle(-45);
		return this.elements.arrestoSimple.fullAnimation(seconds, beats, manPosition);
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

		return this.elements.mediaVueltaToArresto.startAnimation(partSeconds, partBeats)
			.then(() => this.elements.arresto.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, 1, 0))
			.then(() => this.elements.arresto.startAnimation(partSeconds, partBeats))
			.then(() => this.elements.arrestoBack.startAnimation(partSeconds, partBeats));
	}

	mediaVueltaCoronacion(seconds, manPosition, beats) {
		const firstPart = 4 / beats;
		const secondPart = 3 / beats;
		this.elements.mediaVuelta.setAngle(-45);

		this.clearPaths();
		this.elements.mediaVuelta.drawPath(manPosition);
		this.elements.coronacion.drawPath(getOppositePosition(manPosition));

		return this.elements.mediaVuelta.startAnimation(seconds * firstPart, beats * firstPart)
			.then(() => this.elements.coronacion.startAnimation(seconds * secondPart, beats * secondPart));
	}
}
