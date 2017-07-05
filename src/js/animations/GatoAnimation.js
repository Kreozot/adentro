import DanceAnimation from './commons/DanceAnimation';
import PairElement from './commons/elements/double/PairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import VueltaElement from './commons/elements/double/VueltaElement';
import {getOppositePosition} from './commons/utils';

export default class GatoAnimation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.width = 600;
		this.height = 325;
		this.startPos = {
			left: {x: 40, y: 160, angle: -90},
			right: {x: 560, y: 160, angle: 90}
		};

		this.giroElement = new PairElement(this,
			{left: getSvgPath('gato.svg', 'giro_left'),
				right: getSvgPath('gato.svg', 'giro_right')});

		this.mediaVueltaElement = new PairElement(this,
			{left: getSvgPath('gato.svg', 'media_vuelta_left'),
				right: getSvgPath('gato.svg', 'media_vuelta_right')});

		this.coronacionElement = new PairElement(this,
			{left: 'm 40,160 c 0,40 120,60 160,60 40,0 80,-20 80,-60 0,-25 -15,-40 -40,-40 -25,0 -40,15 -40,40 0,25 15,40 40,40 25,0 40,-20 50,-40',
				right: 'm 560,160 c 0,-40 -120,-60 -160,-60 -40,0 -80,20 -80,60 0,25 15,40 40,40 25,0 40,-15 40,-40 0,-25 -15,-40 -40,-40 -25,0 -40,20 -50,40'});

		this.zapateoElement = new ZapateoElement(this);

		this.zarandeoElement = new ZarandeoElement(this,
			{left: 'M 40,160 140,260 240,160 140,60 z',
				right: 'M 560,160 460,60 360,160 460,260 z'});

		this.vueltaElement = new VueltaElement(this,
			'm 45,150 c 0,45 105,105 255,105 150,0 255,-60 255,-105 C 555,105 450,45 300,45 150,45 45,105 45,150 z');

	}

	vuelta(seconds, manPosition, beats) {
		this.vueltaElement.fullAnimation(seconds, beats, manPosition);
	}

	giro(seconds, manPosition, beats) {
		this.giroElement.fullAnimation(seconds, beats, manPosition);
	}

	contraGiro(seconds, manPosition, beats) {
		this.giroElement.fullAnimation(seconds, beats, manPosition, this.DIRECTION_BACKWARD, 0, 1, 0);
	}

	zapateoZarandeo(seconds, manPosition, beats) {
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

		this.zapateoElement.drawPath(manPosition);
		this.zapateoElement.startAnimation(seconds, beats);
	}

	mediaVuelta(seconds, manPosition, beats) {
		this.mediaVueltaElement.fullAnimation(seconds, beats, manPosition);
	}

	coronacion(seconds, manPosition, beats) {
		this.coronacionElement.fullAnimation(seconds, beats, manPosition);
	}
}
