function extend(Child, Parent) {
	var F = function() { }
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

/**
 * Таймер
 * @param {Function} callback Функция
 * @param {Number}   delay    Задержка в мс
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
 * Получение противоположной позиции
 * @param  {String} position Позиция
 * @return {String}          Позиция, противоположная указанной
 */
function getOppositePosition(position) {
	switch (position) {
		case "start_left":
			return "start_right";
		case "start_right":
			return "start_left";
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
 * Одиночная анимация
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {String} gender      Пол: "man"; "woman"
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
	 * Отрисовка траектории
	 * @param  {String} position Позиция
	 */
	this.drawPath = function(position, transparent) {
		var pathId = this.gender + "_" + position + "_path";
		this.path = this.animation.path(this.pathStrings[position], this.gender, pathId, transparent);
		this.pathLength = this.path.getTotalLength() - 1;
	};

	/**
	 * Отрисованы ли траектории
	 */
	this.isPathsDrawn = function() {
		return this.path.type == "path";
	};

	/**
	 * Задать относительный угол разворота
	 * @param {Number} value Значение угла
	 */
	this.setAngle = function(value) {
		this.angle = value;
	};

	/**
	 * Инициализация анимации
	 * @param  {Number} lengthMs  Длина в милисекундах
	 * @param  {Number} times     Количество тактов
	 * @param  {String} direction Направление движения
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
	 */
	this.animationFunction = function(lengthMs, times, direction, startPart, stopPart) {
		this.animation.animateFigurePath(this.figure, 90 + this.angle, this.path, 
			this.pathLength * startPart, this.pathLength * stopPart, lengthMs, times, direction, this.easing);
	};

	/**
	 * Запуск анимации
	 * @param  {Number} lengthS   Длительность в секундах
	 * @param  {Number} times     Количество тактов
	 * @param  {String} direction Направление движения фигуры
	 * @param  {Number} delay     Задержка в секундах
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
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
	 * @param  {Number} lengthS    	[длительность в секундах]
	 * @param  {Number} times     	[количество тактов]
	 * @param  {String} manPosition   [начальная позиция партнёра]
	 * @param  {String} direction 	[направление движения фигуры]
	 * @param  {Number} delay     	[задержка в секундах]
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
 * Парная анимация
 * @param {Object} animation   Объект анимации
 * @param {Object} pathStrings Строковое описание траекторий в формате позиция: траектория, ...
 */
function DanceAnimationElement(animation, pathStrings) {
	this.animation = animation;
	this.manDanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings, "man");
	this.womanDanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings, "woman");
	// TODO: Сделать массив с элементами и оперировать циклами, а не отдельными элементами
	/**
	 * Отрисовка траекторий
	 * @param  {String} manPosition Позиция партнёра
	 */
	this.drawPath = function(manPosition, transparent) {
		this.animation.manPosition = manPosition;
		this.manDanceAnimationElement.drawPath(manPosition, transparent);
		this.womanDanceAnimationElement.drawPath(getOppositePosition(manPosition), transparent);
	};

	/**
	 * Отрисованы ли траектории
	 */
	this.isPathsDrawn = function() {
		return (this.manDanceAnimationElement.isPathsDrawn() && this.womanDanceAnimationElement.isPathsDrawn());
	};

	/**
	 * Задать относительный угол разворота
	 * @param {Number} value Значение угла
	 */
	this.setAngle = function(value) {
		this.manDanceAnimationElement.setAngle(value);
		this.womanDanceAnimationElement.setAngle(value);
	};

	/**
	 * Задать относительный углов разворота
	 * @param {Number} manValue   Значение угла для партнёра
	 * @param {Number} womanValue Значение угла для партнёрши
	 */
	this.setAngles = function(manValue, womanValue) {
		this.manDanceAnimationElement.setAngle(manValue);
		this.womanDanceAnimationElement.setAngle(womanValue);
	};

	/**
	 * Запуск анимации
	 * @param  {Number} lengthS   Длительность в секундах
	 * @param  {Number} times     Количество тактов
	 * @param  {String} direction Направление движения фигуры
	 * @param  {Number} delay     Задержка в секундах
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
	 */
	this.startAnimation = function(lengthS, times, direction, delay, startPart, stopPart) {
		this.manDanceAnimationElement.startAnimation(lengthS, times, direction, delay, startPart, stopPart);
		this.womanDanceAnimationElement.startAnimation(lengthS, times, direction, delay, startPart, stopPart);
	};

	/**
	 * Полный цикл анимации
	 * @param  {Number} lengthS    	Длительность в секундах
	 * @param  {Number} times     	Количество тактов
	 * @param  {String} manPosition Начальная позиция партнёра
	 * @param  {String} direction 	Направление движения фигуры
	 * @param  {Number} delay     	Задержка в секундах
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

/**
 * Продвижение с вращением
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {String} gender      Пол: "man"; "woman"
 * @param {Object} figure      Объект фигуры анимации
 * @param {Number} rotateAngle Угол поворота
 */
function RotateElement(animation, pathStrings, gender, figure, rotateAngle) {
	RotateElement.superclass.constructor.apply(this, arguments);

	this.rotateAngle = rotateAngle;

	this.animationFunction = function(lengthMs, times) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		this.animation.animateFigureTime(this.figure, lengthMs, times * 6);
	}

	this.startAnimation = function(lengthS, times, startAngle, direction, delay, startPart, stopPart) {
		startPart = (typeof startPart === 'undefined') ? 0 : startPart;
		stopPart = (typeof stopPart === 'undefined') ? 1 : stopPart;
		var self = this;
		function startAnimationFunc() {
			var angle = startAngle;
			var startLen = self.pathLength * startPart;
			var stopLen = self.pathLength * stopPart;
			var angleSpeed = rotateAngle / (stopLen - startLen);

			function transformAtLength(length) {
				movePoint = self.path.getPointAtLength(length);
				self.animation.positionFigure(self.figure, movePoint.x, movePoint.y, angle - angleSpeed * (length - startLen));
			}

			transformAtLength(startLen);
			self.figure.removeClass("invisible");

			self.animation.animations[self.animation.animations.length] = Snap.animate(startLen, stopLen, 
				function(value) {
					this.lastValue = value;
					transformAtLength(value);
				}, lengthS * 1000, mina.linear);

			self.animation.animateFigureTime(self.figure, lengthS * 1000, times);		
		}

		if ((!delay) || (delay <= 0)) {
			startAnimationFunc();		
		} else {
			this.animation.timeouts[this.animation.timeouts.length] = new Timer(startAnimationFunc, delay * 1000);
		}
	};
}
extend(RotateElement, SingleDanceAnimationElement);

/**
 * Парная анимация для продвижения с вращением
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {Number} rotateAngle Угол поворота
 */
function RotateDanceAnimationElement(animation, pathStrings, rotateAngle) {
	RotateDanceAnimationElement.superclass.constructor.apply(this, arguments);
	this.manDanceAnimationElement = new RotateElement(animation, pathStrings, "man", undefined, rotateAngle);
	this.womanDanceAnimationElement = new RotateElement(animation, pathStrings, "woman", undefined, rotateAngle);

	this.startAnimation = function(lengthS, times, startAngleMan, startAngleWoman, direction, delay, startPart, stopPart) {
		this.manDanceAnimationElement.startAnimation(lengthS, times, startAngleMan, direction, delay, startPart, stopPart);
		this.womanDanceAnimationElement.startAnimation(lengthS, times, startAngleWoman, direction, delay, startPart, stopPart);
	};

	this.fullAnimation = function(lengthS, times, startAngleMan, startAngleWoman, manPosition, direction, delay, startPart, stopPart) {

		this.fullAnimationFunc = function() {
			this.animation.clearPaths();
			this.drawPath(manPosition);
			this.startAnimation(lengthS, times, startAngleMan, startAngleWoman, direction, 0, startPart, stopPart);		
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
extend(RotateDanceAnimationElement, DanceAnimationElement);

/**
 * Объект анимации
 * @param {String} id DOM-идентификатор SVG-объекта
 */
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
	};

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

	/**
	 * Создание фигуры танцора
	 * @param  {String} gender Пол
	 * @return {Object}        Polyline-объект танцора
	 */
	this.initFigure = function(gender) {
		var figure = this.svg.polyline("0,0 20,40 40,0")
				.attr({
					id: gender + "_figure"
				})
				.addClass("invisible")
				.addClass("figure")
				.addClass(gender === "man" ? "manFigure" : "womanFigure");
		return figure;
	};

	/**
	 * Создание иконки вращения
	 * @param  {Number} x          Координата центра X
	 * @param  {Number} y          Координата центра Y
	 * @param  {Number} angle      Угол поворота (при 0 позиция стрелок вертикальна)
	 * @param  {Boolean} clockwise По часовой стрелке
	 * @return {Object}            Path-объект иконки
	 */
	this.initRotateIcon = function(x, y, angle, clockwise) {
		if (clockwise) {
			var arrows = this.svg.path("m -15.9,-19.4 c 0.4,1.6 -2.4,2.7 -3.2,4.3 -7.8,9.5 -6.7,24.8 2.6,33 2.5,2.3 5.5,4 8.7,5.2 0.5,-1.9 1.9,-4.2 -0.9,-4.5 C -18.8,14.2 -23.5,1 -18.4,-8.9 c 1.1,-2.4 2.8,-4.5 4.7,-6.3 1.3,1.6 3,7.9 4,6.4 1.4,-4.2 2.7,-8.3 4,-12.5 -4.3,-1.1 -8.6,-2.3 -13,-3.4 0.9,1.8 1.8,3.6 2.7,5.3 z m 22.7,0 C 17.4,-16 23.4,-3.1 19.2,7.2 18.1,10.3 16.2,12.9 13.9,15.2 12.5,13.6 10.9,7.3 9.8,8.8 8.4,13 7,17.1 5.7,21.3 c 4.3,1.1 8.6,2.3 13,3.4 -0.4,-2.3 -4.4,-5.3 -1.9,-7 9.4,-8.5 10.2,-24.4 1.5,-33.8 -2.8,-3.2 -6.5,-5.6 -10.5,-6.9 -0.4,1.2 -0.7,2.5 -1,3.7 z");
		} else {
			var arrows = this.svg.path("m -15.9,19.4 c 0.4,-1.6 -2.4,-2.7 -3.2,-4.3 -7.8,-9.5 -6.7,-24.8 2.6,-33 2.5,-2.3 5.5,-4 8.7,-5.2 0.5,1.9 1.9,4.2 -0.9,4.5 -10.2,4.4 -14.9,17.6 -9.8,27.5 1.1,2.4 2.8,4.5 4.7,6.3 1.3,-1.6 3,-7.9 4,-6.4 1.4,4.2 2.7,8.3 4,12.5 -4.3,1.1 -8.6,2.3 -13,3.4 0.9,-1.8 1.8,-3.6 2.7,-5.3 z M 6.8,19.4 C 17.4,16 23.4,3.1 19.2,-7.2 c -1.1,-3 -3,-5.7 -5.4,-8 -1.3,1.6 -3,7.9 -4,6.4 -1.4,-4.2 -2.7,-8.3 -4,-12.5 4.3,-1.1 8.6,-2.3 13,-3.4 -0.4,2.3 -4.4,5.3 -1.9,7 9.4,8.5 10.2,24.4 1.5,33.8 -2.8,3.2 -6.5,5.6 -10.5,6.9 -0.4,-1.2 -0.7,-2.5 -1,-3.7 z");
		}
		arrows.addClass("rotationArrows")
				.transform('t' + Math.floor(x) + ',' + Math.floor(y) + 'r' + Math.floor(angle));
		this.paths[this.paths.length] = arrows;
		return arrows;
	}

	this.hideFigures = function() {
		this.man.addClass("invisible");
		this.woman.addClass("invisible");
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

	/**
	 * Анимация фигур в такт
	 * @param  {Object} self Указатель на объект анимации
	 */
	this.animateFigureTime = function(self) {
		return 	function(figure, timeLength, times) {
			// Пульсация в такт
			var length = timeLength;
			var oneTimeLength = length / times;
			self.animations[self.animations.length] = Snap.animate(0, length,
				function(value) {
					this.lastValue = value;
					// Если дробная часть от деления текущей позиции на длину такта достаточно близка к единице, значит сейчас сильная доля
					if (mod(value, oneTimeLength) > 0.8) {
						figure.addClass("straightBeatFigure");
					} else {
						figure.removeClass("straightBeatFigure");
					}
				}, timeLength, mina.linear);
		};
	}(this);

	// Позиционирование фигуры
	this.positionFigure = function(figure, x, y, angle) {
		figure.transform('t' + Math.floor(x - 20) + ',' + Math.floor(y - 20) + 'r' + Math.floor(angle));
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
				var movePoint = path.getPointAtLength(length);
				if (direction === self.DIRECTION_STRAIGHT_FORWARD) {
					self.positionFigure(figure, movePoint.x, movePoint.y, angle);
				} else {
					self.positionFigure(figure, movePoint.x, movePoint.y, movePoint.alpha + angle);
				}			
			}

			transformAtLength(startLen);
			figure.removeClass("invisible");

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

	this.path = function(pathStr, gender, id, transparent) {
		var resultPath = this.svg.path(pathStr)
				.attr({
					id: gender + "_path_" + this.paths.length
				})
				.addClass("path");
		if (transparent) {
			resultPath.addClass("invisible");
		}
		if (gender === "man") {
			resultPath.addClass("manPath");
		} else if (gender === "woman") {
			resultPath.addClass("womanPath");
		}
		this.paths[this.paths.length] = resultPath;
		return resultPath;
	};
	this.manPath = function(self) {
		return function(pathStr) {
			return self.path(pathStr, "man");
		};
	}(this);
	this.womanPath = function(self) {
		return function(pathStr) {
			return self.path(pathStr, "woman");
		};
	}(this);

	this.startPosFigure = function(figure, coords) {
		this.positionFigure(figure, coords.x, coords.y, coords.angle);
		figure.removeClass("straightBeatFigure");
		figure.removeClass("invisible");
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
}

