import Promise from 'bluebird';

require('styles/animation.scss');
import {normalizeAngle} from 'animationClasses/commons/utils';

import Legs from './Legs';
import {STEP_STYLE, DIRECTIONS, FIGURE_HANDS, LEGS} from './const';

const FIGURE_ANGLE_TICK = 25;
const FIGURE_ANGLE_SPEED = 3;
// Ширина фигуры
const FIGURE_WIDTH = 20;
// Высота фигуры
const FIGURE_HEIGHT = 20;
// Максимальный угол поворота верха фигуры
// const FIGURE_TOP_ANGLE_MAX = 45;

const figuresSvg = {
	man: getSvgElement('figures.svg', '#man'),
	woman: getSvgElement('figures.svg', '#woman'),
};
const figureWidthHalf = FIGURE_WIDTH / 2;
const figureHeightHalf = FIGURE_HEIGHT / 2;

/**
 * Объект анимации
 * @param {String} id DOM-идентификатор SVG-объекта
 */
export default class DanceAnimation {
	constructor(id) {
		this.svg = new Snap('#' + id);

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

	clearPaths() {
		this.paths.forEach(path => path.addClass('invisible'));

		this.animations.forEach(animation => animation.stop());
		while (this.animations.length > 0) {
			this.animations.pop();
		}
	}

	clear() {
		this.paused = false;
		this.hideFigures();
		this.clearPaths();
		this.manPosition = 'left';
	}

	pause() {
		this.paused = true;
		this.animations.forEach(animation => animation.pause());
	}

	resume() {
		if (this.paused) {
			this.paused = false;
			this.animations.forEach(animation => animation.resume());
		}
	}

	/**
	 * Создание фигуры танцора
	 * @param  {String} gender Пол
	 * @return {Object}        SVG-объект танцора
	 */
	initFigure(gender) {
		const figureSvg = Snap.parse(figuresSvg[gender]);
		this.svg.append(figureSvg);
		const figure = this.svg.g(
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
	initRotateIcon(x, y, angle, clockwise) {
		const arrows = this.svg.path(clockwise
			? 'm -15.9,-19.4 c 0.4,1.6 -2.4,2.7 -3.2,4.3 -7.8,9.5 -6.7,24.8 2.6,33 2.5,2.3 5.5,4 8.7,5.2 0.5,-1.9 1.9,-4.2 -0.9,-4.5 C -18.8,14.2 -23.5,1 -18.4,-8.9 c 1.1,-2.4 2.8,-4.5 4.7,-6.3 1.3,1.6 3,7.9 4,6.4 1.4,-4.2 2.7,-8.3 4,-12.5 -4.3,-1.1 -8.6,-2.3 -13,-3.4 0.9,1.8 1.8,3.6 2.7,5.3 z m 22.7,0 C 17.4,-16 23.4,-3.1 19.2,7.2 18.1,10.3 16.2,12.9 13.9,15.2 12.5,13.6 10.9,7.3 9.8,8.8 8.4,13 7,17.1 5.7,21.3 c 4.3,1.1 8.6,2.3 13,3.4 -0.4,-2.3 -4.4,-5.3 -1.9,-7 9.4,-8.5 10.2,-24.4 1.5,-33.8 -2.8,-3.2 -6.5,-5.6 -10.5,-6.9 -0.4,1.2 -0.7,2.5 -1,3.7 z'
			: 'm -15.9,19.4 c 0.4,-1.6 -2.4,-2.7 -3.2,-4.3 -7.8,-9.5 -6.7,-24.8 2.6,-33 2.5,-2.3 5.5,-4 8.7,-5.2 0.5,1.9 1.9,4.2 -0.9,4.5 -10.2,4.4 -14.9,17.6 -9.8,27.5 1.1,2.4 2.8,4.5 4.7,6.3 1.3,-1.6 3,-7.9 4,-6.4 1.4,4.2 2.7,8.3 4,12.5 -4.3,1.1 -8.6,2.3 -13,3.4 0.9,-1.8 1.8,-3.6 2.7,-5.3 z M 6.8,19.4 C 17.4,16 23.4,3.1 19.2,-7.2 c -1.1,-3 -3,-5.7 -5.4,-8 -1.3,1.6 -3,7.9 -4,6.4 -1.4,-4.2 -2.7,-8.3 -4,-12.5 4.3,-1.1 8.6,-2.3 13,-3.4 -0.4,2.3 -4.4,5.3 -1.9,7 9.4,8.5 10.2,24.4 1.5,33.8 -2.8,3.2 -6.5,5.6 -10.5,6.9 -0.4,-1.2 -0.7,-2.5 -1,-3.7 z');
		arrows.addClass('rotation-arrows')
			.transform(`t${x},${y}r${angle}`);
		this.paths[this.paths.length] = arrows;
		return arrows;
	}

	/**
	 * Спрятать фигурки танцоров
	 */
	hideFigures() {
		this.man.addClass('invisible');
		this.man.angle = null;
		this.woman.addClass('invisible');
		this.woman.angle = null;
	}

	/**
	 * Инициализация фигур партнёра и партнёрши
	 */
	initManWoman() {
		if ((!this.man) || (!this.woman)) {
			this.man = this.initFigure('man');
			this.woman = this.initFigure('woman');
		}
	}

	/**
	 * Позиционирование фигуры
	 * @param  {Object} figure Объект фигуры
	 * @param  {Number} x      Координата центра X
	 * @param  {Number} y      Координата центра Y
	 * @param  {Number} angle  Угол поворота (при 0 фигура стоит вертикально)
	 */
	positionFigure(figure, x, y, angle, pairFigure) {
		angle = normalizeAngle(angle);
		if (!figure.angle) {
			figure.angle = angle;
		}
		const angleDiff = figure.angle - angle;
		if ((Math.abs(angleDiff) > FIGURE_ANGLE_TICK) &&
			(Math.abs(angleDiff) < 360 - FIGURE_ANGLE_TICK)) {
			if ((angleDiff > 190) || ((angleDiff < 0) && (angleDiff > -180))) {
				figure.angle = figure.angle + FIGURE_ANGLE_SPEED;
			} else {
				figure.angle = figure.angle - FIGURE_ANGLE_SPEED;
			}
		} else {
			figure.angle = angle;
		}
		figure.angle = normalizeAngle(figure.angle);
		figure.transform(`t${x - figureWidthHalf},${y - figureHeightHalf}r${Math.floor(figure.angle)}`);
		return;
		if (pairFigure) {
			const figureTop = Snap($('.top', figure.node)[0]);
			const figureBBox = figure.getBBox();
			const figureX = figureBBox.x + figureBBox.width / 2;
			const figureY = figureBBox.y + figureBBox.height / 2;
			const pairFigureBBox = pairFigure.getBBox();
			const pairFigureX = pairFigureBBox.x + pairFigureBBox.width / 2;
			const pairFigureY = pairFigureBBox.y + pairFigureBBox.height / 2;
			const lengthX = figureX - pairFigureX;
			const lengthY = figureY - pairFigureY;
			const angleBetweenFigures = Math.atan(lengthY / lengthX) * 180 / Math.PI;
			/**
			 * /'  y1 > y2, x1 < x2 --- 1 / -1 --- -45 + 90 = 45
			 * '\  y1 > y2, x1 > x2 --- 1 / 1 --- 45 + 90 = 135
			 * ./  y1 < y2, x1 > x2 --- -1 / 1 --- -45 - 90 = -135
			 * \.  y1 < y2, x1 < x2 --- -1 / -1 --- 45 - 90 = -45
			 */
			figureTop.transform(`r${angleBetweenFigures - figure.angle}`);
		}
	}

	changeFigureHands(figure, hands) {
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
	animateFigurePath({figure, startAngle = 90, path, startLen, stopLen, timeLength, beats, direction = DIRECTIONS.FORWARD, easing = mina.linear, figureHands = FIGURE_HANDS.CASTANETAS, pairFigure, isLastElement, stepStyle = STEP_STYLE.BASIC, firstLeg = LEGS.LEFT}) {
		// Перенос фигура на верх DOM-а (TODO: Исправить на группировку)
		figure.node.parentNode.appendChild(figure.node);

		let angle = startAngle;
		if ((direction === DIRECTIONS.BACKWARD) || (direction === DIRECTIONS.FROM_END_TO_START)) {
			angle = -angle;
		}
		if (!path) {
			throw new 'path is not drawn yet';
		}

		const pathLength = this.pathLengths.get(path);

		const transformAtLength = length => {
			if (length > pathLength) {
				length = length - pathLength;
			}
			const movePoint = path.getPointAtLength(length);
			const finalAngle = direction === DIRECTIONS.STRAIGHT_FORWARD ? angle : angle + movePoint.alpha;
			this.positionFigure(figure, movePoint.x, movePoint.y, finalAngle, pairFigure);
		};

		transformAtLength(startLen);

		this.changeFigureHands(figure, figureHands);

		$(`.kick`, figure.node)
			.addClass(`invisible`);

		figure.removeClass('invisible');

		// Если последний элемент, доходим быстрее на два шага (на 2/3 базового шага)
		const timeLengthForPath = isLastElement ?
			(beats * 3 - 2) * (timeLength / beats / 3) :
			timeLength;

		return new Promise(resolve => {
			this.animations[this.animations.length] = Snap.animate(startLen, stopLen,
				function (value) { //this - animation element
					if (direction === DIRECTIONS.FROM_END_TO_START) {
						value = startLen + stopLen - value;
					}
					transformAtLength(value);
				}, timeLengthForPath, easing, resolve);

			this.legs.animateFigureTime({figure, timeLength, beats, stepStyle, isLastElement, firstLeg});
		});
	}

	/**
	 * Анимация мужской фигуры по траектории
	 */
	animateMan(options) {
		return this.animateFigurePath({...options, figure: this.man, pairFigure: this.woman});
	}

	/**
	 * Анимация женской фигуры по траектории
	 */
	animateWoman(options) {
		return this.animateFigurePath({...options, figure: this.woman, pairFigure: this.man});
	}

	/**
	 * СОздать path-объект и полоить его в кеш
	 * @param  {String} pathStr      Описание траектории в формате SVG path
	 * @return {Object}              Path-объект траектории
	 */
	createPath(pathStr) {
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
	path(pathStr, gender, hidden) {
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

	manPath(pathStr) {
		return this.path(pathStr, 'man');
	}

	womanPath(pathStr) {
		return this.path(pathStr, 'woman');
	}

	/**
	 * Установить фигуру танцора на определённую позицию
	 * @param  {Object} figure Объект фигуры танцора
	 * @param  {Object} coords Объект с описанием координат {x, y, angle}
	 */
	startPosFigure(figure, coords) {
		figure.angle = null;
		this.changeFigureHands(figure, FIGURE_HANDS.DOWN);
		this.positionFigure(figure, coords.x, coords.y, coords.angle);
		figure.removeClass('invisible');
		$('.leg', figure.node)
			.attr(`transform`, null);
	}

	/**
	 * Установить фигуры танцоров на определённые позиции
	 * @param  {Object} leftCoords  Объект с описанием координат левой позиции {x, y, angle}
	 * @param  {Object} rightCoords Объект с описанием координат правой позиции {x, y, angle}
	 * @param  {String} manPosition Позиция партнёра
	 */
	startPosition(leftCoords, rightCoords, manPosition) {
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
	 * Установить фигуры танцоров на начальные позиции
	 * @param {String} manPosition Позиция партнёра
	 */
	setAtStart(manPosition) {
		this.startPosition(this.startPos.left, this.startPos.right,	manPosition);
	}
}
