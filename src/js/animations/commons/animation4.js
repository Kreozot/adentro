import DanceAnimation from './animation.js';
import {SingleDanceAnimationElement, DanceAnimationElement} from './elements.js';
import {Timer, getOppositePosition} from './utils.js';
/**
 * [DanceAnimationElement анимация на четверых]
 * @param {Object} animation   [объект анимации]
 * @param {Object} pathStrings1 [строковое описание траекторий первой пары в формате [позиция: траектория, ...]]
 * @param {Object} pathStrings2 [строковое описание траекторий второй пары в формате [позиция: траектория, ...]]
 */
export class FourDanceAnimationElement {
	constructor(animation, pathStrings1, pathStrings2) {
		this.animation = animation;
		this.man1DanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings1, 'man', this.animation.man);
		this.woman1DanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings1, 'woman', this.animation.woman);
		this.man2DanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings2, 'man', this.animation.man2);
		this.woman2DanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings2, 'woman', this.animation.woman2);
	}

	/**
	 * [drawPath отрисовка траекторий]
	 * @param  {String} manPosition [позиция партнёра]
	 */
	drawPath(manPosition, transparent) {
		this.animation.manPosition = manPosition;
		this.man1DanceAnimationElement.drawPath(manPosition, transparent);
		this.woman1DanceAnimationElement.drawPath(getOppositePosition(manPosition), transparent);
		this.man2DanceAnimationElement.drawPath(manPosition, transparent);
		this.woman2DanceAnimationElement.drawPath(getOppositePosition(manPosition), transparent);
	}

	/**
	 * isPathsDrawn Отрисованы ли траектории
	 */
	isPathsDrawn() {
		return (this.man1DanceAnimationElement.isPathsDrawn() && this.woman1DanceAnimationElement.isPathsDrawn() &&
			this.man2DanceAnimationElement.isPathsDrawn() && this.woman2DanceAnimationElement.isPathsDrawn());
	}

	/**
	 * setAngle Задать относительный угол разворота
	 * @param {Number} value значение угла
	 */
	setAngle(value) {
		this.man1DanceAnimationElement.setAngle(value);
		this.woman1DanceAnimationElement.setAngle(value);
		this.man2DanceAnimationElement.setAngle(value);
		this.woman2DanceAnimationElement.setAngle(value);
	}

	/**
	 * startAnimation Запуск анимации
	 * @param  {Number} lengthS   длительность в секундах
	 * @param  {Number} beats     количество тактов
	 * @param  {String} direction направление движения фигуры
	 * @param  {Number} delay     задержка в секундах
	 * @param  {Number} startPart позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  позиция конца (0-1 относительно траектории)
	 */
	startAnimation(lengthS, beats, direction, delay, startPart, stopPart) {
		this.man1DanceAnimationElement.startAnimation(lengthS, beats, direction, delay, startPart, stopPart);
		this.woman1DanceAnimationElement.startAnimation(lengthS, beats, direction, delay, startPart, stopPart);
		this.man2DanceAnimationElement.startAnimation(lengthS, beats, direction, delay, startPart, stopPart);
		this.woman2DanceAnimationElement.startAnimation(lengthS, beats, direction, delay, startPart, stopPart);
	}

	/**
	 * fullAnimation Полный цикл анимации
	 * @param  {Number} lengthS    	длительность в секундах
	 * @param  {Number} beats     	количество тактов
	 * @param  {String} manPosition   начальная позиция партнёра
	 * @param  {String} direction 	направление движения фигуры
	 * @param  {Number} delay     	задержка в секундах
	 */
	fullAnimation(lengthS, beats, manPosition, direction, delay, startPart, stopPart) {
		const fullAnimationFunc = () => {
			this.animation.clearPaths();
			this.drawPath(manPosition);
			this.startAnimation(lengthS, beats, direction, 0, startPart, stopPart);
		};

		if ((!delay) || (delay <= 0)) {
			fullAnimationFunc();
		} else {
			this.animation.timeouts[this.animation.timeouts.length] = new Timer(fullAnimationFunc, delay * 1000);
		}
	}
}

export class Dance4Animation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.man2 = this.initFigure('man');
		this.woman2 = this.initFigure('woman');
	}

	hideFigures() {
		this.man.addClass('invisible');
		this.woman.addClass('invisible');
		this.man2.addClass('invisible');
		this.woman2.addClass('invisible');
	}

	startPosition(leftCoords1, rightCoords1, leftCoords2, rightCoords2, manPosition) {
		this.clearPaths();
		var self = this;

		if (!manPosition) {
			manPosition = this.manPosition;
		}

		if (manPosition === 'left') {
			this.startPosFigure(this.man, leftCoords1);
			this.startPosFigure(this.woman, rightCoords1);
			this.startPosFigure(this.man2, leftCoords2);
			this.startPosFigure(this.woman2, rightCoords2);
		} else {
			this.startPosFigure(this.man, rightCoords1);
			this.startPosFigure(this.woman, leftCoords1);
			this.startPosFigure(this.man2, rightCoords2);
			this.startPosFigure(this.woman2, leftCoords2);
		}
	}

	setAtStart(manPosition) {
		this.startPosition(this.startPos.left1, this.startPos.right1, this.startPos.left2, this.startPos.right2, manPosition);
	}
}
