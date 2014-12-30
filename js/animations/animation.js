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


	this.initRotateIcon = function(x, y, angle, clockwise) {
		if (clockwise) {
			var arrows = this.svg.path("m -15.892775,-19.395049 c 0.374359,1.649196 -2.428263,2.731402 -3.194226,4.338712 -7.844419,9.4608913 -6.717016,24.8370798 2.594334,32.993223 2.458837,2.304069 5.494359,4.062497 8.7304617,5.179634 0.5380826,-1.922545 1.9239432,-4.178102 -0.8576945,-4.484428 C -18.790021,14.215505 -23.504697,0.98401759 -18.435101,-8.8971601 c 1.149476,-2.3740859 2.784326,-4.4571359 4.653519,-6.3142889 1.333101,1.629325 2.994561,7.8944747 4.0764104,6.4472951 1.3570609,-4.1720271 2.7141219,-8.3440561 4.0711828,-12.5160861 -4.321309,-1.14663 -8.6426192,-2.293261 -12.9639272,-3.43989 0.901713,1.775027 1.803429,3.550055 2.705141,5.325081 z m 22.6693946,0.02424 C 17.430911,-16.015386 23.446344,-3.1256099 19.221519,7.2425936 18.102363,10.29431 16.163297,12.944009 13.862469,15.217985 12.532065,13.594647 10.860629,7.3303496 9.7806926,8.7855538 8.4254216,12.95263 7.0701506,17.119703 5.7148796,21.286777 c 4.3213084,1.146631 8.6426154,2.293259 12.9639244,3.43989 -0.419638,-2.32223 -4.401948,-5.284811 -1.896933,-7.083396 9.454967,-8.5062128 10.224694,-24.4417034 1.523415,-33.800636 -2.782387,-3.187097 -6.475371,-5.564771 -10.4718894,-6.930672 -0.354122,1.214132 -0.708244,2.478855 -1.062366,3.718282 z");
		} else {
			var arrows = this.svg.path("m -15.892775,19.401586 c 0.374359,-1.649196 -2.428263,-2.731402 -3.194226,-4.338712 -7.844419,-9.4608913 -6.717016,-24.8370798 2.594334,-32.993223 2.458837,-2.304069 5.494359,-4.062497 8.7304617,-5.179634 0.5380826,1.922545 1.9239432,4.178102 -0.8576945,4.484428 -10.1701212,4.416587 -14.8847972,17.64807441 -9.8152012,27.5292521 1.149476,2.3740859 2.784326,4.4571359 4.653519,6.3142889 1.333101,-1.629325 2.994561,-7.8944747 4.0764104,-6.4472951 1.3570609,4.1720271 2.7141219,8.3440561 4.0711828,12.5160861 -4.321309,1.14663 -8.6426192,2.293261 -12.9639272,3.43989 0.901713,-1.775027 1.803429,-3.550055 2.705141,-5.325081 z M 6.7766196,19.377346 C 17.430911,16.021923 23.446344,3.1321469 19.221519,-7.2360566 c -1.119156,-3.0517164 -3.058222,-5.7014154 -5.35905,-7.9753914 -1.330404,1.623338 -3.00184,7.8876354 -4.0817764,6.4324312 -1.355271,-4.1670762 -2.710542,-8.3341492 -4.065813,-12.5012232 4.3213084,-1.146631 8.6426154,-2.293259 12.9639244,-3.43989 -0.419638,2.32223 -4.401948,5.284811 -1.896933,7.083396 9.454967,8.5062128 10.224694,24.4417034 1.523415,33.800636 -2.782387,3.187097 -6.475371,5.564771 -10.4718894,6.930672 -0.354122,-1.214132 -0.708244,-2.478855 -1.062366,-3.718282 z");
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

