import Promise from 'bluebird';
import GatoAnimation, {zapateoAnimation} from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {DIRECTIONS, FIGURE_HANDS, STEP_STYLE, LEGS} from './commons/const';
import {getOppositePosition} from './commons/utils';
import {zamba} from './svg/svg';

export default class ZambaAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			mediaVueltaToArresto: new PairElement(this, {
				left: zamba.media_vuelta_to_arresto_left,
				right: zamba.media_vuelta_to_arresto_right,
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
				left: zamba.media_vuelta_coronacion_left,
				right: zamba.media_vuelta_coronacion_right
			})
		};
		this.zapateoAnimation = zapateoAnimation.bind(this);

		// this.vueltaGato = this.vuelta;
		this.arresto2 = this.arresto;
	}

	vueltaGato(lengthS, manPosition, beats) {
		return this.elements.vuelta.fullAnimation({lengthS, beats, manPosition});
	}

	vuelta(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.mediaVuelta.drawPath(manPosition);
		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.mediaVueltaToArresto.drawPath(getOppositePosition(manPosition));

		return this.elements.mediaVuelta.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.SIMPLE
		})
			.then(() => this.elements.mediaVueltaToArresto.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA
			}));
	}

	zapateoZarandeo(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.zarandeo.drawPath(getOppositePosition(manPosition));

		const zarandeoPromise = this.elements.zarandeo.startAnimation({
			lengthS: lengthS * 2 / beats,
			beats: 2,
			direction: DIRECTIONS.FORWARD,
			startPart: 0,
			stopPart: 0.5
		})
			.then(() => this.elements.zarandeo.startAnimation({
				lengthS: lengthS * 2 / beats,
				beats: 2,
				direction: DIRECTIONS.BACKWARD,
				startPart: 0.5,
				stopPart: 1
			}))
			.then(() => this.elements.zarandeo.startAnimation({
				lengthS: lengthS * 2 / beats,
				beats: 2,
				direction: DIRECTIONS.FORWARD,
				startPart: 0,
				stopPart: 0.5
			}))
			.then(() => this.elements.zarandeo.startAnimation({
				lengthS: lengthS * 2 / beats,
				beats: 1,
				direction: DIRECTIONS.BACKWARD,
				startPart: 0.5,
				stopPart: 0.75
			}));

		return Promise.all([
			zarandeoPromise,
			this.zapateoAnimation(lengthS, manPosition, beats)
		]);
	}

	mediaVuelta(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.mediaVueltaToArresto.drawPath(manPosition);

		return this.elements.mediaVueltaToArresto.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.SIMPLE,
			startPart: 0,
			stopPart: 0.5
		})
			.then(() => this.elements.mediaVueltaToArresto.setAngle(-45))
			.then(() => this.elements.mediaVueltaToArresto.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA,
				startPart: 0.5,
				stopPart: 1
			}));
	}

	arresto(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);

		return this.elements.arresto.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.ZAMBA,
			firstLeg: LEGS.RIGHT
		})
			.then(() => this.elements.arrestoBack.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA
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
			beats: beats / 4,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.ZAMBA,
			firstLeg: LEGS.RIGHT
		})
			.then(() => this.elements.arresto.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				direction: DIRECTIONS.BACKWARD,
				startPart: 1,
				stopPart: 0,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA
			}))
			.then(() => this.elements.arresto.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA,
				firstLeg: LEGS.RIGHT
			}))
			.then(() => this.elements.arrestoBack.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA
			}));
	}

	mediaVueltaCoronacion(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.mediaVueltaCoronacion.drawPath(manPosition);

		return this.elements.mediaVueltaCoronacion.startAnimation({
			lengthS: lengthS / 7 * 4,
			beats: beats / 7 * 4,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.ZAMBA,
			startPart: 0,
			stopPart: 0.6
		})
			.then(() => this.elements.mediaVueltaCoronacion.startAnimation({
				lengthS: lengthS / 7 * 3,
				beats: beats / 7 * 3,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.SIMPLE,
				startPart: 0.6,
				stopPart: 1
			}));
	}
}
