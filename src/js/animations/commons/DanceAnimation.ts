import * as Promise from 'bluebird';
import * as Snap from 'snapsvg';

require('styles/animation.scss');
import {normalizeAngle, smoothRotationAngle, getAngleBetweenPoints} from 'js/animations/commons/angles';
import {getFigureCenter} from 'js/animations/commons/utils';

import Legs from './Legs';
import { STEP_STYLE, DIRECTIONS, FIGURE_HANDS, LEGS, ROTATE } from './const';
import { FigurePosition, Figure, EasingFunction, Gender, Coords } from './AnimationTypes';

const arrowsPaths = require('svgData/arrows.paths');
const figuresSvg = require('svgData/figures.elements');

// Максимальный угол поворота верха фигуры
const FIGURE_TOP_ANGLE_MAX = 90;

/**
 * Объект анимации
 * @param {String} id DOM-идентификатор SVG-объекта
 */
export default class DanceAnimation {
	svg: Snap.Paper;
	animations: mina.MinaAnimation[];
	paths: Snap.Element[];
	paused: boolean;
	manPosition: FigurePosition;
	MAN_COLOR: string;
	WOMAN_COLOR: string;
	pathCache: {
		[key: string]: Snap.Element;
	};
	pathLengths: Map<Snap.Element, number>;
	legs: Legs;
	man: Figure;
	woman: Figure;
	startPos: {
		left: Coords,
		right: Coords,
	}
	width: number;
	height: number;

	constructor(id) {
		this.svg = Snap('#' + id);

		this.animations = [];
		this.paths = [];
		this.paused = false;
		this.manPosition = 'left';

		this.MAN_COLOR = 'Blue';
		this.WOMAN_COLOR = 'DarkMagenta';

		this.initManWoman();
		this.pathCache = {};
		this.pathLengths = new Map();
		this.legs = new Legs(this.animations);
	}

	clearPaths(): void {
		this.paths.forEach(path => path.addClass('invisible'));

		this.animations.forEach(animation => animation.stop());
		while (this.animations.length > 0) {
			this.animations.pop();
		}
	}

	clear(): void {
		this.paused = false;
		this.hideFigures();
		this.clearPaths();
		this.manPosition = 'left';
	}

	pause(): void {
		this.paused = true;
		this.animations.forEach(animation => (animation as any).pause());
	}

	resume(): void {
		if (this.paused) {
			this.paused = false;
			this.animations.forEach(animation => (animation as any).resume());
		}
	}

	/**
	 * Создание фигуры танцора
	 * @param  {Gender} gender Пол
	 * @return {Object}        SVG-объект танцора
	 */
	initFigure(gender: Gender): Figure {
		const figureSvg = Snap.parse(figuresSvg[gender]);
		this.svg.append(figureSvg as Snap.Element);
		const figure: Figure = this.svg.g(
			this.svg.select('#' + gender)
				.attr({id: gender + '_figure-inner', display: 'block'})
		);
		figure
			.attr({
				id: gender + '_figure'
			})
			.addClass('invisible')
			.addClass('figure')
			.addClass('figure--' + gender);
		$('.hands, .kick', figure.node)
			.attr('style', null)
			.attr('display', null)
			.addClass('invisible');
		this.changeFigureHands(figure, FIGURE_HANDS.DOWN);
		figure.angle = null;
		figure.top = Snap($('.top', figure.node)[0] as SVGElement);
		return figure;
	}

	/**
	 * Создание иконки вращения
	 * @param  {Number} x          Координата центра X
	 * @param  {Number} y          Координата центра Y
	 * @param  {Number} angle      Угол поворота (при 0 позиция стрелок вертикальна)
	 * @param  {Boolean} clockwise По часовой стрелке
	 * @return {Object}            Path-объект иконки
	 */
	initRotateIcon(x: number, y: number, angle: number, clockwise: boolean): Snap.Element {
		const arrows = this.svg.path(clockwise
			? arrowsPaths.rotation_clockwise
			: arrowsPaths.rotation_counterclockwise);
		arrows.addClass('rotation-arrows')
			.transform(`t${x},${y}r${angle}`);
		this.paths[this.paths.length] = arrows;
		return arrows;
	}

	hideFigure(figure: Figure): void {
		figure.addClass('invisible');
		figure.angle = null;
		figure.top.transform('r0');
		figure.top.angle = 0;
	}

	/**
	 * Спрятать фигурки танцоров
	 */
	hideFigures(): void {
		this.hideFigure(this.man);
		this.hideFigure(this.woman);
	}

	/**
	 * Инициализация фигур партнёра и партнёрши
	 */
	initManWoman(): void {
		if ((!this.man) || (!this.woman)) {
			this.man = this.initFigure('man');
			this.woman = this.initFigure('woman');
		}
	}

	/**
	 * Поворот верха фигуры по направлению к парной фигуре.
	 * Если не задан pairFigure, то поворот сбрасывается.
	 * @param  {Object} figure     Объект фигуры
	 * @param  {Object} pairFigure Объект парной фигуры
	 */
	rotateTopToPairFigure(figure: Figure, pairFigure: Figure = null) {
		if (pairFigure) {
			const figureCenter = getFigureCenter(figure);
			const pairFigureCenter = getFigureCenter(pairFigure);

			// Угол между линией, соединяющей фигуры и горизонтальной осью
			const angleBetweenFigures = getAngleBetweenPoints(figureCenter, pairFigureCenter);
			// Угол верха фигуры относительно остальной фигуры
			let relativeAngle = normalizeAngle(angleBetweenFigures + 90 - figure.angle, -180);
			let rotateDirection = null;
			if (relativeAngle > FIGURE_TOP_ANGLE_MAX) {
				relativeAngle = FIGURE_TOP_ANGLE_MAX;
				rotateDirection = ROTATE.COUNTERCLOCKWISE;
			} else if (relativeAngle < -FIGURE_TOP_ANGLE_MAX) {
				relativeAngle = -FIGURE_TOP_ANGLE_MAX;
				rotateDirection = ROTATE.CLOCKWISE;
			}
			relativeAngle = smoothRotationAngle(relativeAngle, figure.top.angle, rotateDirection);

			if (figure.top.angle !== relativeAngle) {
				figure.top.transform(`r${relativeAngle}`);
				figure.top.angle = relativeAngle;
			}
		} else {
			figure.top.transform('r0');
			figure.top.angle = 0;
		}
	}

	/**
	 * Позиционирование фигуры в заданной точке под заданным углом.
	 * Также выполняется корректировка угла фигуры чтобы обеспечить плавность поворота,
	 * а также направление верхней части фигуры в сторону фигуры партнёра при необходимости.
	 * @param  {Object} figure Объект фигуры
	 * @param  {Number} x Координата центра X
	 * @param  {Number} y Координата центра Y
	 * @param  {Number} angle Угол поворота (при 0 фигура стоит вертикально)
	 * @param  {Object} pairFigure Объект парной фигуры
	 * @param  {Number} rotateDirection Идентификатор направления поворота (для плавного изменения градуса)
	 */
	positionFigure({
		figure,
		x,
		y,
		angle,
		pairFigure,
		rotateDirection,
		dontLookAtPair
	}: {
		figure: Figure;
		x: number;
		y: number;
		angle: number;
		pairFigure?: Figure;
		rotateDirection?: ROTATE,
		dontLookAtPair?: boolean;
	}) {
		angle = normalizeAngle(angle);
		if (!figure.angle && (figure.angle !== 0)) {
			figure.angle = angle;
		}
		figure.angle = smoothRotationAngle(angle, figure.angle, rotateDirection);
		figure.angle = normalizeAngle(figure.angle);
		figure.coords = [x, y];
		figure.transform(`t${x},${y}r${Math.floor(figure.angle)}`);

		if (!dontLookAtPair) {
			this.rotateTopToPairFigure(figure, pairFigure);
		}
	}

	/**
	 * Смена отображаемой вариации рук фигуры
	 * @param  {Object} figure Объект фигуры
	 * @param  {String} hands  Идентификатор вариации рук
	 */
	changeFigureHands(figure: Figure, hands: FIGURE_HANDS) {
		$(`.hands:not(.hands--${hands})`, figure.node).addClass('invisible');
		$(`.hands--${hands}`, figure.node).removeClass('invisible');
	}

	/**
	 * Анимация фигуры по траектории
	 * @param  {Object} figure     Фигура для анимации
	 * @param  {Number} startAngle Угол наклона фигуры относительно траектории
	 * @param  {Object} path       Path-объект траектории движения
	 * @param  {Number} startLen   Позиция начала движения от начала траектории
	 * @param  {Number} stopLen    Позиция конца движения от начала траектории
	 * @param  {Number} timeLength Время движения (мс)
	 * @param  {Number} beats      Количество тактов
	 * @param  {Number} direction  Константа, определяющая направление движения
	 * @param  {[type]} easing     Snap mina easing - объект, определяющий характер движения (линейный по-умолчанию)
	 */
	animateFigurePath({
		figure,
		startAngle = 90,
		path,
		startLen,
		stopLen,
		timeLength,
		beats,
		direction = DIRECTIONS.FORWARD,
		easing = mina.linear,
		figureHands = FIGURE_HANDS.CASTANETAS,
		pairFigure,
		dontLookAtPair,
		isLastElement,
		stepStyle = STEP_STYLE.BASIC,
		firstLeg = LEGS.LEFT,
		rotateDirection
	}: {
		figure: Figure,
		startAngle: number,
		path: Snap.Element,
		startLen: number,
		stopLen: number,
		timeLength: number,
		beats: number,
		direction: DIRECTIONS,
		easing: EasingFunction,
		figureHands: FIGURE_HANDS,
		pairFigure: Figure,
		dontLookAtPair: boolean,
		isLastElement: boolean,
		stepStyle: STEP_STYLE,
		firstLeg: LEGS,
		rotateDirection: ROTATE
	}) {
		// Перенос фигура на верх DOM-а (TODO: Исправить на группировку)
		figure.node.parentNode.appendChild(figure.node);

		let angle = startAngle;
		if (direction === DIRECTIONS.BACKWARD) {
			angle = angle - 180;
		}
		if (!path) {
			throw new Error('path is not drawn yet');
		}

		const pathLength = this.pathLengths.get(path);

		/**
		 * Трансформация положения фигуры на определённом участке кривой тракетории
		 * @param  {Number} length Пройденная длина на кривой
		 */
		const transformAtLength = (length) => {
			if (length > pathLength) {
				length = length - pathLength;
			}
			const movePoint = path.getPointAtLength(length);
			const finalAngle = direction === DIRECTIONS.STRAIGHT_FORWARD
				? angle
				: angle + movePoint.alpha;
			this.positionFigure({
				figure,
				x: movePoint.x,
				y: movePoint.y,
				angle: finalAngle,
				pairFigure,
				dontLookAtPair,
				rotateDirection,
			});
		};

		transformAtLength(startLen);

		this.changeFigureHands(figure, figureHands);

		$(`.kick`, figure.node)
			.addClass(`invisible`);

		figure.removeClass('invisible');

		// Если последний элемент, доходим быстрее на два шага (на 2/3 базового шага)
		const timeLengthForPath = isLastElement
			? (beats * 3 - 2) * (timeLength / beats / 3)
			: timeLength;

		return new Promise(resolve => {
			this.animations.push(Snap.animate(
				startLen,
				stopLen,
				transformAtLength,
				timeLengthForPath,
				easing,
				resolve)
			);

			this.legs.animateFigureTime({
				figure,
				timeLength,
				beats,
				stepStyle,
				isLastElement,
				firstLeg
			});
		});
	}

	/**
	 * Анимация мужской фигуры по траектории
	 */
	animateMan(options: {
		startAngle: number,
		path,
		startLen: number,
		stopLen: number,
		timeLength: number,
		beats: number,
		direction: DIRECTIONS,
		easing: EasingFunction,
		figureHands: FIGURE_HANDS,
		dontLookAtPair: boolean,
		isLastElement: boolean,
		stepStyle: STEP_STYLE,
		firstLeg: LEGS,
		rotateDirection: ROTATE
	}) {
		return this.animateFigurePath({
			...options,
			figure: this.man,
			pairFigure: this.woman
		});
	}

	/**
	 * Анимация женской фигуры по траектории
	 */
	animateWoman(options: {
		startAngle: number,
		path,
		startLen: number,
		stopLen: number,
		timeLength: number,
		beats: number,
		direction: DIRECTIONS,
		easing: EasingFunction,
		figureHands: FIGURE_HANDS,
		dontLookAtPair: boolean,
		isLastElement: boolean,
		stepStyle: STEP_STYLE,
		firstLeg: LEGS,
		rotateDirection: ROTATE
	}) {
		return this.animateFigurePath({
			...options,
			figure: this.woman,
			pairFigure: this.man
		});
	}

	/**
	 * СОздать path-объект и положить его в кеш
	 * @param  {String} pathStr      Описание траектории в формате SVG path
	 * @return {Object}              Path-объект траектории
	 */
	createPath(pathStr: string): Snap.Element {
		const resultPath = this.svg.path(pathStr)
			.addClass('path')
			.addClass('invisible');
		this.pathCache[pathStr] = resultPath;
		this.pathLengths.set(resultPath, resultPath.getTotalLength());
		return resultPath;
	}

	/**
	 * Создание Path-объекта траектории
	 * @param  {String} pathStr      Описание траектории в формате SVG path
	 * @param  {String} gender       Пол
	 * @param  {Boolean} hidden      Создать невидимым
	 * @return {Object}              Path-объект траектории
	 */
	path(pathStr: string, gender: Gender, hidden?: boolean): Snap.Element {
		const resultPath = this.pathCache[pathStr] || this.createPath(pathStr);

		if (hidden) {
			resultPath.addClass('invisible');
		} else {
			resultPath.removeClass('invisible');
		}

		if (gender === 'man') {
			resultPath.removeClass('path--woman');
			resultPath.addClass('path--man');
		} else if (gender === 'woman') {
			resultPath.removeClass('path--man');
			resultPath.addClass('path--woman');
		}

		this.paths[this.paths.length] = resultPath;
		return resultPath;
	}

	manPath(pathStr: string): Snap.Element {
		return this.path(pathStr, 'man');
	}

	womanPath(pathStr: string): Snap.Element {
		return this.path(pathStr, 'woman');
	}

	/**
	 * Установить фигуру танцора на определённую позицию
	 * @param  {Object} figure Объект фигуры танцора
	 * @param  {Object} coords Объект с описанием координат {x, y, angle}
	 */
	startPosFigure(figure: Figure, coords) { // TODO: coords: Coords
		figure.angle = null;
		figure.top.transform('r0');
		figure.top.angle = 0;
		this.changeFigureHands(figure, FIGURE_HANDS.DOWN);
		this.positionFigure({
			...coords,
			figure,
		});
		figure.removeClass('invisible');
		$('.leg', figure.node)
			.attr(`transform`, null);
	}

	/**
	 * Установить фигуры на определённые позиции
	 * @param  {Object} leftCoords  Объект с описанием координат левой позиции {x, y, angle}
	 * @param  {Object} rightCoords Объект с описанием координат правой позиции {x, y, angle}
	 * @param  {String} manPosition Позиция партнёра
	 */
	private startPosition(leftCoords: Coords, rightCoords: Coords, manPosition: FigurePosition): void {
		this.clearPaths();

		manPosition = manPosition || this.manPosition;

		if (manPosition === 'left') {
			this.startPosFigure(this.man, leftCoords);
			this.startPosFigure(this.woman, rightCoords);
		} else {
			this.startPosFigure(this.man, rightCoords);
			this.startPosFigure(this.woman, leftCoords);
		}
	}

	/**
	 * Установить фигуры на начальные позиции
	 * @param {String} manPosition Позиция партнёра
	 */
	setAtStart(manPosition: FigurePosition): void {
		this.startPosition(this.startPos.left, this.startPos.right,	manPosition);
	}
}
