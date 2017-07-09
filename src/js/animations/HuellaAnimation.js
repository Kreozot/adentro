import GatoAnimation from './GatoAnimation';
import SingleElement from './commons/elements/single/SingleElement';
import PairElement from './commons/elements/double/PairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import ZarandeoElement from './commons/elements/single/ZarandeoElement';
import {getOppositePosition} from './commons/utils';

class HuellaManAnimationElement extends SingleElement {
	constructor(animation, pathStrings, gender, figure) {
		super(animation, pathStrings, gender, figure);

		this.animationFunction = function (lengthMs, beats, direction, startPart, stopPart) {
			var angle = this.position === 'left' ? -90 : 90;
			this.animation.animateFigurePath(this.figure, angle, this.path,
				this.pathLength * startPart, this.pathLength * stopPart,
				lengthMs, beats, this.animation.DIRECTION_STRAIGHT_FORWARD);
		};
	}
}

export default class HuellaAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			avance: new PairElement(this, {
				left: 'M 40,160 140,260 240,160 140,60 z',
				right: 'M 560,160 460,60 360,160 460,260 z'
			}),

			zapateo: new ZapateoElement(this, this.man, {
				left: 'm 40,160 320,0',
				right: 'm 560,160 -320,0'
			}),

			manGiro1: new HuellaManAnimationElement(this, {
				left: 'm 360,160 40,-40',
				right: 'm 240,160 -40,40'
			}, 'man', this.man),

			manGiro2: new HuellaManAnimationElement(this, {
				left: 'm 400,120 c 0,0 -100,0 -100,40 0,40 100,40 100,40',
				right: 'm 200,200 c 0,0 100,0 100,-40 0,-40 -100,-40 -100,-40'
			}, 'man', this.man),

			manGiro3: new HuellaManAnimationElement(this, {
				left: 'm 400,200 c 0,0 -100,-40 -360,-40',
				right: 'm 200,120 c 0,0 100,40 360,40'
			}, 'man', this.man),

			manGiro1_contra: new HuellaManAnimationElement(this, {
				left: 'm 360,160 40,40',
				right: 'M 240,160 200,120'
			}, 'man', this.man),

			manGiro2_contra: new HuellaManAnimationElement(this, {
				left: 'm 400,200 c 0,0 -100,0 -100,-40 0,-40 100,-40 100,-40',
				right: 'm 200,120 c 0,0 100,0 100,40 0,40 -100,40 -100,40'
			}, 'man', this.man),

			manGiro3_contra: new HuellaManAnimationElement(this, {
				left: 'm 400,120 c 0,0 -100,40 -360,40',
				right: 'm 200,200 c 0,0 100,-40 360,-40'
			}, 'man', this.man),

			womanGiro: new SingleElement(this, {
				left: 'm 40,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 C 240,80 200,40 140,40 80,40 40,80 40,140 z',
				right: 'M 560,140 C 560,80 520,40 460,40 400,40 360,80 360,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 z'
			}, 'woman', this.woman),

			mediaContraVueltaMan: new SingleElement(this, {
				left: 'M 560,160 C 560,110 440,40 300,40 160,40 40,110 40,160',
				right: 'm 40,160 c 0,50 120,120 260,120 140,0 260,-70 260,-120'
			}, 'man', this.man),

			mediaContraVueltaWoman: new SingleElement(this, {
				left: 'M 560,160 C 560,110 440,40 300,40 160,40 40,110 40,160',
				right: 'm 40,160 c 0,50 120,120 260,120 140,0 260,-70 260,-120'
			}, 'woman', this.woman)
		};
	}

	giroMano(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.womanGiro.drawPath(getOppositePosition(manPosition));
		this.elements.manGiro1.drawPath(manPosition);
		this.elements.manGiro2.drawPath(manPosition);
		this.elements.manGiro3.drawPath(manPosition);
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;
		this.elements.womanGiro.startAnimation(seconds, beats);
		this.elements.manGiro1.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, 0);
		this.elements.manGiro2.startAnimation(partSeconds * 2, partBeats * 2, this.DIRECTION_STRAIGHT_FORWARD, partSeconds);
		this.elements.manGiro3.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, partSeconds * 3);
	}

	contraGiroMano(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.womanGiro.drawPath(getOppositePosition(manPosition));
		this.elements.manGiro1_contra.drawPath(manPosition);
		this.elements.manGiro2_contra.drawPath(manPosition);
		this.elements.manGiro3_contra.drawPath(manPosition);
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;
		this.elements.womanGiro.startAnimation(seconds, beats, this.DIRECTION_BACKWARD, 0, 1, 0);
		this.elements.manGiro1_contra.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, 0);
		this.elements.manGiro2_contra.startAnimation(partSeconds * 2, partBeats * 2, this.DIRECTION_STRAIGHT_FORWARD, partSeconds);
		this.elements.manGiro3_contra.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, partSeconds * 3);
	}

	mediaContraVuelta(seconds, manPosition, beats) {
		this.clearPaths();
		this.elements.mediaContraVueltaMan.drawPath(manPosition);
		this.elements.mediaContraVueltaWoman.drawPath(getOppositePosition(manPosition));
		this.elements.mediaContraVueltaMan.startAnimation(seconds, beats, this.DIRECTION_FORWARD, 0, 1, 0);
		this.elements.mediaContraVueltaWoman.startAnimation(seconds, beats, this.DIRECTION_BACKWARD, 0, 1, 0);
	}

}
