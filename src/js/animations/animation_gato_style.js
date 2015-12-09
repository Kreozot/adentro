function ZapateoElement(animation, figure, pathStrings) {
	ZapateoElement.superclass.constructor.apply(this, [animation, pathStrings, 'man', figure]);

	this.animationFunction = function (lengthMs, times) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		this.animation.animateFigureTime(this.figure, lengthMs, times * 6);
	};

	this.drawPath = function (position) {
		this.animation.manPosition = position;
		this.position = position;

		if (pathStrings) {
			this.path = this.animation.path(this.pathStrings[position], this.gender, hidden);
			this.pathLength = this.path.getTotalLength() - 1;
		}
	};
}
extend(ZapateoElement, SingleDanceAnimationElement);

function ZarandeoElement(animation, pathStrings, figure) {
	ZarandeoElement.superclass.constructor.apply(this, [animation, pathStrings, 'woman', figure]);
}
extend(ZarandeoElement, SingleDanceAnimationElement);

function VueltaElement(animation, pathStr) {
	VueltaElement.superclass.constructor.apply(this, arguments);
	this.pathStr = pathStr;
	this.g = {};

	this.setColors = function (leftColor, rightColor) {
		this.leftColor = leftColor;
		this.rightColor = rightColor;
		this.gColors = leftColor + '-' + rightColor;
	};

	this.drawGradientAtPoint = function (value) {
		var value2 = value + this.halfLength;
		if (value2 > this.pathLength) {
			value2 = value2 - this.pathLength;
		}

		movePoint1 = this.path.getPointAtLength(value + this.gradientOffset);
		movePoint2 = this.path.getPointAtLength(value2 + this.gradientOffset);
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
	};

	this.animationFunction = function (lengthMs, times, direction, startPart, stopPart) {
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
	};

	this.startAnimation = function (lengthS, times, direction, delay, startPart, stopPart, full) {
		startPart = ( typeof startPart === 'undefined') ? 0 : startPart;
		stopPart = ( typeof stopPart === 'undefined') ? 1 : stopPart;
		var self = this;

		function startAnimationFunc() {
			self.animationFunction(lengthS * 1000, times, direction, startPart, stopPart);				
		}

		if ((!delay) || (delay <= 0)) {
			startAnimationFunc();			
		} else {
			this.animation.timeouts[this.animation.timeouts.length] = new Timer(startAnimationFunc, delay * 1000);
		}
	};

	this.drawPath = function (manPosition) {
		this.g = {};
		this.animation.manPosition = manPosition;
		this.path = this.animation.path(pathStr);
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
	};
}
extend(VueltaElement, DanceAnimationElement);