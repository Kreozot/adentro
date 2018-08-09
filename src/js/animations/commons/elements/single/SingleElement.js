import {DIRECTIONS, FIGURE_HANDS} from 'js/animations/commons/const';

/**
 * Одиночная анимация
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {String} gender      Пол: "man"; "woman"
 */
export default class SingleElement {
	constructor(animation, pathStrings, gender, figure, pairFigure) {
		this.animation = animation;
		this.pathStrings = pathStrings;
		this.gender = gender;
		this.path = {};
		if (figure) {
			this.figure = figure;
			if (pairFigure) {
				this.pairFigure = pairFigure;
			}
		} else {
			this.figure = gender === 'man' ? this.animation.man : this.animation.woman;
			this.pairFigure = gender === 'man' ? this.animation.woman : this.animation.man;
		}
		this.angle = 0;
		this.easing = mina.linear;

		// Загружаем path в кеш
		if (pathStrings) {
			if (typeof pathStrings === 'string') {
				this.animation.createPath(pathStrings);
			} else {
				Object.keys(pathStrings).forEach(position => {
					this.animation.createPath(pathStrings[position]);
				});
			}
		}
	}

	/**
	 * Отрисовка траектории
	 * @param  {String} position Позиция
	 * @param  {Boolean} hidden  Создать скрытой
	 */
	drawPath(position, hidden) {
		this.position = position;
		this.path = this.animation.path(this.pathStrings[position], this.gender, hidden);
		this.pathLength = this.path.getTotalLength() - 1;
		return this;
	}

	/**
	 * Отрисованы ли траектории
	 */
	isPathsDrawn() {
		return this.path.type == 'path';
	}

	/**
	 * Задать относительный угол разворота
	 * @param {Number} value Значение угла
	 */
	setAngle(value) {
		this.angle = value;
		return this;
	}

	/**
	 * Инициализация анимации
	 * @param  {Number} lengthMs  Длина в милисекундах
	 * @param  {Number} beats     Количество тактов
	 * @param  {String} direction Направление движения
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
	 */
	animationFunction({
		lengthMs: timeLength,
		beats,
		direction = DIRECTIONS.FORWARD,
		startPart = 0,
		stopPart = 1,
		figureHands = FIGURE_HANDS.CASTANETAS,
		isLastElement,
		stepStyle,
		firstLeg,
		rotateDirection,
		dontLookAtPair,
	}) {
		return this.animation.animateFigurePath({
			figure: this.figure,
			startAngle: 90 + this.angle,
			path: this.path,
			startLen: this.pathLength * startPart,
			stopLen: this.pathLength * stopPart,
			easing: this.easing,
			timeLength,
			beats,
			direction,
			isLastElement,
			figureHands,
			stepStyle,
			firstLeg,
			rotateDirection,
			pairFigure: this.pairFigure,
			dontLookAtPair,
		});
	}

	/**
	 * Запуск анимации
	 * @param  {Number} lengthS   Длительность в секундах
	 * @param  {Number} beats     Количество тактов
	 * @param  {String} direction Направление движения фигуры
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
	 */
	startAnimation(options) {
		return this.animationFunction({...options, lengthMs: options.lengthS * 1000});
	}

	/**
	 * fullAnimation Полный цикл анимации
	 * @param  {Number} lengthS    	длительность в секундах
	 * @param  {Number} beats     	количество тактов
	 * @param  {String} manPosition   начальная позиция партнёра
	 * @param  {String} direction 	направление движения фигуры
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
	 */
	fullAnimation(options) {
		this.animation.clearPaths();
		this.drawPath(options.position);
		return this.startAnimation(options);
	}
}
