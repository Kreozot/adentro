import {directions} from './commons/DanceAnimation';
import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {bailecito} from './svg/svg';

class BailecitoAvanceRetrocesoElement extends PairElement {
	constructor(animation, pathStrings) {
		super(animation, pathStrings);

		this.manDanceAnimationElement.animationFunction = function ({lengthMs, beats, startPart = 0, stopPart = 1}) {
			const angle = this.position === 'left' ? -90 : 90;
			return this.animation.animateFigurePath(this.figure, angle, this.path,
				this.pathLength * startPart, this.pathLength * stopPart,
				lengthMs, beats, directions.STRAIGHT_FORWARD);
		};
		this.womanDanceAnimationElement.animationFunction = function ({lengthMs, beats, startPart = 0, stopPart = 1}) {
			const angle = this.position === 'left' ? -90 : 90;
			return this.animation.animateFigurePath(this.figure, angle, this.path,
				this.pathLength * startPart, this.pathLength * stopPart,
				lengthMs, beats, directions.STRAIGHT_FORWARD);
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
			direction: directions.STRAIGHT_FORWARD,
			figureTop: 'panuelo'
		});
	}

	avance2(lengthS, manPosition, beats) {
		return this.elements.avanceRetroceso2.fullAnimation({
			lengthS,
			beats,
			manPosition,
			direction: directions.STRAIGHT_FORWARD,
			startPart: 1,
			stopPart: 0
		});
	}

	retroceso1(lengthS, manPosition, beats) {
		return this.elements.avanceRetroceso2.fullAnimation({
			lengthS,
			beats,
			manPosition,
			direction: directions.STRAIGHT_FORWARD
		});
	}

	retroceso2(lengthS, manPosition, beats) {
		return this.elements.avanceRetroceso1.fullAnimation({
			lengthS,
			beats,
			manPosition,
			direction: directions.STRAIGHT_FORWARD,
			startPart: 1,
			stopPart: 0
		});
	}
}
