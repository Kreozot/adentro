import Promise from 'bluebird';
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
		return this.animation.animateFigureTime(this.figure, lengthMs, beats * 6);
	}

	startAnimation(options) {
		const {lengthS, beats, startAngle, startPart = 0, stopPart = 1} = options;

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

		return new Promise(resolve => {
			this.animation.animations[this.animation.animations.length] = Snap.animate(startLen, stopLen,
				function (value) { //this - animation element
					this.lastValue = value;
					transformAtLength(value);
				}, lengthS * 1000, mina.linear, resolve);

			this.animation.animateFigureTime(this.figure, lengthS * 1000, beats);
		});
	}
}
