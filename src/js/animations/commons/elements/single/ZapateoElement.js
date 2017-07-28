import SingleElement from './SingleElement';
import {directions} from 'animationClasses/commons/DanceAnimation';

export default class ZapateoElement extends SingleElement {
	constructor(animation, figure, pathStrings) {
		super(animation, pathStrings, 'man', figure);
	}

	animationFunction({lengthMs, beats, direction = directions.FORWARD, startPart = 0, stopPart = 1}) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		if (this.pathStrings) {
			return this.animation.animateFigurePath({
				figure: this.figure,
				startAngle: 90 + this.angle,
				path: this.path,
				startLen: this.pathLength * startPart,
				stopLen: this.pathLength * stopPart,
				timeLength: lengthMs,
				beats: beats * 6,
				direction,
				easing: this.easing
			});
		} else {
			return this.animation.animateFigureTime(this.figure, lengthMs, beats * 6);
		}
	}

	drawPath(position, hidden) {
		this.animation.manPosition = position;
		this.position = position;

		if (this.pathStrings) {
			this.path = this.animation.path(this.pathStrings[position], this.gender, hidden);
			this.pathLength = this.path.getTotalLength() - 1;
		}
	}
}
