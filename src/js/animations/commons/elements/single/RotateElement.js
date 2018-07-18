import Promise from 'bluebird';
import {FIGURE_HANDS} from 'js/animations/commons/const';
import SingleElement from './SingleElement';

/**
 * Продвижение с вращением
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {String} gender      Пол: "man"; "woman"
 * @param {Object} figure      Объект фигуры анимации
 * @param {Number} rotateAngle Угол поворота
 */
export default class RotateElement extends SingleElement {
	constructor(animation, pathStrings, gender, figure, rotateAngle) {
		super(animation, pathStrings, gender, figure, rotateAngle);

		this.rotateAngle = rotateAngle;
	}

	animationFunction({lengthMs, beats}) {
		this.animation.startPosFigure(this.figure, this.animation.startPos[this.position]);
		return this.animation.legs.animateFigureTime({
			figure: this.figure,
			timeLength: lengthMs,
			beats: beats * 6
		});
	}

	startAnimation({lengthS, beats, startAngle, startPart = 0, stopPart = 1, figureHands = FIGURE_HANDS.CASTANETAS}) {
		const angle = startAngle;
		const startLen = this.pathLength * startPart;
		const stopLen = this.pathLength * stopPart;
		const angleSpeed = this.rotateAngle / (stopLen - startLen);

		const transformAtLength = (length) => {
			const movePoint = this.path.getPointAtLength(length);
			this.animation.positionFigure({
				figure: this.figure,
				x: movePoint.x,
				y: movePoint.y,
				angle: angle - angleSpeed * (length - startLen)
			});
		};

		transformAtLength(startLen);

		this.animation.changeFigureHands(this.figure, figureHands);

		$(`.kick`, this.figure.node)
			.addClass(`invisible`);

		this.figure.removeClass('invisible');

		return new Promise(resolve => {
			this.animation.animations[this.animation.animations.length] = Snap.animate(startLen, stopLen,
				function (value) { //this - animation element
					this.lastValue = value;
					transformAtLength(value);
				}, lengthS * 1000, mina.linear, resolve);

			this.animation.legs.animateFigureTime({
				figure: this.figure,
				timeLength: lengthS * 1000,
				beats
			});
		});
	}
}
