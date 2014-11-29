function ZapateoElement(animation, figure) {
	ZapateoElement.superclass.constructor.apply(this, [animation, {}, "man", figure]);

	this.animationFunction = function(lengthMs, times) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		this.animation.animateFigureTime(this.figure, lengthMs, times * 6);
	}

	this.drawPath = function(position) {
		this.animation.manPosition = position;
		this.position = position;
	}
}
extend(ZapateoElement, SingleDanceAnimationElement);

function ZarandeoElement(animation, pathStrings, figure) {
	ZarandeoElement.superclass.constructor.apply(this, [animation, pathStrings, "woman", figure]);
}
extend(ZarandeoElement, SingleDanceAnimationElement);

function VueltaElement(animation, pathStr) {
	VueltaElement.superclass.constructor.apply(this, arguments);
	this.pathStr = pathStr;

	this.setColors = function(leftColor, rightColor) {
		this.leftColor = leftColor;
		this.rightColor = rightColor;
		this.gColors = leftColor + "-" + rightColor;
	};

	this.drawGradientAtPoint = function(value) {
		var value2 = value + this.halfLength;
		if (value2 > this.pathLength) {
			value2 = value2 - this.pathLength;
		}

		movePoint1 = this.path.getPointAtLength(value + this.gradientOffset);
		movePoint2 = this.path.getPointAtLength(value2 + this.gradientOffset);
		var g = this.animation.svg.gradient("L(" + movePoint1.x + ", " + movePoint1.y + ", " + 
			movePoint2.x + ", " + movePoint2.y + ")" + this.gColors);
		this.path.attr({stroke: g});		
	};

	this.animationFunction = function(lengthMs, times, direction, startPart, stopPart) {
		//Если идём из начала в конец, то инвертируем цвета градиента
		if (startPart > stopPart) {
			this.setColors(this.rightColor, this.leftColor);
		}

		var self = this;
		this.animation.animations[this.animation.animations.length] = Snap.animate(startPart * this.pathLength, 
			stopPart * this.pathLength, 
			function(value) {
				this.lastValue = value;
				self.drawGradientAtPoint(value);
			}, lengthMs, mina.linear);

		// this.manDanceAnimationElement.path = this.path;
		// this.manDanceAnimationElement.pathLength = this.pathLength;
		// this.womanDanceAnimationElement.path = this.path;
		// this.womanDanceAnimationElement.pathLength = this.pathLength;
		// this.manDanceAnimationElement.startAnimation(lengthMs / 1000, times, direction, startPart, stopPart);
		// this.womanDanceAnimationElement.startAnimation(lengthMs / 1000, times, direction, startPart, stopPart);
		// self.animation.animateFigurePath(self.figure, 90 + self.angle, self.path, 
		// 	self.pathLength * startPart, self.pathLength * stopPart, lengthMs, times, direction, self.easing);

		self.animation.animateMan(self.path, this.startPos1, 
			stopPart * this.pathLength + this.startPos1, lengthMs, times, direction);
		self.animation.animateWoman(self.path, this.startPos2, 
			stopPart * this.pathLength + this.startPos2, lengthMs, times, direction);
	}

	this.startAnimation = function(lengthS, times, direction, delay, startPart, stopPart, full) {
		startPart = (typeof startPart === 'undefined') ? 0 : startPart;
		stopPart = (typeof stopPart === 'undefined') ? 1 : stopPart;

		if ((!delay) || (delay <= 0)) {
			// this.startAnimation();
			this.animationFunction(lengthS * 1000, times, direction, startPart, stopPart);			
		} else {
			this.animation.timeouts[this.animation.timeouts.length] = new Timer(function(self) {
				return function() {
					// this.startAnimation();
					self.animationFunction(lengthS * 1000, times, direction, startPart, stopPart);
				};
			}(this), delay * 1000);
		}
	};

	this.drawPath = function(manPosition) {
		this.animation.manPosition = manPosition;
		this.path = this.animation.path(pathStr, "Black", "vueltaPath");
		this.pathLength = this.path.getTotalLength();	
		this.gradientOffset = this.pathLength / 6;
		this.halfLength = this.pathLength / 2;

		if (manPosition === "left") {
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
extend(VueltaElement, DanceAnimationElement);


function GatoStyleAnimation(id) {
	GatoStyleAnimation.superclass.constructor.apply(this, arguments);

	this.ZAPATEO_ZARANDEO = 0;
	this.ZAPATEO_ONLY = 1;
	this.ZARANDEO_ONLY = 2;

	this.commonVuelta = function(path, seconds, times, manPosition, direction) {
		var vueltaPath;
		if (path.type == "path") {
			vueltaPath = path;
		} else {
			vueltaPath = this.path(path, "Black", "vueltaPath");
		}
		
		var len = vueltaPath.getTotalLength();
		timeLength = seconds * 1000;

		if (manPosition === "left") {
			startPos1 = 0;
			startPos2 = len / 2;
			gColors = this.MAN_COLOR + "-" + this.WOMAN_COLOR;
		} else {
			startPos1 = len / 2;
			startPos2 = 0;
			gColors = this.WOMAN_COLOR + "-" + this.MAN_COLOR;
		}
		if (direction === self.DIRECTION_FROM_END_TO_START) {
			if (manPosition === "left") {
				gColors = this.WOMAN_COLOR + "-" + this.MAN_COLOR;
			} else {
				gColors = this.MAN_COLOR + "-" + this.WOMAN_COLOR;
			}
		}

		this.initManWoman();
		self = this;

		// Градиент траектории вуэльты
		var gradientOffset = len / 6;
		var halfLen = len / 2;
		self.animations[self.animations.length] = Snap.animate(0, len, 
			function(value) {
				this.lastValue = value;
				if (direction === self.DIRECTION_FROM_END_TO_START) {
					value = len - value;
				}

				var value2 = value;
				if (value2 > halfLen) {
					value2 = value2 - len;
				}

				movePoint1 = vueltaPath.getPointAtLength(value + gradientOffset);
				movePoint2 = vueltaPath.getPointAtLength(value2 + halfLen + gradientOffset);
				var g = self.svg.gradient("L(" + movePoint1.x + ", " + movePoint1.y + ", " + 
					movePoint2.x + ", " + movePoint2.y + ")" + gColors);
				vueltaPath.attr({stroke: g});
			}, timeLength, mina.linear);

		self.animateMan(vueltaPath, startPos1, startPos1 + len, timeLength, times, direction);
		self.animateWoman(vueltaPath, startPos2, startPos2 + len, timeLength, times, direction);
	};

	this.commonZapateoZarandeo = function(leftPath, rightPath, seconds, manPosition, times, mode) {
		this.setAtStart(manPosition);

		if (mode !== this.ZARANDEO_ONLY) {
			// Пульсация в такт (сапатео)
			this.animateFigureTime(this.man, seconds * 1000, times * 6);
		}

		if (mode !== this.ZAPATEO_ONLY) {			
			var onePartTimeLength = seconds * 1000 / 4;
			var onePartTimes = times / 4;

			// При сапатео на 4 делим общее время на 2, а не на 4
			if (times <= 4) {
				onePartTimeLength = seconds * 1000 / 2;
				onePartTimes = times / 2;
			}

			if (manPosition === "left") {			
				var womanPath = this.womanPath(rightPath);
			} else {
				var womanPath = this.womanPath(leftPath);
			}
			var womanLen = womanPath.getTotalLength();
			this.timeouts[this.timeouts.length] = new Timer(function(self) {
				return function() {
					self.animateWoman(womanPath, 0, womanLen / 2, onePartTimeLength, onePartTimes);
				};
			}(this));
			this.timeouts[this.timeouts.length] = new Timer(function(self) {
				return function() {
					self.animateWoman(womanPath, womanLen / 2, womanLen, onePartTimeLength, onePartTimes, self.DIRECTION_BACKWARD);
				};
			}(this), onePartTimeLength);

			if (times > 4) {
				this.timeouts[this.timeouts.length] = new Timer(function(self) {
					return function() {
						self.animateWoman(womanPath, 0, womanLen / 2, onePartTimeLength, onePartTimes);
					};
				}(this), onePartTimeLength * 2);
				this.timeouts[this.timeouts.length] = new Timer(function(self) {
					return function() {
						self.animateWoman(womanPath, womanLen / 2, womanLen, onePartTimeLength, onePartTimes, self.DIRECTION_BACKWARD);
					};
				}(this), onePartTimeLength * 3);
			}
		}
	};
};
extend(GatoStyleAnimation, DanceAnimation);