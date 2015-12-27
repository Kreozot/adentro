import {DanceAnimationElement} from './commons/elements.js';
import {ZapateoElement, ZarandeoElement} from './commons/animation_gato_style.js';

export default class HuellaAnimation extends GatoAnimation {
	constructor(id) {
		super(id);
		this.avanceElement = new DanceAnimationElement(this,
			{left: 'M 40,160 140,260 240,160 140,60 z',
			right: 'M 560,160 460,60 360,160 460,260 z'});

		this.zapateoElement = new ZapateoElement(this, undefined, {
			left: 'm 40,160 320,0',
			right: 'm 560,160 -320,0'
		});

		this.giroElement1 = new DanceAnimationElement(this, {
			left: 'm 360,160 40,-40',
			right: 'm 240,160 -40,40'
		});

		this.giroElement2 = new DanceAnimationElement(this, {
			left: 'm 400,120 c 0,0 -100,0 -100,40 0,40 100,40 100,40',
			right: 'm 200,200 c 0,0 100,0 100,-40 0,-40 -100,-40 -100,-40'
		});

		this.giroElement3 = new DanceAnimationElement(this, {
			left: 'm 400,200 c 0,0 -100,-40 -360,-40',
			right: 'm 200,120 c 0,0 100,40 360,40'
		});
	}

	giroMano(seconds, manPosition, times) {
	}

	contraGiroMano(seconds, manPosition, times) {
	}

	mediaContraVuelta(seconds, manPosition, times) {
	}

}
