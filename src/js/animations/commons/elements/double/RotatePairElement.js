import Promise from 'bluebird';
import PairElement from './PairElement';
import RotateElement from '../single/RotateElement';

/**
 * Парная анимация для продвижения с вращением
 * @param {Object} animation   Объект анимации
 * @param {String} pathStrings Строковое описание траекторий в формате [позиция: траектория, ...]
 * @param {Number} rotateAngle Угол поворота
 */
export default class RotatePairElement extends PairElement {
	constructor(animation, pathStrings, rotateAngle) {
		super(animation, pathStrings, rotateAngle);

		this.manDanceAnimationElement = new RotateElement(animation, pathStrings, 'man', undefined, rotateAngle);
		this.womanDanceAnimationElement = new RotateElement(animation, pathStrings, 'woman', undefined, rotateAngle);
	}

	startAnimation(lengthS, beats, startAngleMan, startAngleWoman, direction, delay, startPart, stopPart) {
		return Promise.all([
			this.manDanceAnimationElement.startAnimation(lengthS, beats, startAngleMan, direction, delay, startPart, stopPart),
			this.womanDanceAnimationElement.startAnimation(lengthS, beats, startAngleWoman, direction, delay, startPart, stopPart)
		]);
	}

	fullAnimation(lengthS, beats, startAngleMan, startAngleWoman, manPosition, direction, delay, startPart, stopPart) {
		this.animation.clearPaths();
		this.drawPath(manPosition);
		return this.startAnimation(lengthS, beats, startAngleMan, startAngleWoman, direction, 0, startPart, stopPart);
	}
}
