import {DIRECTIONS, FIGURE_HANDS, ROTATE} from './commons/const';
import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {bailecito} from './svg/svg';

class BailecitoAvanceRetrocesoElement extends PairElement {
	constructor(animation, pathStrings) {
		super(animation, pathStrings);

		this.manDanceAnimationElement.animationFunction = function ({lengthMs, beats, startPart = 0, stopPart = 1, figureHands}) {
			return this.animation.animateFigurePath({
				figure: this.figure,
				startAngle: this.position === 'left' ? -90 : 90,
				path: this.path,
				startLen: this.pathLength * startPart,
				stopLen: this.pathLength * stopPart,
				timeLength: lengthMs,
				beats,
				direction: DIRECTIONS.STRAIGHT_FORWARD,
				figureHands
			});
		};
		this.womanDanceAnimationElement.animationFunction = function ({lengthMs, beats, startPart = 0, stopPart = 1, figureHands}) {
			return this.animation.animateFigurePath({
				figure: this.figure,
				startAngle: this.position === 'left' ? -90 : 90,
				path: this.path,
				startLen: this.pathLength * startPart,
				stopLen: this.pathLength * stopPart,
				timeLength: lengthMs,
				beats,
				direction: DIRECTIONS.STRAIGHT_FORWARD,
				figureHands
			});
		};
	}
}

export default class BailecitoAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			avanceRetroceso1: new BailecitoAvanceRetrocesoElement(this, {
				left: bailecito.avance_retroceso_1_left,
				right: bailecito.avance_retroceso_1_right
			}),

			avanceRetroceso2: new BailecitoAvanceRetrocesoElement(this, {
				left: bailecito.avance_retroceso_2_left,
				right: bailecito.avance_retroceso_2_right
			})
		};
	}

	avance1(lengthS, manPosition, beats) {
		return this.elements.avanceRetroceso1.fullAnimation({
			lengthS,
			beats,
			manPosition,
			direction: DIRECTIONS.STRAIGHT_FORWARD,
			figureHands: FIGURE_HANDS.PANUELO
		});
	}

	avance2(lengthS, manPosition, beats) {
		return this.elements.avanceRetroceso2.fullAnimation({
			lengthS,
			beats,
			manPosition,
			direction: DIRECTIONS.STRAIGHT_FORWARD,
			figureHands: FIGURE_HANDS.PANUELO,
			startPart: 1,
			stopPart: 0
		});
	}

	retroceso1(lengthS, manPosition, beats) {
		return this.elements.avanceRetroceso2.fullAnimation({
			lengthS,
			beats,
			manPosition,
			direction: DIRECTIONS.STRAIGHT_FORWARD,
			figureHands: FIGURE_HANDS.PANUELO
		});
	}

	retroceso2(lengthS, manPosition, beats) {
		return this.elements.avanceRetroceso1.fullAnimation({
			lengthS,
			beats,
			manPosition,
			direction: DIRECTIONS.STRAIGHT_FORWARD,
			figureHands: FIGURE_HANDS.PANUELO,
			startPart: 1,
			stopPart: 0
		});
	}

	giro(lengthS, manPosition, beats) {
		return this.elements.giro.fullAnimation({
			lengthS,
			beats,
			manPosition,
			figureHands: FIGURE_HANDS.PANUELO
		});
	}

	contraGiro(lengthS, manPosition, beats) {
		return this.elements.giro.fullAnimation({
			lengthS,
			beats,
			manPosition,
			direction: DIRECTIONS.BACKWARD,
			startPart: 1,
			stopPart: 0,
			figureHands: FIGURE_HANDS.PANUELO,
			rotateDirection: ROTATE.CLOCKWISE
		});
	}
}
