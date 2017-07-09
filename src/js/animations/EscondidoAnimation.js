import DanceAnimation from './commons/DanceAnimation';
import PairElement from './commons/elements/double/PairElement';
import RotatePairElement from './commons/elements/double/RotatePairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {getOppositePosition, Timer} from './commons/utils';
import {escondido} from './svg/svg';

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

		this.giroElement = new PairElement(this, {
			left: escondido.giro_left,
			right: escondido.giro_right
		});

		this.vueltaElement = new VueltaElement(this, escondido.vuelta);

		this.zapateoElement = new ZapateoElement(this);

		this.zarandeoElement = new ZarandeoElement(this, {
			left: escondido.zarandeo_left,
			top: escondido.zarandeo_top,
			right: escondido.zarandeo_right,
			bottom: escondido.zarandeo_bottom
		});

		this.mediaVueltaElement = new PairElement(this, {
			left: escondido.media_vuelta_left,
			right: escondido.media_vuelta_right
		});

		this.coronacionElement = new PairElement(this, {
			left: 'm 50,390 c 30,20 110,-20 150,-60 40,-40 20,-110 -20,-110 -20,0 -40,10 -40,40 0,25 20,40 40,40 40,0 60,-30 50,-60',
			right: 'm 390,50 c -30,-20 -110,20 -150,60 -40,40 -20,110 20,110 20,0 40,-10 40,-40 0,-25 -20,-40 -40,-40 -40,0 -60,30 -50,60'
		});

		this.esquinaElement = new RotatePairElement(this, {
			left: 'M 50,390 50,50',
			top: 'm 50,50 340,0',
			right: 'm 390,50 0,340',
			bottom: 'M 390,390 50,390'
		}, 270);
		this.balanceo1Element = new PairElement(this, {
			left: 'M 50,50 70,30 50,50',
			top: 'M 390,50 410,70 390,50',
			right: 'm 390,390 -20,20 20,-20',
			bottom: 'M 50,390 30,370 50,390'
		});
		this.balanceo2Element = new PairElement(this, {
			left: 'M 50,50 30,70 50,50',
			top: 'M 390,50 370,30 390,50',
			right: 'm 390,390 20,-20 -20,20',
			bottom: 'M 50,390 70,410 50,390'
		});
	}

	esquina(seconds, manPosition, beats) {
		this.clearPaths();
		var partSeconds = seconds / 4;
		var firstPartSeconds = partSeconds * 2;
		var partBeats = beats / 4;
		var manAngle = this.startPos[manPosition].angle;
		var womanAngle = this.startPos[getOppositePosition(manPosition)].angle;
		this.esquinaElement.drawPath(manPosition);
		this.balanceo1Element.drawPath(manPosition, true);
		this.balanceo2Element.drawPath(manPosition, true);

		if ((manPosition == 'left') || (manPosition == 'right')) {
			this.initRotateIcon(50, 220, 0, false);
			this.initRotateIcon(390, 220, 0, false);
		} else {
			this.initRotateIcon(220, 50, 90, false);
			this.initRotateIcon(220, 390, 90, false);
		}

		this.balanceo1Element.setAngles(manAngle, womanAngle);
		this.balanceo2Element.setAngles(manAngle, womanAngle);
		this.balanceo1Element.easing = mina.easeout;
		this.balanceo2Element.easing = mina.easeout;

		this.esquinaElement.startAnimation(firstPartSeconds, partBeats * 2, manAngle, womanAngle);
		this.balanceo1Element.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, firstPartSeconds, 0, 1);
		this.balanceo2Element.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, firstPartSeconds + partSeconds, 0, 1);
	}

	vueltaGiro(seconds, manPosition, beats) {
		const firstPart = 6 / beats;
		const secondPart = 2 / beats;

		this.vueltaElement.fullAnimation(seconds * firstPart, beats * firstPart, manPosition);
		this.giroElement.fullAnimation(seconds * secondPart, beats * secondPart, manPosition, this.DIRECTION_FORWARD, seconds * firstPart);
	}

	zapateo(seconds, manPosition, beats) {
		this.setAtStart(manPosition);
		this.zapateoElement.fullAnimation(seconds, beats, manPosition);
	}

	zarandeo(seconds, manPosition, beats) {
		this.setAtStart(manPosition);
		this.clearPaths();
		this.zarandeoElement.drawPath(getOppositePosition(manPosition));
		const parts = beats >= 8 ? 4 : 2;
		const partSeconds = seconds / parts;
		const partBeats = beats / parts;
		this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		if (beats >= 8) {
			this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
		}
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.mediaVueltaElement.fullAnimation(seconds, beats, manPosition);
	}

	coronacion(seconds, manPosition, beats) {
		this.coronacionElement.fullAnimation(seconds, beats, manPosition);
	}
}
