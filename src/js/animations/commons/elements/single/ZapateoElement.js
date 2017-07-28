import SingleElement from './SingleElement';
import {directions} from 'animationClasses/commons/DanceAnimation';

export default class ZapateoElement extends SingleElement {
	constructor(animation, figure, pathStrings) {
		super(animation, pathStrings, 'man', figure);
	}

	animationFunction(lengthMs, beats, direction = directions.FORWARD, startPart = 0, stopPart = 1) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		if (this.pathStrings) {
			return this.animation.animateFigurePath(this.figure, 90 + this.angle, this.path,
				this.pathLength * startPart, this.pathLength * stopPart, lengthMs, beats * 6, direction, this.easing);
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
