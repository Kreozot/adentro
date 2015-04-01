
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
	 * @param  {Boolean} hidden  Создать скрытой
	 */
	this.drawPath = function(position, hidden) {
		this.path = this.animation.path(this.pathStrings[position], this.gender, hidden);
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