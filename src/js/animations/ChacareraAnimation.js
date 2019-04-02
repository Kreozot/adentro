import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
import {DIRECTIONS} from './commons/const';
import gatoPaths from 'svgData/gato.paths';

export default class ChacareraAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			avance: new PairElement(this, {
				left: gatoPaths.zarandeo_left,
				right: gatoPaths.zarandeo_right
			})
		};
	}

	async avance(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.avance.drawPath(manPosition);
		const partOptions = {
			lengthS: lengthS / 2,
			beats: beats / 2
		};

		await this.elements.avance.startAnimation({
			...partOptions,
			startPart: 0,
			stopPart: 0.499
		});
		await this.elements.avance.startAnimation({
			...partOptions,
			direction: DIRECTIONS.BACKWARD,
			startPart: 0.501,
			stopPart: 1
		});
	}
}
