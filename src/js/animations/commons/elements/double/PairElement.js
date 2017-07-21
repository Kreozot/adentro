import Promise from 'bluebird';
import {getOppositePosition} from 'animationClasses/commons/utils';
import SingleElement from '../single/SingleElement';

/**
 * Парная анимация
 * @param {Object} animation   Объект анимации
 * @param {Object} pathStrings Строковое описание траекторий в формате позиция: траектория, ...
 */
export default class PairElement {
	constructor(animation, pathStrings) {
		this.animation = animation;
		this.manDanceAnimationElement = new SingleElement(animation, pathStrings, 'man');
		this.womanDanceAnimationElement = new SingleElement(animation, pathStrings, 'woman');
	}
	// TODO: Сделать массив с элементами и оперировать циклами, а не отдельными элементами
	/**
	 * Отрисовка траекторий
	 * @param  {String} manPosition Позиция партнёра
	 */
	drawPath(manPosition, transparent) {
		this.animation.manPosition = manPosition;
		this.manDanceAnimationElement.drawPath(manPosition, transparent);
		this.womanDanceAnimationElement.drawPath(getOppositePosition(manPosition), transparent);
	}

	/**
	 * Отрисованы ли траектории
	 */
	isPathsDrawn() {
		return (this.manDanceAnimationElement.isPathsDrawn() && this.womanDanceAnimationElement.isPathsDrawn());
	}

	/**
	 * Задать относительный угол разворота
	 * @param {Number} value Значение угла
	 */
	setAngle(value) {
		this.manDanceAnimationElement.setAngle(value);
		this.womanDanceAnimationElement.setAngle(value);
	}

	/**
	 * Задать относительный углов разворота
	 * @param {Number} manValue   Значение угла для партнёра
	 * @param {Number} womanValue Значение угла для партнёрши
	 */
	setAngles(manValue, womanValue) {
		this.manDanceAnimationElement.setAngle(manValue);
		this.womanDanceAnimationElement.setAngle(womanValue);
	}

	/**
	 * Запуск анимации элементов
	 */
	startAnimation() {
		return Promise.all([
			this.manDanceAnimationElement.startAnimation(...arguments),
			this.womanDanceAnimationElement.startAnimation(...arguments)
		]);
	}

	/**
	 * Полный цикл анимации
	 * @param  {Number} lengthS    	Длительность в секундах
	 * @param  {Number} beats     	Количество тактов
	 * @param  {String} manPosition Начальная позиция партнёра
	 * @param  {String} direction 	Направление движения фигуры
	 */
	fullAnimation(lengthS, beats, manPosition, direction, startPart, stopPart) {
		this.animation.clearPaths();
		this.drawPath(manPosition);
		return this.startAnimation(lengthS, beats, direction, startPart, stopPart);
	}
}
