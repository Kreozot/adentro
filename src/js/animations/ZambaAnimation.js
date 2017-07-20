import Promise from 'bluebird';
import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';

export default class ZambaAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

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

		this.vueltaGato = this.vuelta;
		this.arresto2 = this.arresto;
	}

	vuelta(seconds, manPosition, beats) {
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.clearPaths();
		this.elements.mediaVuelta.setAngle(-45);
		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.mediaVuelta.drawPath(manPosition);
		this.elements.mediaVueltaToArresto.drawPath(getOppositePosition(manPosition));

		return this.elements.mediaVuelta.startAnimation(partSeconds, partBeats)
			.then(() => this.elements.mediaVueltaToArresto.startAnimation(partSeconds, partBeats));
	}

	zapateoZarandeo(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.zarandeo.drawPath(getOppositePosition(manPosition));
		const partSeconds = seconds * 2 / 7;

		const zarandeoPromise = this.elements.zarandeo.startAnimation(partSeconds, 2, this.DIRECTION_FORWARD, 0, 0, 0.5)
			.then(() => this.elements.zarandeo.startAnimation(partSeconds, 2, this.DIRECTION_BACKWARD, 0, 0.5, 1))
			.then(() => this.elements.zarandeo.startAnimation(partSeconds, 2, this.DIRECTION_FORWARD, 0, 0, 0.5))
			.then(() => this.elements.zarandeo.startAnimation(partSeconds, 2, this.DIRECTION_BACKWARD, 0, 0.5, 1));

		this.elements.zapateo.drawPath(manPosition);

		const zapateoPromise = this.elements.zapateo.startAnimation(seconds, beats);

		return Promise.all([zarandeoPromise, zapateoPromise]);
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.elements.mediaVueltaToArresto.setAngle(-45);
		return this.elements.mediaVueltaToArresto.fullAnimation(seconds, beats, manPosition);
	}

	arresto(seconds, manPosition, beats) {
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.clearPaths();
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);

		return this.elements.arresto.startAnimation(partSeconds, partBeats)
			.then(() => this.elements.arrestoBack.startAnimation(partSeconds, partBeats));
	}

	arrestoDoble(seconds, manPosition, beats) {
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;

		this.clearPaths();
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);

		return this.elements.arresto.startAnimation(partSeconds, partBeats)
			.then(() => this.elements.arresto.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, 0, 1, 0))
			.then(() => this.elements.arresto.startAnimation(partSeconds, partBeats))
			.then(() => this.elements.arrestoBack.startAnimation(partSeconds, partBeats));
	}

	mediaVueltaCoronacion(seconds, manPosition, beats) {
		return this.elements.mediaVueltaCoronacion.fullAnimation(seconds, beats, manPosition);
	}
}
