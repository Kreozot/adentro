import RemedioAnimation from './RemedioAnimation';
import PairElement from './commons/elements/double/PairElement';
import {FIGURE_HANDS, DIRECTIONS} from './commons/const';
import escondidoPaths from 'svgData/escondido.paths';
import remedioPaths from 'svgData/remedio.paths';

//TODO: mediaVueltaCoronacion
export default class ArunguitaAnimation extends RemedioAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			avance: new PairElement(this, {
				left: escondidoPaths.zarandeo_left,
				top: escondidoPaths.zarandeo_top,
				right: escondidoPaths.zarandeo_right,
				bottom: escondidoPaths.zarandeo_bottom
			}),

			mediaVueltaCoronacion: new PairElement(this, {
				left: remedioPaths.media_vuelta_coronacion_left,
				right: remedioPaths.media_vuelta_coronacion_right
			}),
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
			stopPart: 0.499,
			figureHands: FIGURE_HANDS.PANUELO
		});
		await this.elements.avance.startAnimation({
			...partOptions,
			direction: DIRECTIONS.BACKWARD,
			startPart: 0.501,
			stopPart: 1,
			figureHands: FIGURE_HANDS.PANUELO
		});
	}

	async mediaVueltaCoronacion(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.mediaVueltaCoronacion.drawPath(manPosition);

		await this.elements.mediaVueltaCoronacion.startAnimation({
			lengthS: lengthS / 7 * 4,
			beats: beats / 7 * 4,
			startPart: 0,
			stopPart: 0.6
		});
		await this.elements.mediaVueltaCoronacion.startAnimation({
			lengthS: lengthS / 7 * 3,
			beats: beats / 7 * 3,
			startPart: 0.6,
			stopPart: 1
		});
	}
}
