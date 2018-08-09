import Promise from 'bluebird';
import {getOppositePosition} from 'js/animations/commons/utils';
import SingleElement from '../single/SingleElement';

/**
 * [PairElement анимация на четверых]
 * @param {Object} animation   [объект анимации]
 * @param {Object} pathStrings1 [строковое описание траекторий первой пары в формате [позиция: траектория, ...]]
 * @param {Object} pathStrings2 [строковое описание траекторий второй пары в формате [позиция: траектория, ...]]
 */
export default class QuatroElement {
	constructor(animation, pathStrings1, pathStrings2) {
		this.animation = animation;
		this.man1DanceAnimationElement = new SingleElement(animation, pathStrings1, 'man', this.animation.man);
		this.woman1DanceAnimationElement = new SingleElement(animation, pathStrings1, 'woman', this.animation.woman);
		this.man2DanceAnimationElement = new SingleElement(animation, pathStrings2, 'man', this.animation.man2);
		this.woman2DanceAnimationElement = new SingleElement(animation, pathStrings2, 'woman', this.animation.woman2);
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
		return this;
	}

	/**
	 * isPathsDrawn Отрисованы ли траектории
	 */
	isPathsDrawn() {
		return (this.man1DanceAnimationElement.isPathsDrawn() &&
			this.woman1DanceAnimationElement.isPathsDrawn() &&
			this.man2DanceAnimationElement.isPathsDrawn() &&
			this.woman2DanceAnimationElement.isPathsDrawn());
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
		return this;
	}

	/**
	 * startAnimation Запуск анимации элементов
	 */
	startAnimation(options) {
		return Promise.all([
			this.man1DanceAnimationElement.startAnimation(options),
			this.woman1DanceAnimationElement.startAnimation(options),
			this.man2DanceAnimationElement.startAnimation(options),
			this.woman2DanceAnimationElement.startAnimation(options)
		]);
	}

	/**
	 * fullAnimation Полный цикл анимации
	 * @param  {Number} lengthS    	длительность в секундах
	 * @param  {Number} beats     	количество тактов
	 * @param  {String} manPosition   начальная позиция партнёра
	 * @param  {String} direction 	направление движения фигуры
	 */
	fullAnimation(options) {
		this.animation.clearPaths();
		this.drawPath(options.manPosition);
		return this.startAnimation(options);
	}
}
