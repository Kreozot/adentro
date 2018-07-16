import Promise from 'bluebird';
import DanceAnimation from './commons/DanceAnimation';
import PairElement from './commons/elements/double/PairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {DIRECTIONS, FIGURE_HANDS, ROTATE} from './commons/const';
import {getOppositePosition} from './commons/utils';
import {gato, vuelta} from './svg/svg';

export function zapateoAnimation(lengthS, manPosition, beats, conPanuelo) {
	this.elements.zapateo.drawPath(manPosition);

	return this.elements.zapateo.startAnimation({
		lengthS, beats,
		figureHands: conPanuelo ? FIGURE_HANDS.PANUELO : FIGURE_HANDS.DOWN,
	});
}

export function zarandeoAnimation(lengthS, manPosition, beats, conPanuelo) {
	this.elements.zarandeo.drawPath(getOppositePosition(manPosition));
	const parts = beats >= 8 ? 4 : 2;
	const partOptions = {
		lengthS: lengthS / parts,
		beats: beats / parts,
		figureHands: conPanuelo ? FIGURE_HANDS.PANUELO : FIGURE_HANDS.DOWN,
	};
	const forwardOptions = {
		...partOptions,
		direction: DIRECTIONS.FORWARD,
		startPart: 0,
		stopPart: 0.5
	};
	const backwardOptions = {
		...partOptions,
		direction: DIRECTIONS.BACKWARD,
		startPart: 0.51, // Исправление погрешности svg-кривой
		stopPart: 1
	};

	let zarandeoPromise = this.elements.zarandeo.startAnimation(forwardOptions)
		.then(() => this.elements.zarandeo.startAnimation(backwardOptions));
	if (beats >= 8) {
		zarandeoPromise = zarandeoPromise
			.then(() => this.elements.zarandeo.startAnimation(forwardOptions))
			.then(() => this.elements.zarandeo.startAnimation(backwardOptions));
	}

	return zarandeoPromise;
}

export default class GatoAnimation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.width = 600;
		this.height = 325;
		this.startPos = {
			left: {x: 40, y: 160, angle: -90},
			right: {x: 560, y: 160, angle: 90}
		};

		this.elements = {
			giro: new PairElement(this, {
				left: gato.giro_left,
				right: gato.giro_right
			}),

			mediaVuelta: new PairElement(this, {
				left: gato.media_vuelta_left,
				right: gato.media_vuelta_right
			}),

			coronacion: new PairElement(this, {
				left: gato.coronacion_left,
				right: gato.coronacion_right
			}),

			zapateo: new ZapateoElement(this),

			zarandeo: new ZarandeoElement(this, {
				left: gato.zarandeo_left,
				right: gato.zarandeo_right
			}),

			vuelta: new VueltaElement(this, vuelta.vuelta)
		};
		this.zapateoAnimation = zapateoAnimation.bind(this);
		this.zarandeoAnimation = zarandeoAnimation.bind(this);
	}

	vuelta(lengthS, manPosition, beats) {
		return this.elements.vuelta.fullAnimation({lengthS, beats, manPosition});
	}

	giro(lengthS, manPosition, beats) {
		return this.elements.giro.fullAnimation({
			lengthS, beats, manPosition,
			rotateDirection: ROTATE.COUNTERCLOCKWISE
		});
	}

	contraGiro(lengthS, manPosition, beats) {
		return this.elements.giro.fullAnimation({
			lengthS, beats, manPosition,
			direction: DIRECTIONS.BACKWARD,
			startPart: 1,
			stopPart: 0,
			rotateDirection: ROTATE.CLOCKWISE
		});
	}

	zapateoZarandeo(lengthS, manPosition, beats) {
		this.clearPaths();

		return Promise.all([
			this.zapateoAnimation(lengthS, manPosition, beats),
			this.zarandeoAnimation(lengthS, manPosition, beats)
		]);
	}

	mediaVuelta(lengthS, manPosition, beats) {
		return this.elements.mediaVuelta.fullAnimation({
			lengthS, beats, manPosition,
			rotateDirection: ROTATE.COUNTERCLOCKWISE
		});
	}

	coronacion(lengthS, manPosition, beats) {
		return this.elements.coronacion.fullAnimation({
			lengthS, beats, manPosition,
			isLastElement: true,
			rotateDirection: ROTATE.COUNTERCLOCKWISE
		});
	}
}
