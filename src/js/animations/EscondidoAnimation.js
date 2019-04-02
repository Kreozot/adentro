import DanceAnimation from './commons/DanceAnimation';
import PairElement from './commons/elements/double/PairElement';
import RotatePairElement from './commons/elements/double/RotatePairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {zarandeoAnimation} from './GatoAnimation';
import {DIRECTIONS, LEGS} from './commons/const';
import {getOppositePosition} from './commons/utils';
import escondidoPaths from 'svgData/escondido.paths';

export default class EscondidoAnimation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.width = 440;
		this.height = 440;
		this.startPos = {
			left: {x: 50, y: 390, angle: 225},
			top: {x: 50, y: 50, angle: 315},
			right: {x: 390, y: 50, angle: 45},
			bottom: {x: 390, y: 390, angle: 135}
		};

		this.elements = {
			giro: new PairElement(this, {
				left: escondidoPaths.giro_left,
				right: escondidoPaths.giro_right
			}),

			vuelta: new VueltaElement(this, escondidoPaths.vuelta),

			zapateo: new ZapateoElement(this),

			zarandeo: new ZarandeoElement(this, {
				left: escondidoPaths.zarandeo_left,
				top: escondidoPaths.zarandeo_top,
				right: escondidoPaths.zarandeo_right,
				bottom: escondidoPaths.zarandeo_bottom
			}),

			mediaVuelta: new PairElement(this, {
				left: escondidoPaths.media_vuelta_left,
				right: escondidoPaths.media_vuelta_right
			}),

			coronacion: new PairElement(this, {
				left: escondidoPaths.coronacion_left,
				right: escondidoPaths.coronacion_right
			}),

			esquina: new RotatePairElement(this, {
				left: escondidoPaths.esquina_left,
				top: escondidoPaths.esquina_top,
				right: escondidoPaths.esquina_right,
				bottom: escondidoPaths.esquina_bottom
			}, 270),

			balanceo1: new PairElement(this, {
				left: escondidoPaths.balanceo_left,
				top: escondidoPaths.balanceo_top,
				right: escondidoPaths.balanceo_right,
				bottom: escondidoPaths.balanceo_bottom
			}),

			balanceo2: new PairElement(this, {
				left: escondidoPaths.balanceo2_left,
				top: escondidoPaths.balanceo2_top,
				right: escondidoPaths.balanceo2_right,
				bottom: escondidoPaths.balanceo2_bottom
			})
		};
		this.zarandeoAnimation = zarandeoAnimation.bind(this);
		this.elements.balanceo1.easing = mina.easeout;
		this.elements.balanceo2.easing = mina.easeout;
	}

	async esquina(lengthS, manPosition, beats) {
		this.clearPaths();
		const startAngleMan = this.startPos[manPosition].angle;
		const startAngleWoman = this.startPos[getOppositePosition(manPosition)].angle;
		this.elements.esquina.drawPath(manPosition);
		this.elements.balanceo1.drawPath(manPosition, true);
		this.elements.balanceo2.drawPath(manPosition, true);

		if ((manPosition == 'left') || (manPosition == 'right')) {
			this.initRotateIcon(50, 220, 0, false);
			this.initRotateIcon(390, 220, 0, false);
		} else {
			this.initRotateIcon(220, 50, 90, false);
			this.initRotateIcon(220, 390, 90, false);
		}

		this.elements.balanceo1.setAngles(startAngleMan, startAngleWoman);
		this.elements.balanceo2.setAngles(startAngleMan, startAngleWoman);

		await this.elements.esquina.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2,
			startAngleMan,
			startAngleWoman
		});
		await this.elements.balanceo1.startAnimation({
			lengthS: lengthS / 4,
			beats: beats / 4,
			direction: DIRECTIONS.STRAIGHT_FORWARD
		});
		await this.elements.balanceo2.startAnimation({
			lengthS: lengthS / 4,
			beats: beats / 4,
			direction: DIRECTIONS.STRAIGHT_FORWARD,
			firstLeg: LEGS.RIGHT,
		});
	}

	async vueltaGiro(lengthS, manPosition, beats) {
		await this.elements.vuelta.fullAnimation({
			lengthS: lengthS * 6 / beats,
			beats: 6,
			manPosition
		});
		await this.elements.giro.fullAnimation({
			lengthS: lengthS * 2 / beats,
			beats: 2,
			manPosition
		});
	}

	zapateo(lengthS, manPosition, beats) {
		this.setAtStart(manPosition);

		return this.elements.zapateo.fullAnimation({
			lengthS,
			beats,
			position: manPosition
		});
	}

	zarandeo(lengthS, manPosition, beats) {
		this.setAtStart(manPosition);
		this.clearPaths();

		return this.zarandeoAnimation(lengthS, manPosition, beats);
	}

	mediaVuelta(lengthS, manPosition, beats) {
		return this.elements.mediaVuelta.fullAnimation({
			lengthS,
			beats,
			manPosition
		});
	}

	coronacion(lengthS, manPosition, beats) {
		return this.elements.coronacion.fullAnimation({
			lengthS,
			beats,
			manPosition,
			isLastElement: true
		});
	}
}
