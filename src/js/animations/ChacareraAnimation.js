import GatoAnimation from './GatoAnimation';
import PairElement from './commons/elements/double/PairElement';
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

	avance(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.avance.drawPath(manPosition);
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;
		return this.elements.avance.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5)
			.then(() => this.elements.avance.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, 0, 0.5, 1));
	}
}
