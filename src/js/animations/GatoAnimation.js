import DanceAnimation from './commons/animation.js';
import {DanceAnimationElement} from './commons/elements.js';
import {getOppositePosition} from './commons/utils.js';
import {ZapateoElement, ZarandeoElement, VueltaElement} from './commons/animation_gato_style.js';

export default class GatoAnimation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.width = 600;
		this.height = 325;
		this.startPos = {
			left: {x: 40, y: 160, angle: -90},
			right: {x: 560, y: 160, angle: 90}
		};

		this.giroElement = new DanceAnimationElement(this,
			{left: 'm 40,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 C 240,80 200,40 140,40 80,40 40,80 40,140 z',
			right: 'M 560,140 C 560,80 520,40 460,40 400,40 360,80 360,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 z'});

		this.mediaVueltaElement = new DanceAnimationElement(this,
			{left: 'm 40,160 c 0,50 120,120 260,120 140,0 260,-70 260,-120',
			right: 'M 560,160 C 560,110 440,40 300,40 160,40 40,110 40,160'});

		this.coronacionElement = new DanceAnimationElement(this,
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
};
