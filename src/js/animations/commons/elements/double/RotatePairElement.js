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

	startAnimation(options) {
		return Promise.all([
			this.manDanceAnimationElement.startAnimation({...options, startAngle: options.startAngleMan}),
			this.womanDanceAnimationElement.startAnimation({...options, startAngle: options.startAngleWoman})
		]);
	}

	fullAnimation(options) {
		this.animation.clearPaths();
		this.drawPath(options.manPosition);
		return this.startAnimation(options);
	}
}
