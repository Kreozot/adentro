import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {DIRECTIONS} from './commons/const';
import {gato} from './svg/svg';

export default class ChacareraAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			avance: new PairElement(this, {
				left: gato.zarandeo_left,
				right: gato.zarandeo_right
			})
		};
	}

	avance(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.avance.drawPath(manPosition);
		const partOptions = {
			lengthS: lengthS / 2,
			beats: beats / 2
		};

		return this.elements.avance.startAnimation({
			...partOptions,
			startPart: 0,
			stopPart: 0.5
		})
			.then(() => this.elements.avance.startAnimation({
				...partOptions,
				direction: DIRECTIONS.BACKWARD,
				startPart: 0.5,
				stopPart: 1
			}));
	}
}
