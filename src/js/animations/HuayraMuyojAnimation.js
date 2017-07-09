import DanceAnimation from './commons/DanceAnimation';
import PairElement from './commons/elements/double/PairElement';
import RotatePairElement from './commons/elements/double/RotatePairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import {getOppositePosition, Timer} from './commons/utils';

export default class HuayraMuyojAnimation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.width = 440;
		this.height = 440;
		this.startPos = {
			start_left: {x: 50, y: 220, angle: 270},
			start_right: {x: 390, y: 220, angle: 90},
			left: {x: 50, y: 390, angle: 225},
			top: {x: 50, y: 50, angle: 315},
			right: {x: 390, y: 50, angle: 45},
			bottom: {x: 390, y: 390, angle: 135}
		};

		this.elements = {
			esquinaStart: new RotatePairElement(this, {
				left: 'M 50,220 50,50',
				right: 'm 390,220 0,170'
			}, 315),

			esquinaEnd: new RotatePairElement(this, {
				left: 'M 50,390 50,220',
				right: 'M 390,50 390,220'
			}, 315),

			contraGiroEnd: new RotatePairElement(this, {
				left: 'm 50,220 1,1',
				right: 'm 390,220 1,1'
			}, -315),

			contraGiro: new RotatePairElement(this, {
				left: 'M 50,50 200,200',
				top: 'M 390,50 240,200',
				right: 'M 390,390 240,240',
				bottom: 'M 50,390 200,240'
			}, -540),

			regreso: new PairElement(this, {
				left: 'M 200,240 50,390',
				top: 'M 200,200 50,50',
				right: 'M 240,200 390,50',
				bottom: 'M 240,240 390,390'
			}),

			giro: new RotatePairElement(this, {
				left: 'm 50,390 1,1',
				top: 'm 50,50 1,1',
				right: 'm 390,50 1,1',
				bottom: 'm 390,390 1,1'
			}, 540),

			zapateo: new ZapateoElement(this),

			zarandeo: new ZarandeoElement(this, {
				left: 'm 50,390 130,0 0,-130 -130,0 z',
				top: 'm 50,50 0,130 130,0 0,-130 z',
				right: 'm 390,50 -130,0 0,130 130,0 z',
				bottom: 'm 390,390 0,-130 -130,0 0,130 z'
			}),

			esquina: new RotatePairElement(this, {
				left: 'M 50,390 50,50',
				top: 'm 50,50 340,0',
				right: 'm 390,50 0,340',
				bottom: 'M 390,390 50,390'
			}, 270),

			avance: new PairElement(this, {
				left: 'm 50,220 70,0',
				right: 'm 390,220 -70,0'
			}),

			coronacion: new RotatePairElement(this, {
				left: 'm 50,220 140,0',
				right: 'm 390,220 -140,0'
			}, 360)
		};
	}

	setAtStart(manPosition) {
		this.startPosition(this.startPos.start_left, this.startPos.start_right, manPosition);
	}

	esquinaStart(seconds, manPosition, beats) {
		this.clearPaths();
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;
		const manAngle = this.startPos['start_' + manPosition].angle;
		const womanAngle = this.startPos[getOppositePosition('start_' + manPosition)].angle;
		this.elements.esquinaStart.drawPath(manPosition);
		this.elements.contraGiro.drawPath(manPosition);

		this.initRotateIcon(50, 135, 0, false);
		this.initRotateIcon(390, 305, 0, false);
		this.initRotateIcon(125, 125, -45, true);
		this.initRotateIcon(315, 315, -45, true);

		this.elements.esquinaStart.startAnimation(partSeconds, partBeats, manAngle, womanAngle);
		this.elements.contraGiro.startAnimation(partSeconds, partBeats, manAngle - 315, womanAngle - 315, this.DIRECTION_FORWARD, partSeconds);
	}

	esquina(seconds, manPosition, beats) {
		this.clearPaths();
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;
		const manAngle = this.startPos[manPosition].angle;
		const womanAngle = this.startPos[getOppositePosition(manPosition)].angle;
		this.elements.esquina.drawPath(manPosition);
		this.elements.contraGiro.drawPath(manPosition);

		if ((manPosition == 'left') || (manPosition == 'right')) {
			this.initRotateIcon(50, 220, 0, false);
			this.initRotateIcon(390, 220, 0, false);
			this.initRotateIcon(125, 125, -45, true);
			this.initRotateIcon(315, 315, -45, true);
		} else {
			this.initRotateIcon(220, 50, 90, false);
			this.initRotateIcon(220, 390, 90, false);
			this.initRotateIcon(315, 125, 45, true);
			this.initRotateIcon(125, 315, 45, true);
		}

		this.elements.esquina.startAnimation(partSeconds, partBeats, manAngle, womanAngle);
		this.elements.contraGiro.startAnimation(partSeconds, partBeats, manAngle - 270, womanAngle - 270, this.DIRECTION_FORWARD, partSeconds);
	}

	esquinaEnd(seconds, manPosition, beats) {
		this.clearPaths();
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;
		const manAngle = this.startPos[manPosition].angle;
		const womanAngle = this.startPos[getOppositePosition(manPosition)].angle;
		this.elements.esquinaEnd.drawPath(manPosition);
		this.elements.contraGiroEnd.drawPath(manPosition, true);

		const arrows1 = this.initRotateIcon(50, 305, 0, false);
		const arrows2 = this.initRotateIcon(390, 135, 0, false);
		const arrows1_2 = this.initRotateIcon(50, 220, 0, true).removeClass('rotationArrows').addClass('invisible');
		const arrows2_2 = this.initRotateIcon(390, 220, 0, true).removeClass('rotationArrows').addClass('invisible');
		this.timeouts[this.timeouts.length] = new Timer(function () {
			arrows1.removeClass('rotationArrows').addClass('invisible');
			arrows2.removeClass('rotationArrows').addClass('invisible');
			arrows1_2.addClass('rotationArrows').removeClass('invisible');
			arrows2_2.addClass('rotationArrows').removeClass('invisible');
		}, partSeconds * 1000);

		this.elements.esquinaEnd.startAnimation(partSeconds, partBeats, manAngle, womanAngle);
		this.elements.contraGiroEnd.startAnimation(partSeconds, partBeats, manAngle - 270, womanAngle - 270, this.DIRECTION_FORWARD, partSeconds);
	}

	avance(seconds, manPosition, beats) {
		this.clearPaths();
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;
		const manAngle = this.startPos['start_' + manPosition].angle;
		const womanAngle = this.startPos[getOppositePosition('start_' + manPosition)].angle;
		this.elements.avance.drawPath(manPosition);

		this.elements.avance.startAnimation(partSeconds, partBeats);
		this.elements.avance.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds, 1, 0);
	}

	regreso(seconds, manPosition, beats) {
		this.elements.regreso.fullAnimation(seconds, beats, manPosition);
	}

	giro(seconds, manPosition, beats) {
		this.elements.giro.fullAnimation(seconds, beats,
			this.startPos[manPosition].angle - 180,
			this.startPos[getOppositePosition(manPosition)].angle - 180,
			manPosition);
		this.initRotateIcon(this.startPos[manPosition].x,
			this.startPos[manPosition].y, -45, false);
		this.initRotateIcon(this.startPos[getOppositePosition(manPosition)].x,
			this.startPos[getOppositePosition(manPosition)].y, -45, false);
	}

	zapateoZarandeo(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.zarandeo.drawPath(getOppositePosition(manPosition));
		const parts = beats >= 8 ? 4 : 2;
		const partSeconds = seconds / parts;
		const partBeats = beats / parts;
		this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		if (beats >= 8) {
			this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.elements.zarandeo.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
		}

		this.elements.zapateo.drawPath(manPosition);
		this.elements.zapateo.startAnimation(seconds, beats);
	}

	coronacion(seconds, manPosition, beats) {
		this.elements.coronacion.fullAnimation(seconds, beats,
			this.startPos['start_' + manPosition].angle,
			this.startPos[getOppositePosition('start_' + manPosition)].angle,
			manPosition);
		this.initRotateIcon(120, 220, 90, false);
		this.initRotateIcon(320, 220, 90, false);
	}
}
