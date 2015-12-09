/**
 * Объект анимации
 * @param {String} id DOM-идентификатор SVG-объекта
 */
function DanceAnimation(id) {
	this.svg = Snap('#' + id);

	this.timeouts = [];
	this.animations = [];
	this.paths = [];
	this.paused = false;
	this.manPosition = 'left';

	this.MAN_COLOR = 'Blue';
	this.WOMAN_COLOR = 'DarkMagenta';

	this.DIRECTION_FORWARD = 0;
	this.DIRECTION_BACKWARD = 1;
	this.DIRECTION_STRAIGHT_FORWARD = 2;
	this.DIRECTION_FROM_END_TO_START = 3;
	var self = this;	

	this.clearPaths = function () {
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

	this.clear = function () {
		this.paused = false;
		this.hideFigures();
		this.clearPaths();
		this.manPosition = 'left';

		for (var i = 0; i < this.timeouts.length; i++) {
			this.timeouts[i].pause();
		};
		while (this.timeouts.length > 0) {
			this.timeouts.pop();
		};
	};

	this.restartAnimation = function (animationIndex) {
		animation = this.animations[animationIndex];
		if (!animation.lastValue) {
			animation.lastValue = 0;
		}
		var percentRemain = (animation.end - animation.lastValue) / animation.end;
		var newDur = animation.dur * percentRemain;
		this.animations[animationIndex] = Snap.animate(animation.lastValue, animation.end, 
			animation.set, newDur, animation.easing);
	};

	this.pause = function () {
		this.paused = true;
		for (var i = 0; i < this.timeouts.length; i++) {
			this.timeouts[i].pause();
		};
		for (var i = 0; i < this.animations.length; i++) {
			this.animations[i].pause();
		};
	};

	this.resume = function () {
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

	this.getGenderColor = function (gender) {
		return gender === 'man' ? this.MAN_COLOR : this.WOMAN_COLOR;
	};

	/**
	 * Создание фигуры танцора
	 * @param  {String} gender Пол
	 * @return {Object}        Polyline-объект танцора
	 */
	this.initFigure = function (gender) {
		var figure = this.svg.polyline('0,0 20,40 40,0')
				.attr({
					id: gender + '_figure'
				})
				.addClass('invisible')
				.addClass('figure')
				.addClass(gender === 'man' ? 'manFigure' : 'womanFigure');
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
	this.initRotateIcon = function (x, y, angle, clockwise) {
		if (clockwise) {
			var arrows = this.svg.path('m -15.9,-19.4 c 0.4,1.6 -2.4,2.7 -3.2,4.3 -7.8,9.5 -6.7,24.8 2.6,33 2.5,2.3 5.5,4 8.7,5.2 0.5,-1.9 1.9,-4.2 -0.9,-4.5 C -18.8,14.2 -23.5,1 -18.4,-8.9 c 1.1,-2.4 2.8,-4.5 4.7,-6.3 1.3,1.6 3,7.9 4,6.4 1.4,-4.2 2.7,-8.3 4,-12.5 -4.3,-1.1 -8.6,-2.3 -13,-3.4 0.9,1.8 1.8,3.6 2.7,5.3 z m 22.7,0 C 17.4,-16 23.4,-3.1 19.2,7.2 18.1,10.3 16.2,12.9 13.9,15.2 12.5,13.6 10.9,7.3 9.8,8.8 8.4,13 7,17.1 5.7,21.3 c 4.3,1.1 8.6,2.3 13,3.4 -0.4,-2.3 -4.4,-5.3 -1.9,-7 9.4,-8.5 10.2,-24.4 1.5,-33.8 -2.8,-3.2 -6.5,-5.6 -10.5,-6.9 -0.4,1.2 -0.7,2.5 -1,3.7 z');
		} else {
			var arrows = this.svg.path('m -15.9,19.4 c 0.4,-1.6 -2.4,-2.7 -3.2,-4.3 -7.8,-9.5 -6.7,-24.8 2.6,-33 2.5,-2.3 5.5,-4 8.7,-5.2 0.5,1.9 1.9,4.2 -0.9,4.5 -10.2,4.4 -14.9,17.6 -9.8,27.5 1.1,2.4 2.8,4.5 4.7,6.3 1.3,-1.6 3,-7.9 4,-6.4 1.4,4.2 2.7,8.3 4,12.5 -4.3,1.1 -8.6,2.3 -13,3.4 0.9,-1.8 1.8,-3.6 2.7,-5.3 z M 6.8,19.4 C 17.4,16 23.4,3.1 19.2,-7.2 c -1.1,-3 -3,-5.7 -5.4,-8 -1.3,1.6 -3,7.9 -4,6.4 -1.4,-4.2 -2.7,-8.3 -4,-12.5 4.3,-1.1 8.6,-2.3 13,-3.4 -0.4,2.3 -4.4,5.3 -1.9,7 9.4,8.5 10.2,24.4 1.5,33.8 -2.8,3.2 -6.5,5.6 -10.5,6.9 -0.4,-1.2 -0.7,-2.5 -1,-3.7 z');
		}
		arrows.addClass('rotationArrows')
				.transform('t' + Math.floor(x) + ',' + Math.floor(y) + 'r' + Math.floor(angle));
		this.paths[this.paths.length] = arrows;
		return arrows;
	};

	/**
	 * Спрятать фигурки танцоров
	 */
	this.hideFigures = function () {
		this.man.addClass('invisible');
		this.woman.addClass('invisible');
	};

	/**
	 * Инициализация фигур партнёра и партнёрши
	 */
	this.initManWoman = function () {
		if ((!this.man) || (!this.woman)) {
			this.man = this.initFigure('man');
			this.woman = this.initFigure('woman');
		}
	};
	this.initManWoman();

	/**
	 * Анимация фигур в такт
	 * @param  {Object} self Указатель на объект анимации
	 */
	this.animateFigureTime = function (self) {
		return function (figure, timeLength, times) {
			// Пульсация в такт
			var length = timeLength;
			var oneTimeLength = length / times;
			self.animations[self.animations.length] = Snap.animate(0, length,
				function (value) {
					this.lastValue = value;
					// Если дробная часть от деления текущей позиции на длину такта достаточно близка к единице, значит сейчас сильная доля
					if (mod(value, oneTimeLength) > 0.8) {
						figure.addClass('straightBeatFigure');
					} else {
						figure.removeClass('straightBeatFigure');
					}
				}, timeLength, mina.linear);
		};
	}(this);

	/**
	 * Позиционирование фигуры
	 * @param  {Object} figure Объект фигуры танцора
	 * @param  {Number} x      Координата центра X
	 * @param  {Number} y      Координата центра Y
	 * @param  {Number} angle  Угол поворота (при 0 фигура стоит вертикально)
	 */
	this.positionFigure = function (figure, x, y, angle) {
		figure.transform('t' + Math.floor(x - 20) + ',' + Math.floor(y - 20) + 'r' + Math.floor(angle));
	};

	/**
	 * Анимация фигуры по траектории
	 * @param  {Object} self Указатель на объект анимации
	 * @return {Function}    Функция инициализации анимации
	 */
	this.animateFigurePath = function (self) {
		/**
		 * Функция инициализации анимации
		 * @param  {Object} figure     Фигура танцора для анимации
		 * @param  {Number} startAngle Угол наклона фигуры относительно траектории
		 * @param  {Object} path       Path-объект траектории движения
		 * @param  {Number} startLen   Позиция начала движения от начала траектории
		 * @param  {Number} stopLen    Позиция конца движения от начала траектории
		 * @param  {Number} timeLength Время движения (мс)
		 * @param  {Number} times      Количество тактов
		 * @param  {Number} direction  Константа, определяющая направление движения
		 * @param  {[type]} easing     Snap mina easing - объект, определяющий характер движения (линейный по-умолчанию)
		 */
		return function (figure, startAngle, path, startLen, stopLen, timeLength, times, direction, easing) {
			var angle = startAngle;
			if ((direction === self.DIRECTION_BACKWARD) || (direction === self.DIRECTION_FROM_END_TO_START)) {
				angle = -angle;
			}

			easing = ( typeof easing === 'undefined') ? mina.linear : easing;

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
			figure.removeClass('invisible');

			self.animations[self.animations.length] = Snap.animate(startLen, stopLen, 
				function (value) {
					this.lastValue = value;
					if (direction === self.DIRECTION_FROM_END_TO_START) {
						value = startLen + stopLen - value;
					}
					transformAtLength(value);
				}, timeLength, easing);

			self.animateFigureTime(figure, timeLength, times);
		};
	}(this);

	/**
	 * Анимация мужской фигуры по траектории
	 * @param  {Object} self Указатель на объект анимации
	 * @return {Function}    Функция инициализации анимации
	 */
	this.animateMan = function (self) {
		return function (path, startLen, stopLen, timeLength, times, direction, startAngle) {
			startAngle = ( typeof startAngle === 'undefined') ? 90 : startAngle;
			self.animateFigurePath(self.man, startAngle, path, startLen, stopLen, timeLength, times, direction);
		};
	}(this);

	/**
	 * Анимация женской фигуры по траектории
	 * @param  {Object} self Указатель на объект анимации
	 * @return {Function}    Функция инициализации анимации
	 */
	this.animateWoman = function (self) {
		return function (path, startLen, stopLen, timeLength, times, direction, startAngle) {
			startAngle = ( typeof startAngle === 'undefined') ? 90 : startAngle;
			self.animateFigurePath(self.woman, startAngle, path, startLen, stopLen, timeLength, times, direction);
		};
	}(this);

	/**
	 * Создание Path-объекта траектории
	 * @param  {String} pathStr      Описание траектории в формате SVG path
	 * @param  {String} gender       Пол
	 * @param  {Boolean} hidden      Создать невидимым
	 * @return {Object}              Path-объект траектории
	 */
	this.path = function (pathStr, gender, hidden) {
		var resultPath = this.svg.path(pathStr)
				.attr({
					id: gender + '_path_' + this.paths.length
				})
				.addClass('path');
		if (hidden) {
			resultPath.addClass('invisible');
		}
		if (gender === 'man') {
			resultPath.addClass('manPath');
		} else if (gender === 'woman') {
			resultPath.addClass('womanPath');
		}
		this.paths[this.paths.length] = resultPath;
		return resultPath;
	};
	this.manPath = function (self) {
		return function (pathStr) {
			return self.path(pathStr, 'man');
		};
	}(this);
	this.womanPath = function (self) {
		return function (pathStr) {
			return self.path(pathStr, 'woman');
		};
	}(this);

	/**
	 * Установить фигуру танцора на определённую позицию
	 * @param  {Object} figure Объект фигуры танцора
	 * @param  {Object} coords Объект с описанием координат {x, y, angle}
	 */
	this.startPosFigure = function (figure, coords) {
		this.positionFigure(figure, coords.x, coords.y, coords.angle);
		figure.removeClass('straightBeatFigure');
		figure.removeClass('invisible');
	};

	/**
	 * Установить фигуры танцоров на определённые позиции
	 * @param  {Object} leftCoords  Объект с описанием координат левой позиции {x, y, angle}
	 * @param  {Object} rightCoords Объект с описанием координат правой позиции {x, y, angle}
	 * @param  {String} manPosition Позиция партнёра
	 */
	this.startPosition = function (leftCoords, rightCoords, manPosition) {
		this.clearPaths();
		var self = this;

		if (!manPosition) {
			manPosition = this.manPosition;
		}

		if (manPosition === 'left') {
			this.startPosFigure(this.man, leftCoords);
			this.startPosFigure(this.woman, rightCoords);
		} else {			
			this.startPosFigure(this.man, rightCoords);
			this.startPosFigure(this.woman, leftCoords);
		}
	};

	/**
	 * Установить фигуры танцоров на начальные позиции
	 * @param {String} manPosition Позиция партнёра
	 */
	this.setAtStart = function (manPosition) {
		this.startPosition(this.startPos.left, this.startPos.right,	manPosition);
	};
}

