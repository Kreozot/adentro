import {SingleDanceAnimationElement, DanceAnimationElement} from './elements.js';
import {Timer} from './utils.js';

export class ZapateoElement extends SingleDanceAnimationElement {
	constructor(animation, figure, pathStrings) {
		super(animation, pathStrings, 'man', figure);
	}

	animationFunction(lengthMs, times) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		this.animation.animateFigureTime(this.figure, lengthMs, times * 6);
	}

	drawPath(position) {
		this.animation.manPosition = position;
		this.position = position;

		if (this.pathStrings) {
			this.path = this.animation.path(this.pathStrings[position], this.gender, hidden);
			this.pathLength = this.path.getTotalLength() - 1;
		}
	}
}

export class ZarandeoElement extends SingleDanceAnimationElement {
	constructor(animation, pathStrings, figure) {
		super(animation, pathStrings, 'woman', figure);
	}
}

export class VueltaElement extends DanceAnimationElement {
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
			this.g = this.animation.svg.gradient('L(' + movePoint1.x + ', ' + movePoint1.y + ', ' +
				movePoint2.x + ', ' + movePoint2.y + ')' + this.gColors);
			this.path.attr({stroke: this.g});
		}
	}

	animationFunction(lengthMs, times, direction, startPart, stopPart) {
		//Если идём из начала в конец, то инвертируем цвета градиента
		if (startPart > stopPart) {
			this.setColors(this.rightColor, this.leftColor);
		}

		var self = this;
		this.animation.animations[this.animation.animations.length] = Snap.animate(startPart * this.pathLength,
			stopPart * this.pathLength,
			function (value) {
				this.lastValue = value;
				self.drawGradientAtPoint(value);
			}, lengthMs, mina.linear);

		self.animation.animateMan(self.path, this.startPos1,
			stopPart * this.pathLength + this.startPos1, lengthMs, times, direction);
		self.animation.animateWoman(self.path, this.startPos2,
			stopPart * this.pathLength + this.startPos2, lengthMs, times, direction);
	}

	startAnimation(lengthS, times, direction, delay, startPart, stopPart, full) {
		startPart = (typeof startPart === 'undefined') ? 0 : startPart;
		stopPart = (typeof stopPart === 'undefined') ? 1 : stopPart;

		const startAnimationFunc = () => {
			this.animationFunction(lengthS * 1000, times, direction, startPart, stopPart);
		}

		if ((!delay) || (delay <= 0)) {
			startAnimationFunc();
		} else {
			this.animation.timeouts[this.animation.timeouts.length] = new Timer(startAnimationFunc, delay * 1000);
		}
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
