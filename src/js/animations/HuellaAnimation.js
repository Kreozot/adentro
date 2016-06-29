import GatoAnimation from './GatoAnimation.js';
import {DanceAnimationElement, SingleDanceAnimationElement} from './commons/elements.js';
import {getOppositePosition} from './commons/utils.js';
import {ZapateoElement, ZarandeoElement} from './commons/animation_gato_style.js';

class HuellaManAnimationElement extends SingleDanceAnimationElement {
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
		this.avanceElement = new DanceAnimationElement(this, {
			left: 'M 40,160 140,260 240,160 140,60 z',
			right: 'M 560,160 460,60 360,160 460,260 z'
		});

		this.zapateoElement = new ZapateoElement(this, this.man, {
			left: 'm 40,160 320,0',
			right: 'm 560,160 -320,0'
		});

		this.manGiroElement1 = new HuellaManAnimationElement(this, {
			left: 'm 360,160 40,-40',
			right: 'm 240,160 -40,40'
		}, 'man', this.man);

		this.manGiroElement2 = new HuellaManAnimationElement(this, {
			left: 'm 400,120 c 0,0 -100,0 -100,40 0,40 100,40 100,40',
			right: 'm 200,200 c 0,0 100,0 100,-40 0,-40 -100,-40 -100,-40'
		}, 'man', this.man);

		this.manGiroElement3 = new HuellaManAnimationElement(this, {
			left: 'm 400,200 c 0,0 -100,-40 -360,-40',
			right: 'm 200,120 c 0,0 100,40 360,40'
		}, 'man', this.man);

		this.manGiroElement1_contra = new HuellaManAnimationElement(this, {
			left: 'm 360,160 40,40',
			right: 'M 240,160 200,120'
		}, 'man', this.man);

		this.manGiroElement2_contra = new HuellaManAnimationElement(this, {
			left: 'm 400,200 c 0,0 -100,0 -100,-40 0,-40 100,-40 100,-40',
			right: 'm 200,120 c 0,0 100,0 100,40 0,40 -100,40 -100,40'
		}, 'man', this.man);

		this.manGiroElement3_contra = new HuellaManAnimationElement(this, {
			left: 'm 400,120 c 0,0 -100,40 -360,40',
			right: 'm 200,200 c 0,0 100,-40 360,-40'
		}, 'man', this.man);

		this.womanGiroElement = new SingleDanceAnimationElement(this, {
			left: 'm 40,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 C 240,80 200,40 140,40 80,40 40,80 40,140 z',
			right: 'M 560,140 C 560,80 520,40 460,40 400,40 360,80 360,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 z'
		}, 'woman', this.woman);
	}

	giroMano(seconds, manPosition, beats) {
		this.clearPaths();
		this.womanGiroElement.drawPath(getOppositePosition(manPosition));
		this.manGiroElement1.drawPath(manPosition);
		this.manGiroElement2.drawPath(manPosition);
		this.manGiroElement3.drawPath(manPosition);
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;
		this.womanGiroElement.startAnimation(seconds, beats);
		this.manGiroElement1.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, 0);
		this.manGiroElement2.startAnimation(partSeconds * 2, partBeats * 2, this.DIRECTION_STRAIGHT_FORWARD, partSeconds);
		this.manGiroElement3.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, partSeconds * 3);
	}

	contraGiroMano(seconds, manPosition, beats) {
		this.clearPaths();
		this.womanGiroElement.drawPath(getOppositePosition(manPosition));
		this.manGiroElement1_contra.drawPath(manPosition);
		this.manGiroElement2_contra.drawPath(manPosition);
		this.manGiroElement3_contra.drawPath(manPosition);
		const partSeconds = seconds / 4;
		const partBeats = beats / 4;
		this.womanGiroElement.startAnimation(seconds, beats, this.DIRECTION_BACKWARD, 0, 1, 0);
		this.manGiroElement1_contra.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, 0);
		this.manGiroElement2_contra.startAnimation(partSeconds * 2, partBeats * 2, this.DIRECTION_STRAIGHT_FORWARD, partSeconds);
		this.manGiroElement3_contra.startAnimation(partSeconds, partBeats, this.DIRECTION_STRAIGHT_FORWARD, partSeconds * 3);
	}

	mediaContraVuelta(seconds, manPosition, beats) {
	}

}
