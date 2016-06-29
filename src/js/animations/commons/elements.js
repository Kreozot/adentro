import {getOppositePosition, Timer} from './utils.js';
var objectAssign = require('object-assign');

/**
 * Одиночная анимация
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {String} gender      Пол: "man"; "woman"
 */
export class SingleDanceAnimationElement {
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
		this.animation.animateFigurePath(this.figure, 90 + this.angle, this.path,
			this.pathLength * startPart, this.pathLength * stopPart, lengthMs, beats, direction, this.easing);
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
	startAnimation(lengthS, beats, direction, delay, startPart = 0, stopPart = 1) {
		if (typeof lengthS === 'object') {
			const params = objectAssign(lengthS);
			lengthS = params.lengthS;
			beats = params.beats;
			direction = params.direction;
			delay = params.delay;
			startPart = params.startPart;
			stopPart = params.stopPart;
		}
		const startAnimationFunc = () => {
			this.animationFunction(lengthS * 1000, beats, direction, startPart, stopPart);
		};

		if ((!delay) || (delay <= 0)) {
			startAnimationFunc();
		} else {
			this.animation.timeouts.push(new Timer(startAnimationFunc, delay * 1000));
		}
	}

	/**
	 * fullAnimation Полный цикл анимации
	 * @param  {Number} lengthS    	длительность в секундах
	 * @param  {Number} beats     	количество тактов
	 * @param  {String} manPosition   начальная позиция партнёра
	 * @param  {String} direction 	направление движения фигуры
	 * @param  {Number} delay     	задержка в секундах
	 */
	fullAnimation(lengthS, beats, position, direction, delay, startPart, stopPart) {
		const fullAnimationFunc = () => {
			this.animation.clearPaths();
			this.drawPath(position);
			this.startAnimation(lengthS, beats, direction, 0, startPart, stopPart);
		};

		if ((!delay) || (delay <= 0)) {
			fullAnimationFunc();
		} else {
			this.animation.timeouts.push(new Timer(fullAnimationFunc, delay * 1000));
		}
	}
}

/**
 * Парная анимация
 * @param {Object} animation   Объект анимации
 * @param {Object} pathStrings Строковое описание траекторий в формате позиция: траектория, ...
 */
export class DanceAnimationElement {
	constructor(animation, pathStrings) {
		this.animation = animation;
		this.manDanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings, 'man');
		this.womanDanceAnimationElement = new SingleDanceAnimationElement(animation, pathStrings, 'woman');
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
		this.manDanceAnimationElement.startAnimation(lengthS, beats, direction, delay, startPart, stopPart);
		this.womanDanceAnimationElement.startAnimation(lengthS, beats, direction, delay, startPart, stopPart);
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
			this.startAnimation(lengthS, beats, direction, 0, startPart, stopPart);
		};

		if ((!delay) || (delay <= 0)) {
			fullAnimationFunc();
		} else {
			this.animation.timeouts.push(new Timer(fullAnimationFunc, delay * 1000));
		}
	}
}

/**
 * Продвижение с вращением
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {String} gender      Пол: "man"; "woman"
 * @param {Object} figure      Объект фигуры анимации
 * @param {Number} rotateAngle Угол поворота
 */
export class RotateElement extends SingleDanceAnimationElement {
	constructor(animation, pathStrings, gender, figure, rotateAngle) {
		super(animation, pathStrings, gender, figure, rotateAngle);

		this.rotateAngle = rotateAngle;
	}

	animationFunction(lengthMs, beats) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		this.animation.animateFigureTime(this.figure, lengthMs, beats * 6);
	}

	startAnimation(lengthS, beats, startAngle, direction, delay, startPart, stopPart) {
		startPart = startPart || 0;
		stopPart = stopPart || 1;

		const startAnimationFunc = () => {
			const angle = startAngle;
			const startLen = this.pathLength * startPart;
			const stopLen = this.pathLength * stopPart;
			const angleSpeed = this.rotateAngle / (stopLen - startLen);

			const transformAtLength = (length) => {
				const movePoint = this.path.getPointAtLength(length);
				this.animation.positionFigure(this.figure, movePoint.x, movePoint.y, angle - angleSpeed * (length - startLen));
			};

			transformAtLength(startLen);
			this.figure.removeClass('invisible');

			this.animation.animations[this.animation.animations.length] = Snap.animate(startLen, stopLen,
				function (value) { //this - animation element
					this.lastValue = value;
					transformAtLength(value);
				}, lengthS * 1000, mina.linear);

			this.animation.animateFigureTime(this.figure, lengthS * 1000, beats);
		};

		if ((!delay) || (delay <= 0)) {
			startAnimationFunc();
		} else {
			this.animation.timeouts.push(new Timer(startAnimationFunc, delay * 1000));
		}
	}
}

/**
 * Парная анимация для продвижения с вращением
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {Number} rotateAngle Угол поворота
 */
export class RotateDanceAnimationElement extends DanceAnimationElement {
	constructor(animation, pathStrings, rotateAngle) {
		super(animation, pathStrings, rotateAngle);

		this.manDanceAnimationElement = new RotateElement(animation, pathStrings, 'man', undefined, rotateAngle);
		this.womanDanceAnimationElement = new RotateElement(animation, pathStrings, 'woman', undefined, rotateAngle);
	}

	startAnimation(lengthS, beats, startAngleMan, startAngleWoman, direction, delay, startPart, stopPart) {
		this.manDanceAnimationElement.startAnimation(lengthS, beats, startAngleMan, direction, delay, startPart, stopPart);
		this.womanDanceAnimationElement.startAnimation(lengthS, beats, startAngleWoman, direction, delay, startPart, stopPart);
	}

	fullAnimation(lengthS, beats, startAngleMan, startAngleWoman, manPosition, direction, delay, startPart, stopPart) {

		const fullAnimationFunc = () => {
			this.animation.clearPaths();
			this.drawPath(manPosition);
			this.startAnimation(lengthS, beats, startAngleMan, startAngleWoman, direction, 0, startPart, stopPart);
		};

		if ((!delay) || (delay <= 0)) {
			fullAnimationFunc();
		} else {
			this.animation.timeouts.push(new Timer(fullAnimationFunc, delay * 1000));
		}
	}
}
