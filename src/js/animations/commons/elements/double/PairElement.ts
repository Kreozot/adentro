import * as Promise from 'bluebird';
import { getOppositePosition } from 'js/animations/commons/utils';
import { FigurePosition, PathStrings } from 'js/animations/commons/AnimationTypes';
import DanceAnimation from 'js/animations/commons/DanceAnimation';
import SingleElement from '../single/SingleElement';
import { DIRECTIONS, FIGURE_HANDS, LEGS, ROTATE, STEP_STYLE } from '../../const';

/**
 * Парная анимация
 * @param {Object} animation   Объект анимации
 * @param {Object} pathStrings Строковое описание траекторий в формате позиция: траектория, ...
 */
export default class PairElement {
	animation: DanceAnimation;
	manDanceAnimationElement: SingleElement;
	womanDanceAnimationElement: SingleElement;

	constructor(animation: DanceAnimation, pathStrings: PathStrings) {
		this.animation = animation;
		this.manDanceAnimationElement = new SingleElement(animation, pathStrings, 'man');
		this.womanDanceAnimationElement = new SingleElement(animation, pathStrings, 'woman');
	}
	// TODO: Сделать массив с элементами и оперировать циклами, а не отдельными элементами
	/**
	 * Отрисовка траекторий
	 * @param  {String} manPosition Позиция партнёра
	 */
	drawPath(manPosition: FigurePosition, transparent?: boolean): void {
		this.animation.manPosition = manPosition;
		this.manDanceAnimationElement.drawPath(manPosition, transparent);
		this.womanDanceAnimationElement.drawPath(getOppositePosition(manPosition), transparent);
	}

	/**
	 * Отрисованы ли траектории
	 */
	isPathsDrawn(): boolean {
		return this.manDanceAnimationElement.isPathsDrawn() &&
			this.womanDanceAnimationElement.isPathsDrawn();
	}

	/**
	 * Задать относительный угол разворота
	 * @param {Number} angle Значение угла
	 */
	setAngle(angle: number): void {
		this.manDanceAnimationElement.setAngle(angle);
		this.womanDanceAnimationElement.setAngle(angle);
	}

	/**
	 * Задать относительный углов разворота
	 * @param {Number} manAngle   Значение угла для партнёра
	 * @param {Number} womanAngle Значение угла для партнёрши
	 */
	setAngles(manAngle: number, womanAngle: number): void {
		this.manDanceAnimationElement.setAngle(manAngle);
		this.womanDanceAnimationElement.setAngle(womanAngle);
	}

	/**
	 * Запуск анимации элементов
	 */
	startAnimation(options: {
		lengthS: number;
		beats: number;
		direction?: DIRECTIONS;
		startPart?: number;
		stopPart?: number;
		figureHands?: FIGURE_HANDS;
		isLastElement: boolean;
		stepStyle: STEP_STYLE,
		firstLeg: LEGS,
		rotateDirection: ROTATE,
		dontLookAtPair: boolean;
	}): Promise {
		return Promise.all([
			this.manDanceAnimationElement.startAnimation(options),
			this.womanDanceAnimationElement.startAnimation(options)
		]);
	}

	/**
	 * Полный цикл анимации
	 * @param  {Number} lengthS    	Длительность в секундах
	 * @param  {Number} beats     	Количество тактов
	 * @param  {String} manPosition Начальная позиция партнёра
	 * @param  {String} direction 	Направление движения фигуры
	 */
	fullAnimation(options: {
		lengthS: number;
		beats: number;
		direction?: DIRECTIONS;
		startPart?: number;
		stopPart?: number;
		figureHands?: FIGURE_HANDS;
		isLastElement: boolean;
		stepStyle: STEP_STYLE,
		firstLeg: LEGS,
		rotateDirection: ROTATE,
		dontLookAtPair: boolean;
		manPosition: FigurePosition;
	}) {
		this.animation.clearPaths();
		this.drawPath(options.manPosition);
		return this.startAnimation(options);
	}
}
