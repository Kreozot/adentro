require('../../../styles/animation.css');
import {mod} from './utils.js';

/**
 * Объект анимации
 * @param {String} id DOM-идентификатор SVG-объекта
 */
export default class DanceAnimation {
	constructor(id) {
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
		this.initManWoman();
	}

	clearPaths() {
		this.paths.forEach(path => path.remove());
		while (this.paths.length > 0) {
			this.paths.pop();
		};

		this.animations.forEach(animation => animation.stop());
		while (this.animations.length > 0) {
			this.animations.pop();
		};
	}

	clear() {
		this.paused = false;
		this.hideFigures();
		this.clearPaths();
		this.manPosition = 'left';

		this.timeouts.forEach(timeout => timeout.pause());
		while (this.timeouts.length > 0) {
			this.timeouts.pop();
		};
	}

	restartAnimation(animation) {
		if (!animation.lastValue) {
			animation.lastValue = 0;
		}
		const percentRemain = (animation.end - animation.lastValue) / animation.end;
		const newDur = animation.dur * percentRemain;
		this.animations[animationIndex] = Snap.animate(animation.lastValue, animation.end,
			animation.set, newDur, animation.easing);
	}

	pause() {
		this.paused = true;
		this.timeouts.forEach(timeout => timeout.pause());
		this.animations.forEach(animation => animation.pause());
	}

	resume() {
		if (this.paused) {
			this.paused = false;
			this.animations.forEach(animation => this.restartAnimation(animation));
			this.timeouts.forEach(timeout => timeout.resume());
		};
	}

	getGenderColor(gender) {
		return gender === 'man' ? this.MAN_COLOR : this.WOMAN_COLOR;
	}

	/**
	 * Создание фигуры танцора
	 * @param  {String} gender Пол
	 * @return {Object}        Polyline-объект танцора
	 */
	initFigure(gender) {
		return this.svg.polyline('0,0 20,40 40,0')
			.attr({
				id: gender + '_figure'
			})
			.addClass('invisible')
			.addClass('figure')
			.addClass(gender === 'man' ? 'manFigure' : 'womanFigure');
	}

	/**
	 * Создание иконки вращения
	 * @param  {Number} x          Координата центра X
	 * @param  {Number} y          Координата центра Y
	 * @param  {Number} angle      Угол поворота (при 0 позиция стрелок вертикальна)
	 * @param  {Boolean} clockwise По часовой стрелке
	 * @return {Object}            Path-объект иконки
	 */
	initRotateIcon(x, y, angle, clockwise) {
		const arrows = this.svg.path(clockwise
			? 'm -15.9,-19.4 c 0.4,1.6 -2.4,2.7 -3.2,4.3 -7.8,9.5 -6.7,24.8 2.6,33 2.5,2.3 5.5,4 8.7,5.2 0.5,-1.9 1.9,-4.2 -0.9,-4.5 C -18.8,14.2 -23.5,1 -18.4,-8.9 c 1.1,-2.4 2.8,-4.5 4.7,-6.3 1.3,1.6 3,7.9 4,6.4 1.4,-4.2 2.7,-8.3 4,-12.5 -4.3,-1.1 -8.6,-2.3 -13,-3.4 0.9,1.8 1.8,3.6 2.7,5.3 z m 22.7,0 C 17.4,-16 23.4,-3.1 19.2,7.2 18.1,10.3 16.2,12.9 13.9,15.2 12.5,13.6 10.9,7.3 9.8,8.8 8.4,13 7,17.1 5.7,21.3 c 4.3,1.1 8.6,2.3 13,3.4 -0.4,-2.3 -4.4,-5.3 -1.9,-7 9.4,-8.5 10.2,-24.4 1.5,-33.8 -2.8,-3.2 -6.5,-5.6 -10.5,-6.9 -0.4,1.2 -0.7,2.5 -1,3.7 z'
			: 'm -15.9,19.4 c 0.4,-1.6 -2.4,-2.7 -3.2,-4.3 -7.8,-9.5 -6.7,-24.8 2.6,-33 2.5,-2.3 5.5,-4 8.7,-5.2 0.5,1.9 1.9,4.2 -0.9,4.5 -10.2,4.4 -14.9,17.6 -9.8,27.5 1.1,2.4 2.8,4.5 4.7,6.3 1.3,-1.6 3,-7.9 4,-6.4 1.4,4.2 2.7,8.3 4,12.5 -4.3,1.1 -8.6,2.3 -13,3.4 0.9,-1.8 1.8,-3.6 2.7,-5.3 z M 6.8,19.4 C 17.4,16 23.4,3.1 19.2,-7.2 c -1.1,-3 -3,-5.7 -5.4,-8 -1.3,1.6 -3,7.9 -4,6.4 -1.4,-4.2 -2.7,-8.3 -4,-12.5 4.3,-1.1 8.6,-2.3 13,-3.4 -0.4,2.3 -4.4,5.3 -1.9,7 9.4,8.5 10.2,24.4 1.5,33.8 -2.8,3.2 -6.5,5.6 -10.5,6.9 -0.4,-1.2 -0.7,-2.5 -1,-3.7 z');
		arrows.addClass('rotationArrows')
				.transform(`t${x},${y}r${angle}`);
				// .transform('t' + Math.floor(x) + ',' + Math.floor(y) + 'r' + Math.floor(angle));
				// TODO: Сравнить производительность
		this.paths[this.paths.length] = arrows;
		return arrows;
	}

	/**
	 * Спрятать фигурки танцоров
	 */
	hideFigures() {
		this.man.addClass('invisible');
		this.woman.addClass('invisible');
	}

	/**
	 * Инициализация фигур партнёра и партнёрши
	 */
	initManWoman() {
		if ((!this.man) || (!this.woman)) {
			this.man = this.initFigure('man');
			this.woman = this.initFigure('woman');
		}
	}

	/**
	 * Анимация фигур в такт
	 */
	animateFigureTime(figure, timeLength, beats) {
		// Пульсация в такт
		const length = timeLength;
		const oneTimeLength = length / beats;
		this.animations[this.animations.length] = Snap.animate(0, length,
			function (value) { //this - animation element
				this.lastValue = value;
				// Если дробная часть от деления текущей позиции на длину такта достаточно близка к единице, значит сейчас сильная доля
				if (mod(value, oneTimeLength) > 0.8) {
					figure.addClass('straightBeatFigure');
				} else {
					figure.removeClass('straightBeatFigure');
				}
			}, timeLength, mina.linear);
	}

	/**
	 * Позиционирование фигуры
	 * @param  {Object} figure Объект фигуры танцора
	 * @param  {Number} x      Координата центра X
	 * @param  {Number} y      Координата центра Y
	 * @param  {Number} angle  Угол поворота (при 0 фигура стоит вертикально)
	 */
	positionFigure(figure, x, y, angle) {
		figure.transform(`t${x - 20},${y - 20}r${angle}`);
		// figure.transform('t' + Math.floor(x - 20) + ',' + Math.floor(y - 20) + 'r' + Math.floor(angle));
		// TODO: Сравнить проивзодительность
	}

	/**
	 * Анимация фигуры по траектории
	 * @param  {Object} figure     Фигура танцора для анимации
	 * @param  {Number} startAngle Угол наклона фигуры относительно траектории
	 * @param  {Object} path       Path-объект траектории движения
	 * @param  {Number} startLen   Позиция начала движения от начала траектории
	 * @param  {Number} stopLen    Позиция конца движения от начала траектории
	 * @param  {Number} timeLength Время движения (мс)
	 * @param  {Number} beats      Количество тактов
	 * @param  {Number} direction  Константа, определяющая направление движения
	 * @param  {[type]} easing     Snap mina easing - объект, определяющий характер движения (линейный по-умолчанию)
	 */
	animateFigurePath(figure, startAngle, path, startLen, stopLen, timeLength, beats, direction = this.DIRECTION_FORWARD, easing = mina.linear) {
		let angle = startAngle;
		if ((direction === this.DIRECTION_BACKWARD) || (direction === this.DIRECTION_FROM_END_TO_START)) {
			angle = -angle;
		}

		const pathLength = path.getTotalLength();

		const transformAtLength = length => {
			if (length > pathLength) {
				length = length - pathLength;
			}
			const movePoint = path.getPointAtLength(length);
			if (direction === this.DIRECTION_STRAIGHT_FORWARD) {
				this.positionFigure(figure, movePoint.x, movePoint.y, angle);
			} else {
				this.positionFigure(figure, movePoint.x, movePoint.y, movePoint.alpha + angle);
			}
		};

		transformAtLength(startLen);
		figure.removeClass('invisible');

		this.animations[this.animations.length] = Snap.animate(startLen, stopLen,
			function (value) { //this - animation element
				this.lastValue = value;
				if (direction === this.DIRECTION_FROM_END_TO_START) {
					value = startLen + stopLen - value;
				}
				transformAtLength(value);
			}, timeLength, easing);

		this.animateFigureTime(figure, timeLength, beats);
	}

	/**
	 * Анимация мужской фигуры по траектории
	 */
	animateMan(path, startLen, stopLen, timeLength, beats, direction, startAngle = 90) {
		this.animateFigurePath(this.man, startAngle, path, startLen, stopLen, timeLength, beats, direction);
	}

	/**
	 * Анимация женской фигуры по траектории
	 * @return {Function}    Функция инициализации анимации
	 */
	animateWoman(path, startLen, stopLen, timeLength, beats, direction, startAngle = 90) {
		this.animateFigurePath(this.woman, startAngle, path, startLen, stopLen, timeLength, beats, direction);
	}

	/**
	 * Создание Path-объекта траектории
	 * @param  {String} pathStr      Описание траектории в формате SVG path
	 * @param  {String} gender       Пол
	 * @param  {Boolean} hidden      Создать невидимым
	 * @return {Object}              Path-объект траектории
	 */
	path(pathStr, gender, hidden) {
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
	}

	manPath(pathStr) {
		return this.path(pathStr, 'man');
	}

	womanPath(pathStr) {
		return this.path(pathStr, 'woman');
	}

	/**
	 * Установить фигуру танцора на определённую позицию
	 * @param  {Object} figure Объект фигуры танцора
	 * @param  {Object} coords Объект с описанием координат {x, y, angle}
	 */
	startPosFigure(figure, coords) {
		this.positionFigure(figure, coords.x, coords.y, coords.angle);
		figure.removeClass('straightBeatFigure');
		figure.removeClass('invisible');
	}

	/**
	 * Установить фигуры танцоров на определённые позиции
	 * @param  {Object} leftCoords  Объект с описанием координат левой позиции {x, y, angle}
	 * @param  {Object} rightCoords Объект с описанием координат правой позиции {x, y, angle}
	 * @param  {String} manPosition Позиция партнёра
	 */
	startPosition(leftCoords, rightCoords, manPosition) {
		this.clearPaths();

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
	}

	/**
	 * Установить фигуры танцоров на начальные позиции
	 * @param {String} manPosition Позиция партнёра
	 */
	setAtStart(manPosition) {
		this.startPosition(this.startPos.left, this.startPos.right,	manPosition);
	}
}
