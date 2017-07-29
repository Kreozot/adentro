import Promise from 'bluebird';
import {directions, FIGURE_HANDS} from 'animationClasses/commons/DanceAnimation';
import PairElement from './PairElement';

export default class VueltaElement extends PairElement {
	constructor(animation, pathStr) {
		super(animation, pathStr);
		this.pathStr = pathStr;
		this.g = {};
	}

	setColors(leftColor, rightColor) {
		this.leftColor = leftColor;
		this.rightColor = rightColor;
		this.gColors = leftColor + '-' + rightColor;
	}

	drawGradientAtPoint(value) {
		var value2 = value + this.halfLength;
		if (value2 > this.pathLength) {
			value2 = value2 - this.pathLength;
		}

		const movePoint1 = this.path.getPointAtLength(value + this.gradientOffset);
		const movePoint2 = this.path.getPointAtLength(value2 + this.gradientOffset);
		if (this.g.type === 'linearGradient') {
			this.g.attr({
				x1: movePoint1.x,
				y1: movePoint1.y,
				x2: movePoint2.x,
				y2: movePoint2.y
			});
			this.path.attr({stroke: this.g});
		} else {
			this.g = this.animation.svg.gradient(`L(${movePoint1.x}, ${movePoint1.y}, ${movePoint2.x}, ${movePoint2.y})${this.gColors}`);
			this.path.attr({stroke: this.g});
		}
	}

	animationFunction({lengthMs, beats, direction = directions.FORWARD, startPart = 0, stopPart = 1, figureHands = FIGURE_HANDS.CASTANETAS}) {
		//Если идём из начала в конец, то инвертируем цвета градиента
		if (startPart > stopPart) {
			this.setColors(this.rightColor, this.leftColor);
		}

		const self = this;
		const gradientAnimationPromise = new Promise(resolve => {
			this.animation.animations[this.animation.animations.length] = Snap.animate(
				startPart * this.pathLength,
				stopPart * this.pathLength,
				function (value) {
					this.lastValue = value;
					self.drawGradientAtPoint(value);
				}, lengthMs, mina.linear, resolve
			);
		});

		return Promise.all([
			gradientAnimationPromise,
			this.animation.animateMan({
				path: this.path,
				startLen: this.startPos1,
				stopLen: stopPart * this.pathLength + this.startPos1,
				timeLength: lengthMs,
				beats,
				direction,
				figureHands
			}),
			this.animation.animateWoman({
				path: this.path,
				startLen: this.startPos2,
				stopLen: stopPart * this.pathLength + this.startPos2,
				timeLength: lengthMs,
				beats,
				direction,
				figureHands
			})
		]);
	}

	startAnimation(options) {
		return this.animationFunction({...options, lengthMs: options.lengthS * 1000});
	}

	drawPath(manPosition) {
		this.g = {};
		this.animation.manPosition = manPosition;
		this.path = this.animation.path(this.pathStr);
		this.pathLength = this.path.getTotalLength();
		this.gradientOffset = this.pathLength / 6;
		this.halfLength = this.pathLength / 2;

		if (manPosition === 'left') {
			this.startPos1 = 0;
			this.startPos2 = this.halfLength;
			this.setColors(this.animation.MAN_COLOR, this.animation.WOMAN_COLOR);
		} else {
			this.startPos1 = this.halfLength;
			this.startPos2 = 0;
			this.setColors(this.animation.WOMAN_COLOR, this.animation.MAN_COLOR);
		}

		this.drawGradientAtPoint(0);
	}
}
