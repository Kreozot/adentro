import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';

export default class ZambaAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,
			vueltaGato: this.elements.vuelta,
			arresto2: this.elements.arresto,

			mediaVueltaToArresto: new PairElement(this, {
				left: 'm 40,160 c 0,40 160,80 240,80 110,0 110,-130 20,-130',
				right: 'M 560,160 C 560,120 400,80 320,80 210,80 210,210 300,210'
			}),

			arresto: new PairElement(this, {
				left: 'm 300,210 c -30,0 -50,-20 -50,-50 0,-30 20,-50 50,-50',
				right: 'm 300,110 c 30,0 50,20 50,50 0,30 -20,50 -50,50'
			}),

			arrestoBack: new PairElement(this, {
				left: 'M 300,110 C 240,90 40,120 40,160',
				right: 'm 300,210 c 60,20 260,-10 260,-50'
			}),

			mediaVueltaCoronacion: new PairElement(this, {
				left: 'm 40,160 c 0,40 160,100 260,100 180,0 100,-200 20,-120',
				right: 'M 560,160 C 560,120 400,60 300,60 120,60 200,260 280,180'
			})
		};
	}

	vuelta(seconds, manPosition, beats) {
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.clearPaths();
		this.elements.mediaVuelta.setAngle(-45);
		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.mediaVuelta.drawPath(manPosition);
		this.elements.mediaVueltaToArresto.drawPath(getOppositePosition(manPosition));
		this.elements.mediaVuelta.startAnimation(partSeconds, partBeats);
		this.elements.mediaVueltaToArresto.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds);
	}

	zapateoZarandeo(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.zarandeo.drawPath(getOppositePosition(manPosition));
		var partSeconds = seconds * 2 / 7;
		this.elements.zarandeo.startAnimation(partSeconds, 2, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.elements.zarandeo.startAnimation(partSeconds, 2, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		this.elements.zarandeo.startAnimation(partSeconds, 2, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
		this.elements.zarandeo.startAnimation(partSeconds, 2, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);

		this.elements.zapateo.drawPath(manPosition);
		this.elements.zapateo.startAnimation(seconds, beats);
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.mediaVueltaToArresto.fullAnimation(seconds, beats, manPosition);
	}

	arresto(seconds, manPosition, beats) {
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.clearPaths();
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);
		this.elements.arresto.startAnimation(partSeconds, partBeats);
		this.elements.arrestoBack.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds);
	}

	arrestoDoble(seconds, manPosition, beats) {
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;

		this.clearPaths();
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);
		this.elements.arresto.startAnimation(partSeconds, partBeats);
		this.elements.arresto.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
		this.elements.arresto.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2);
		this.elements.arrestoBack.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 3);
	}

	mediaVueltaCoronacion(seconds, manPosition, beats) {
		this.elements.mediaVueltaCoronacion.fullAnimation(seconds, beats, manPosition);
	}
}
