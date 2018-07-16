import ZambaAnimation from './ZambaAnimation';
import {DIRECTIONS, FIGURE_HANDS, STEP_STYLE} from './commons/const';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';
import svg from 'js/animations/svg';

export default class ZambaSimpleAnimation extends ZambaAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			arrestoSimple: new PairElement(this, {
				left: svg.zamba.arresto_simple_left,
				right: svg.zamba.arresto_simple_right
			}),

			coronacion: new PairElement(this, {
				left: svg.zamba.coronacion_left,
				right: svg.zamba.coronacion_right
			})
		};

		// this.vueltaGato = this.vuelta;
		this.arresto2 = this.arresto;
	}

	mediaVuelta(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.mediaVuelta.drawPath(manPosition);

		return this.elements.mediaVuelta.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.SIMPLE,
			startPart: 0,
			stopPart: 0.5
		})
			.then(() => this.elements.mediaVuelta.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA,
				startPart: 0.5,
				stopPart: 1
			}));
	}

	vuelta(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.vuelta.drawPath(manPosition);

		return this.elements.vuelta.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.SIMPLE,
			startPart: 0,
			stopPart: 0.5
		})
			.then(() => this.elements.vuelta.setAngle(-45))
			.then(() => this.elements.vuelta.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA,
				startPart: 0.5,
				stopPart: 1
			}));
	}

	arresto(lengthS, manPosition, beats) {
		this.elements.arrestoSimple.setAngle(-45);
		return this.elements.arrestoSimple.fullAnimation({
			lengthS, beats, manPosition,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.ZAMBA,
		});
	}

	arrestoDoble(lengthS, manPosition, beats) {
		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);

		this.clearPaths();
		this.elements.mediaVueltaToArresto.drawPath(manPosition);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);

		return this.elements.mediaVueltaToArresto.startAnimation({
			lengthS: lengthS / 4,
			beats: beats / 4,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.ZAMBA,
		})
			.then(() => this.elements.arresto.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				direction: DIRECTIONS.BACKWARD,
				startPart: 1,
				stopPart: 0,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA,
			}))
			.then(() => this.elements.arresto.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA,
			}))
			.then(() => this.elements.arrestoBack.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.ZAMBA,
			}));
	}

	mediaVueltaCoronacion(lengthS, manPosition, beats) {
		this.elements.mediaVuelta.setAngle(-45);

		this.clearPaths();
		this.elements.mediaVuelta.drawPath(manPosition);
		this.elements.coronacion.drawPath(getOppositePosition(manPosition));

		return this.elements.mediaVuelta.startAnimation({
			lengthS: lengthS * 4 / beats,
			beats: 4,
			figureHands: FIGURE_HANDS.PANUELO,
			stepStyle: STEP_STYLE.ZAMBA,
		})
			.then(() => this.elements.coronacion.startAnimation({
				lengthS: lengthS * 3 / beats,
				beats: 3,
				isLastElement: true,
				figureHands: FIGURE_HANDS.PANUELO,
				stepStyle: STEP_STYLE.SIMPLE,
			}));
	}
}
