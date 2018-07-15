import SingleElement from './SingleElement';
import {STEP_STYLE, FIGURE_HANDS, DIRECTIONS} from 'js/animations/commons/const';

export default class ZapateoElement extends SingleElement {
	constructor(animation, figure, pathStrings) {
		super(animation, pathStrings, 'man', figure);
	}

	animationFunction({lengthMs, beats, direction = DIRECTIONS.FORWARD, startPart = 0, stopPart = 1, figureHands = FIGURE_HANDS.DOWN}) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		if (this.pathStrings) {
			return this.animation.animateFigurePath({
				figure: this.figure,
				startAngle: 90 + this.angle,
				path: this.path,
				startLen: this.pathLength * startPart,
				stopLen: this.pathLength * stopPart,
				timeLength: lengthMs,
				beats: beats,
				direction,
				easing: this.easing,
				stepStyle: STEP_STYLE.ZAPATEO,
				figureHands: figureHands
			});
		} else {
			return this.animation.legs.animateFigureTime({
				figure: this.figure,
				timeLength: lengthMs,
				beats,
				stepStyle: STEP_STYLE.ZAPATEO,
				figureHands: figureHands
			});
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
