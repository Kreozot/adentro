import Promise from 'bluebird';
import GatoAnimation, {zapateoAnimation} from './GatoAnimation';
import {directions} from './commons/DanceAnimation';
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
		this.zapateoAnimation = zapateoAnimation.bind(this);

		this.vueltaGato = this.vuelta;
		this.arresto2 = this.arresto;
	}

	vuelta(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.mediaVuelta.setAngle(-45);
		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.mediaVuelta.drawPath(manPosition);
		this.elements.mediaVueltaToArresto.drawPath(getOppositePosition(manPosition));

		return this.elements.mediaVuelta.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2
		})
			.then(() => this.elements.mediaVueltaToArresto.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2
			}));
	}

	zapateoZarandeo(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.zarandeo.drawPath(getOppositePosition(manPosition));

		const zarandeoPromise = this.elements.zarandeo.startAnimation({
			lengthS: lengthS * 2 / beats,
			beats: 2,
			direction: directions.FORWARD,
			startPart: 0,
			stopPart: 0.5
		})
			.then(() => this.elements.zarandeo.startAnimation({
				lengthS: lengthS * 2 / beats,
				beats: 2,
				direction: directions.BACKWARD,
				startPart: 0.5,
				stopPart: 1
			}))
			.then(() => this.elements.zarandeo.startAnimation({
				lengthS: lengthS * 2 / beats,
				beats: 2,
				direction: directions.FORWARD,
				startPart: 0,
				stopPart: 0.5
			}))
			.then(() => this.elements.zarandeo.startAnimation({
				lengthS: lengthS * 2 / beats,
				beats: 1,
				direction: directions.BACKWARD,
				startPart: 0.5,
				stopPart: 0.75
			}));

		return Promise.all([
			zarandeoPromise,
			this.zapateoAnimation(lengthS, manPosition, beats)
		]);
	}

	mediaVuelta(lengthS, manPosition, beats) {
		this.elements.mediaVueltaToArresto.setAngle(-45);
		return this.elements.mediaVueltaToArresto.fullAnimation({lengthS, beats, manPosition});
	}

	arresto(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);

		return this.elements.arresto.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2
		})
			.then(() => this.elements.arrestoBack.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2
			}));
	}

	arrestoDoble(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);

		return this.elements.arresto.startAnimation({
			lengthS: lengthS / 4,
			beats: beats / 4
		})
			.then(() => this.elements.arresto.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				direction: directions.BACKWARD,
				startPart: 1,
				stopPart: 0
			}))
			.then(() => this.elements.arresto.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4
			}))
			.then(() => this.elements.arrestoBack.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4
			}));
	}

	mediaVueltaCoronacion(lengthS, manPosition, beats) {
		return this.elements.mediaVueltaCoronacion.fullAnimation({lengthS, beats, manPosition});
	}
}
