import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';

export default class ZambaAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.mediaVueltaToArrestoElement = new PairElement(this,
			{left: 'm 40,160 c 0,40 160,80 240,80 110,0 110,-130 20,-130',
			right: 'M 560,160 C 560,120 400,80 320,80 210,80 210,210 300,210'});

		this.arrestoElement = new PairElement(this,
			{left: 'm 300,210 c -30,0 -50,-20 -50,-50 0,-30 20,-50 50,-50',
			right: 'm 300,110 c 30,0 50,20 50,50 0,30 -20,50 -50,50'});

		this.arrestoBackElement = new PairElement(this,
			{left: 'M 300,110 C 240,90 40,120 40,160',
			right: 'm 300,210 c 60,20 260,-10 260,-50'});

		this.mediaVueltaCoronacionElement = new PairElement(this,
			{left: 'm 40,160 c 0,40 160,100 260,100 180,0 100,-200 20,-120',
			right: 'M 560,160 C 560,120 400,60 300,60 120,60 200,260 280,180'});

		this.vueltaGato = this.vuelta;
		this.arresto2 = this.arresto;
	}

	vuelta(seconds, manPosition, beats) {
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.clearPaths();
		this.mediaVueltaElement.setAngle(-45);
		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.mediaVueltaElement.drawPath(manPosition);
		this.mediaVueltaToArrestoElement.drawPath(getOppositePosition(manPosition));
		this.mediaVueltaElement.startAnimation(partSeconds, partBeats);
		this.mediaVueltaToArrestoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds);
	}

	zapateoZarandeo(seconds, manPosition, beats) {
		this.clearPaths();
		this.zarandeoElement.drawPath(getOppositePosition(manPosition));
		var partSeconds = seconds * 2 / 7;
		this.zarandeoElement.startAnimation(partSeconds, 2, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.zarandeoElement.startAnimation(partSeconds, 2, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		this.zarandeoElement.startAnimation(partSeconds, 2, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
		this.zarandeoElement.startAnimation(partSeconds, 2, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);

		this.zapateoElement.drawPath(manPosition);
		this.zapateoElement.startAnimation(seconds, beats);
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.mediaVueltaToArrestoElement.setAngle(-45);
		this.mediaVueltaToArrestoElement.fullAnimation(seconds, beats, manPosition);
	}

	arresto(seconds, manPosition, beats) {
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;

		this.clearPaths();
		this.arrestoElement.setAngle(45);
		this.arrestoBackElement.setAngle(-45);
		this.arrestoElement.drawPath(manPosition);
		this.arrestoBackElement.drawPath(manPosition);
		this.arrestoElement.startAnimation(partSeconds, partBeats);
		this.arrestoBackElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds);
	}

	arrestoDoble(seconds, manPosition, beats) {
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;

		this.clearPaths();
		this.arrestoElement.setAngle(45);
		this.arrestoBackElement.setAngle(-45);
		this.arrestoElement.drawPath(manPosition);
		this.arrestoBackElement.drawPath(manPosition);
		this.arrestoElement.startAnimation(partSeconds, partBeats);
		this.arrestoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 1, 0);
		this.arrestoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2);
		this.arrestoBackElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 3);
	}

	mediaVueltaCoronacion(seconds, manPosition, beats) {
		this.mediaVueltaCoronacionElement.fullAnimation(seconds, beats, manPosition);
	}
}
