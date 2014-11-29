function extend(Child, Parent) {
	var F = function() { }
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

/**
 * [Timer Таймер]
 * @param {Function} callback [Функция]
 * @param {[Number]}   delay    [задержка в мс]
 */
function Timer(callback, delay) {
	var remaining = delay;
	if (!remaining) {
		remaining = 0;
	};
	var paused = true, timerId, start;

	this.pause = function() {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
		paused = true;
	};

	this.resume = function() {
		if (paused && (remaining >= 0)) {
			paused = false;
			start = new Date();
			timerId = window.setTimeout(callback, remaining);
		};
	};

	this.resume();
}

/**
 * [getOppositePosition Получение противоположной позиции]
 * @param  {[String]} position [Позиция]
 * @return {[String]}          [Позиция, противоположная указанной]
 */
function getOppositePosition(position) {
	switch (position) {
		case "left":
			return "right";
		case "right":
			return "left";
		case "top":
			return "bottom";
		case "bottom":
			return "top";
		default:
			return "left";
	}
};

/**
 * [SingleDanceAnimationElement одиночная анимация]
 * @param {[Object]} animation   [объект анимации]
 * @param {[String]} pathStrings [строковое описание траекторий в формате [позиция: траектория, ...]]
 * @param {[String]} gender      [пол: "man"; "woman"]
 */
function SingleDanceAnimationElement(animation, pathStrings, gender, figure) {
	this.animation = animation;
	this.pathStrings = pathStrings;
	this.gender = gender;
	this.path = {};
	// this.pathFunction = gender === "man" ? this.animation.manPath : this.animation.womanPath;
	if (figure) {
		this.figure = figure;
	} else {
		this.figure = gender === "man" ? this.animation.man : this.animation.woman;
	}
	this.angle = 0;
	this.easing = mina.linear;

	
	/**
	 * [drawPath отрисовка траектории]
	 * @param  {[String]} position [позиция]
	 */
	this.drawPath = function(position, transparent) {
		var pathId = this.gender + "_" + position + "_path";
		this.path = this.animation.path(this.pathStrings[position], this.animation.getGenderColor(this.gender), pathId, transparent);
		this.pathLength = this.path.getTotalLength() - 1;
	};

	/**
	 * [isPathsDrawn Отрисованы ли траектории]
	 */
	this.isPathsDrawn = function() {
		return this.path.type == "path";
	};

	/**
	 * [setAngle Задать относительный угол разворота]
	 * @param {[Number]} value [значение угла]
	 */
	this.setAngle = function(value) {
		this.angle = value;
	};

	/**
	 * [animationFunction инициализация анимации]
	 * @param  {[Number]} lengthMs  [длина в милисекундах]
	 * @param  {[Number]} times     [количество тактов]
	 * @param  {[String]} direction [направление движения]
	 * @param  {[Number]} startPart [позиция начала (0-1 относительно траектории)]
	 * @param  {[Number]} stopPart  [позиция конца (0-1 относительно траектории)]
	 */
	this.animationFunction = function(lengthMs, times, direction, startPart, stopPart) {
		this.animation.animateFigurePath(this.figure, 90 + this.angle, this.path, 
			this.pathLength * startPart, this.pathLength * stopPart, lengthMs, times, direction, this.easing);
	};

	/**
	 * [startAnimation Запуск анимации]
	 * @param  {[Number]} lengthS   [длительность в секундах]
	 * @param  {[Number]} times     [количество тактов]
	 * @param  {[String]} direction [направление движения фигуры]
	 * @param  {[Number]} delay     [задержка в секундах]
	 * @param  {[Number]} startPart [позиция начала (0-1 относительно траектории)]
	 * @param  {[Number]} stopPart  [позиция конца (0-1 относительно траектории)]
	 */
	this.startAnimation = function(lengthS, times, direction, delay, startPart, stopPart) {
		startPart = (typeof startPart === 'undefined') ? 0 : startPart;
		stopPart = (typeof stopPart === 'undefined') ? 1 : stopPart;
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

	/**
	 * [fullAnimation Полный цикл анимации]
	 * @param  {[Number]} lengthS    	[длительность в секундах]
	 * @param  {[Number]} times     	[количество тактов]
	 * @param  {[String]} manPosition   [начальная позиция партнёра]
	 * @param  {[String]} direction 	[направление движения фигуры]
	 * @param  {[Number]} delay     	[задержка в секундах]
	 */
	this.fullAnimation = function(lengthS, times, position, direction, delay, startPart, stopPart) {
		var self = this;
		function fullAnimationFunc() {
			self.animation.clearPaths();
			self.drawPath(position);
			self.startAnimation(lengthS, times, direction, 0, startPart, stopPart);		
		}

		if ((!delay) || (delay <= 0)) {
			fullAnimationFunc();
		} else {
			this.animation.timeouts[this.animation.timeouts.length] = new Timer(fullAnimationFunc, delay * 1000);
		}
	};
}

/**
 * [DanceAnimationElement парная анимация]
 * @param {[Object]} animation   [объект анимации]
 * @param {[Object]} pathStrings [строковое описание траекторий в формате [позиция: траектория, ...]]
 */
function DanceAnimationElement(animation, pathStrings) {
	this.animation = animation;
	this.manDanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings, "man");
	this.womanDanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings, "woman");
	// TODO: Сделать массив с элементами и оперировать циклами, а не отдельными элементами
	/**
	 * [drawPath отрисовка траекторий]
	 * @param  {[String]} manPosition [позиция партнёра]
	 */
	this.drawPath = function(manPosition, transparent) {
		this.animation.manPosition = manPosition;
		this.manDanceAnimationElement.drawPath(manPosition, transparent);
		this.womanDanceAnimationElement.drawPath(getOppositePosition(manPosition), transparent);
	};

	/**
	 * [isPathsDrawn Отрисованы ли траектории]
	 */
	this.isPathsDrawn = function() {
		return (this.manDanceAnimationElement.isPathsDrawn() && this.womanDanceAnimationElement.isPathsDrawn());
	};

	/**
	 * [setAngle Задать относительный угол разворота]
	 * @param {[Number]} value [значение угла]
	 */
	this.setAngle = function(value) {
		this.manDanceAnimationElement.setAngle(value);
		this.womanDanceAnimationElement.setAngle(value);
	};

	/**
	 * [setAngle Задать относительный углов разворота]
	 * @param {[Number]} manValue [значение угла для партнёра]
	 * @param {[Number]} womanValue [значение угла для партнёрши]
	 */
	this.setAngles = function(manValue, womanValue) {
		this.manDanceAnimationElement.setAngle(manValue);
		this.womanDanceAnimationElement.setAngle(womanValue);
	};

	/**
	 * [startAnimation Запуск анимации]
	 * @param  {[Number]} lengthS   [длительность в секундах]
	 * @param  {[Number]} times     [количество тактов]
	 * @param  {[String]} direction [направление движения фигуры]
	 * @param  {[Number]} delay     [задержка в секундах]
	 * @param  {[Number]} startPart [позиция начала (0-1 относительно траектории)]
	 * @param  {[Number]} stopPart  [позиция конца (0-1 относительно траектории)]
	 */
	this.startAnimation = function(lengthS, times, direction, delay, startPart, stopPart) {
		this.manDanceAnimationElement.startAnimation(lengthS, times, direction, delay, startPart, stopPart);
		this.womanDanceAnimationElement.startAnimation(lengthS, times, direction, delay, startPart, stopPart);
	};

	/**
	 * [fullAnimation Полный цикл анимации]
	 * @param  {[Number]} lengthS    	[длительность в секундах]
	 * @param  {[Number]} times     	[количество тактов]
	 * @param  {[String]} manPosition   [начальная позиция партнёра]
	 * @param  {[String]} direction 	[направление движения фигуры]
	 * @param  {[Number]} delay     	[задержка в секундах]
	 */
	this.fullAnimation = function(lengthS, times, manPosition, direction, delay, startPart, stopPart) {

		this.fullAnimationFunc = function() {
			this.animation.clearPaths();
			this.drawPath(manPosition);
			this.startAnimation(lengthS, times, direction, 0, startPart, stopPart);		
		}

		if ((!delay) || (delay <= 0)) {
			this.fullAnimationFunc();
		} else {
			this.animation.timeouts[this.animation.timeouts.length] = new Timer(function(self) {
				return function() {					
					self.fullAnimationFunc();
				};
			}(this), delay * 1000);
		}
	};
}

function DanceAnimation(id) {
	this.svg = Snap("#" + id);

	this.timeouts = [];
	this.animations = [];
	this.paths = [];
	this.paused = false;
	this.manPosition = "left";

	this.MAN_COLOR = "Blue";
	this.WOMAN_COLOR = "DarkMagenta";

	this.DIRECTION_FORWARD = 0;
	this.DIRECTION_BACKWARD = 1;
	this.DIRECTION_STRAIGHT_FORWARD = 2;
	this.DIRECTION_FROM_END_TO_START = 3;
	var self = this;	

	this.clearPaths = function() {
		for (var i = 0; i < this.paths.length; i++) {
			this.paths[i].remove();
		};
		while (this.paths.length > 0) {
			this.paths.pop();
		};

		for (var i = 0; i < this.animations.length; i++) {
			this.animations[i].stop();
		};
		while (this.animations.length > 0) {
			this.animations.pop();
		};
	}

	this.clear = function() {
		this.paused = false;
		this.hideFigures();
		this.clearPaths();
		this.manPosition = "left";

		for (var i = 0; i < this.timeouts.length; i++) {
			this.timeouts[i].pause();
		};
		while (this.timeouts.length > 0) {
			this.timeouts.pop();
		};
	};

	this.restartAnimation = function(animationIndex) {
		animation = this.animations[animationIndex];
		if (!animation.lastValue) {
			animation.lastValue = 0;
		}
		var percentRemain = (animation.end - animation.lastValue) / animation.end;
		var newDur = animation.dur * percentRemain;
		this.animations[animationIndex] = Snap.animate(animation.lastValue, animation.end, 
			animation.set, newDur, animation.easing);
	}

	this.pause = function() {
		this.paused = true;
		for (var i = 0; i < this.timeouts.length; i++) {
			this.timeouts[i].pause();
		};
		for (var i = 0; i < this.animations.length; i++) {
			this.animations[i].pause();
		};
	};

	this.resume = function() {
		if (this.paused) {
			this.paused = false;
			for (var i = 0; i < this.animations.length; i++) {
				this.restartAnimation(i);
			};
			for (var i = 0; i < this.timeouts.length; i++) {
				this.timeouts[i].resume();
			};
		};
	};

	this.getGenderColor = function(gender) {
		return gender === "man" ? this.MAN_COLOR : this.WOMAN_COLOR;
	}

	this.initFigure = function(gender, strokeColor) {
		var figure = this.svg.polyline("0,0 20,40 40,0")
				.attr({
					id: gender + "_figure",
					fill: this.getGenderColor(gender),
					stroke: (strokeColor ? strokeColor : "black"),
					strokeWidth: 2,
					opacity: 0
				});
		figure.strokeColor = strokeColor ? strokeColor : "black";
		return figure;
	};

	this.hideFigures = function() {
		this.man.attr({opacity: 0});
		this.woman.attr({opacity: 0});
	};

	/**
	 * [initManWoman Инициализация фигур партнёра и партнёрши]
	 */
	this.initManWoman = function() {
		if ((!this.man) || (!this.woman)) {
			this.man = this.initFigure("man");
			this.woman = this.initFigure("woman");
		}
	};
	this.initManWoman();

	// Анимация фигур в такт
	this.animateFigureTime = function(self) {
		return 	function(figure, timeLength, times) {
			// Пульсация в такт
			var length = timeLength;
			var oneTimeLength = length / times;
			self.animations[self.animations.length] = Snap.animate(0, length,
				function(value) {
					this.lastValue = value;
					// Дробная часть от деления текущей позиции на длину такта
					var modValue = mod(value, oneTimeLength);
					// Если она достаточно близка к единице, значит сейчас сильная доля
					var isStraightBeat = (modValue > 0.8);
					if (isStraightBeat) {
						figure.attr({
							strokeWidth: 5,
							stroke: "red",
						});
					} else {
						self.defaultFigureLook(figure);
					}
				}, timeLength, mina.linear);
		};
	}(this);

	// Позиционирование фигуры
	this.positionFigure = function(figure, x, y, angle) {
		figure.transform('t' + parseInt(x - 20) + ',' + parseInt(y - 20) + 'r' + parseInt(angle));
	};

	// Сбросить вид фигуры
	this.defaultFigureLook = function(figure) {
		figure.attr({
			strokeWidth: 2,
			stroke: figure.strokeColor,
		});
	};

	// Анимация фигуры по траектории
	this.animateFigurePath = function(self) {
		return 	function(figure, startAngle, path, startLen, stopLen, timeLength, times, direction, easing) {
			var angle = startAngle;
			if ((direction === self.DIRECTION_BACKWARD) || (direction === self.DIRECTION_FROM_END_TO_START)) {
				angle = -angle;
			}

			easing = (typeof easing === 'undefined') ? mina.linear : easing;

			var pathLength = path.getTotalLength();

			function transformAtLength(length) {
				if (length > pathLength) {
					length = length - pathLength;
				}
				movePoint = path.getPointAtLength(length);
				if (direction === self.DIRECTION_STRAIGHT_FORWARD) {
					self.positionFigure(figure, movePoint.x, movePoint.y, angle);
				} else {
					self.positionFigure(figure, movePoint.x, movePoint.y, movePoint.alpha + angle);
				}			
			}

			transformAtLength(startLen);
			figure.attr({opacity: 1});

			self.animations[self.animations.length] = Snap.animate(startLen, stopLen, 
				function(value) {
					this.lastValue = value;
					if (direction === self.DIRECTION_FROM_END_TO_START) {
						value = startLen + stopLen - value;
					}
					transformAtLength(value);
				}, timeLength, easing);

			self.animateFigureTime(figure, timeLength, times);
		};
	}(this);

	this.animateMan = function(self) {
		return function(path, startLen, stopLen, timeLength, times, direction, startAngle) {
			startAngle = (typeof startAngle === 'undefined') ? 90 : startAngle;
			self.animateFigurePath(self.man, startAngle, path, startLen, stopLen, timeLength, times, direction);
		};
	}(this);

	this.animateWoman = function(self) {
		return function(path, startLen, stopLen, timeLength, times, direction, startAngle) {
			startAngle = (typeof startAngle === 'undefined') ? 90 : startAngle;
			self.animateFigurePath(self.woman, startAngle, path, startLen, stopLen, timeLength, times, direction);
		};
	}(this);

	this.path = function(pathStr, color, id, transparent) {
		var resultPath = this.svg.path(pathStr)
				.attr({
					id: id + this.paths.length,
					fill: "none",
					strokeWidth: "3",
					stroke: color,
					strokeMiterLimit: "10",
					strokeDasharray: "9 9",
					opacity: (transparent ? "0" : "1")
				});
		this.paths[this.paths.length] = resultPath;
		return resultPath;
	};
	this.manPath = function(self) {
		return function(pathStr) {
			return self.path(pathStr, self.MAN_COLOR, "manPath");
		};
	}(this);
	this.womanPath = function(self) {
		return function(pathStr) {
			return self.path(pathStr, self.WOMAN_COLOR, "womanPath");
		};
	}(this);

	this.startPosFigure = function(figure, coords) {
		this.positionFigure(figure, coords.x, coords.y, coords.angle);
		this.defaultFigureLook(figure);
		figure.attr({opacity: 1});
	}

	this.startPosition = function(leftCoords, rightCoords, manPosition) {
		this.clearPaths();
		var self = this;

		if (!manPosition) {
			manPosition = this.manPosition;
		}

		if (manPosition === "left") {
			this.startPosFigure(this.man, leftCoords);
			this.startPosFigure(this.woman, rightCoords);
		} else {			
			this.startPosFigure(this.man, rightCoords);
			this.startPosFigure(this.woman, leftCoords);
		}
	}

	this.setAtStart = function(manPosition) {
		this.startPosition(this.startPos.left, this.startPos.right,	manPosition);
	};

	this.getPaths = function(manPosition, leftPath, rightPath) {
		var paths = {};
		if (manPosition === "left") {
			paths.manPath = this.manPath(leftPath);
			paths.womanPath = this.womanPath(rightPath);
		} else {
			paths.manPath = this.manPath(rightPath);
			paths.womanPath = this.womanPath(leftPath);
		}
	}

	// deprecated
	this.commonAnimation = function(seconds, manPosition, leftPath, rightPath, times, direction, dontClear) {
		if (!dontClear) {
			this.clearPaths();
		}
		this.manPosition = manPosition;
		var paths = this.getPaths(manPosition, leftPath, rightPath);
		// this.initManWoman();

		var timeLength = seconds * 1000;

		this.timeouts[this.timeouts.length] = new Timer(function(self) {
			return function() {
				self.animateMan(paths.manPath, 0, paths.manPath.getTotalLength(), timeLength, times, direction);
				self.animateWoman(paths.womanPath, 0, paths.womanPath.getTotalLength(), timeLength, times, direction);
			};
		}(this));	
	};
}

