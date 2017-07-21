/**
 * Одиночная анимация
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {String} gender      Пол: "man"; "woman"
 */
export default class SingleElement {
	constructor(animation, pathStrings, gender, figure) {
		this.animation = animation;
		this.pathStrings = pathStrings;
		this.gender = gender;
		this.path = {};
		// this.pathFunction = gender === "man" ? this.animation.manPath : this.animation.womanPath;
		if (figure) {
			this.figure = figure;
		} else {
			this.figure = gender === 'man' ? this.animation.man : this.animation.woman;
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
	}

	/**
	 * Инициализация анимации
	 * @param  {Number} lengthMs  Длина в милисекундах
	 * @param  {Number} beats     Количество тактов
	 * @param  {String} direction Направление движения
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
	 */
	animationFunction(lengthMs, beats, direction, startPart, stopPart) {
		return this.animation.animateFigurePath(this.figure, 90 + this.angle, this.path,
			this.pathLength * startPart, this.pathLength * stopPart, lengthMs, beats, direction, this.easing);
	}

	/**
	 * Запуск анимации
	 * @param  {Number} lengthS   Длительность в секундах
	 * @param  {Number} beats     Количество тактов
	 * @param  {String} direction Направление движения фигуры
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
	 */
	startAnimation(lengthS, beats, direction, startPart = 0, stopPart = 1) {
		return this.animationFunction(lengthS * 1000, beats, direction, startPart, stopPart);
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
	fullAnimation(lengthS, beats, position, direction, startPart, stopPart) {
		this.animation.clearPaths();
		this.drawPath(position);
		return this.startAnimation(lengthS, beats, direction, startPart, stopPart);
	}
}
