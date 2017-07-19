import Promise from 'bluebird';
import {getOppositePosition, Timer} from 'animationClasses/commons/utils';
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
	 * Запуск анимации
	 * @param  {Number} lengthS   Длительность в секундах
	 * @param  {Number} beats     Количество тактов
	 * @param  {String} direction Направление движения фигуры
	 * @param  {Number} delay     Задержка в секундах
	 * @param  {Number} startPart Позиция начала (0-1 относительно траектории)
	 * @param  {Number} stopPart  Позиция конца (0-1 относительно траектории)
	 */
	startAnimation(lengthS, beats, direction, delay, startPart, stopPart) {
		return Promise.all([
			this.manDanceAnimationElement.startAnimation(lengthS, beats, direction, delay, startPart, stopPart),
			this.womanDanceAnimationElement.startAnimation(lengthS, beats, direction, delay, startPart, stopPart)
		]);
	}

	/**
	 * Полный цикл анимации
	 * @param  {Number} lengthS    	Длительность в секундах
	 * @param  {Number} beats     	Количество тактов
	 * @param  {String} manPosition Начальная позиция партнёра
	 * @param  {String} direction 	Направление движения фигуры
	 * @param  {Number} delay     	Задержка в секундах
	 */
	fullAnimation(lengthS, beats, manPosition, direction, delay, startPart, stopPart) {
		const fullAnimationFunc = () => {
			this.animation.clearPaths();
			this.drawPath(manPosition);
			return this.startAnimation(lengthS, beats, direction, 0, startPart, stopPart);
		};

		if ((!delay) || (delay <= 0)) {
			return fullAnimationFunc();
		} else {
			return new Promise(resolve => {
				this.animation.timeouts.push(new Timer(() => fullAnimationFunc().then(resolve), delay * 1000));
			});
		}
	}
}
