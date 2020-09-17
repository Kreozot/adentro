import { DIRECTIONS, FIGURE_HANDS, LEGS, ROTATE, STEP_STYLE } from 'js/animations/commons/const';
import DanceAnimation from 'js/animations/commons/DanceAnimation';
import { EasingFunction, Figure, FigurePosition, Gender, PathStrings } from 'js/animations/commons/AnimationTypes';

export type StartAnimationParameters = {
	lengthS: number;
	beats: number;
	direction?: DIRECTIONS;
	startAngle?: number;
	startPart?: number;
	stopPart?: number;
	figureHands?: FIGURE_HANDS;
	isLastElement?: boolean;
	stepStyle?: STEP_STYLE;
	firstLeg?: LEGS;
	rotateDirection?: ROTATE;
	dontLookAtPair?: boolean;
};

export type AnimationFunctionParameters = {
	lengthMs: number;
	beats: number;
	direction?: DIRECTIONS;
	startPart?: number;
	stopPart?: number;
	figureHands?: FIGURE_HANDS;
	isLastElement?: boolean;
	stepStyle?: STEP_STYLE;
	firstLeg?: LEGS;
	rotateDirection?: ROTATE;
	dontLookAtPair?: boolean;
};

/**
 * Одиночная анимация
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {String} gender      Пол: "man"; "woman"
 */
export default class SingleElement {
	animation: DanceAnimation;
	pathStrings: PathStrings;
	gender: Gender;
	path: Snap.Element;
	figure: Figure;
	pairFigure: Figure;
	angle: number;
	easing: EasingFunction;
	position: FigurePosition;
	pathLength: number;

	constructor(animation: DanceAnimation, pathStrings: PathStrings, gender: Gender, figure?: Figure, pairFigure?: Figure) {
		this.animation = animation;
		this.pathStrings = pathStrings;
		this.gender = gender;
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
	drawPath(position: FigurePosition, hidden?: boolean): void {
		this.position = position;
		this.path = this.animation.path(this.pathStrings[position], this.gender, hidden);
		this.pathLength = this.path.getTotalLength() - 1;
	}

	/**
	 * Отрисованы ли траектории
	 */
	isPathsDrawn(): boolean {
		return this.path.type === 'path';
	}

	/**
	 * Задать относительный угол разворота
	 * @param {Number} angle Значение угла
	 */
	setAngle(angle: number): void {
		this.angle = angle;
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
		lengthMs,
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
	}: AnimationFunctionParameters) {
		return this.animation.animateFigurePath({
			figure: this.figure,
			startAngle: 90 + this.angle,
			path: this.path,
			startLen: this.pathLength * startPart,
			stopLen: this.pathLength * stopPart,
			easing: this.easing,
			timeLength: lengthMs,
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
	startAnimation(options: StartAnimationParameters) {
		return this.animationFunction({
			...options,
			lengthMs: options.lengthS * 1000
		});
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
		position: FigurePosition;
	}) {
		this.animation.clearPaths();
		this.drawPath(options.position);
		return this.startAnimation(options);
	}
}
