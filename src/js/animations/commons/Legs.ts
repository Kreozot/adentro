import * as Promise from 'bluebird';
import * as Snap from 'snapsvg';

import { EasingFunction, Figure } from './AnimationTypes';
import { FIGURE_HANDS, LEGS, STEP_STYLE } from './const';

// Амплитуда шага в пикселях (в одну сторону)
const FIGURE_STEP_AMPLITUDE = 13;

export default class Legs {
	animations: mina.MinaAnimation[];

	constructor(animations) {
		this.animations = animations;
	}

	moveLeg(figure, legStr, value) {
		figure.select(`.leg--${legStr}`)
			.transform(`translate(0, ${value})`);
	}

	animateLeg({
		figure,
		legStr,
		duration,
		transformFrom,
		transformTo,
		easing = mina.linear
	}: {
		figure: Figure;
		legStr: string;
		duration: number;
		transformFrom: number;
		transformTo: number;
		easing?
		: EasingFunction;
	}) {
		return new Promise((resolve) => {
			this.animations.push(Snap.animate(
				transformFrom,
				transformTo,
				(value) => this.moveLeg(figure, legStr, value),
				duration,
				easing,
				() => {
					resolve();
				})
			);
		});
	}

	kick(figure, legStr, kickType) {
		$(`.kick`, figure.node)
			.addClass(`invisible`);
		$(`.kick--${legStr}.kick--${kickType}`, figure.node)
			.removeClass(`invisible`);
	}

	getOppositeLeg(leg) {
		return leg === LEGS.LEFT ? LEGS.RIGHT : LEGS.LEFT;
	}

	async animateLegsRepeat({
		figure,
		legStr,
		stepDuration,
		stepsLeft
	}) {
		if (stepsLeft < 1) {
			return;
		}
		const oppositeLegStr = this.getOppositeLeg(legStr);

		await Promise.all([
			this.animateLeg({
				figure,
				legStr,
				duration: stepDuration,
				transformFrom: FIGURE_STEP_AMPLITUDE,
				transformTo: -FIGURE_STEP_AMPLITUDE
			}),
			this.animateLeg({
				figure,
				legStr: oppositeLegStr,
				duration: stepDuration,
				transformFrom: -FIGURE_STEP_AMPLITUDE,
				transformTo: FIGURE_STEP_AMPLITUDE
			})
		]);
		await this.animateLegsRepeat({
			figure,
			legStr: oppositeLegStr,
			stepDuration,
			stepsLeft: stepsLeft - 1
		});
	}

	animateLegsRepeatZapateo({
		figure,
		legStr,
		stepDuration,
		stepsLeft
	}) {
		if (stepsLeft < 1) {
			return Promise.resolve();
		}
		const oppositeLegStr = this.getOppositeLeg(legStr);

		// Па!
		this.kick(figure, oppositeLegStr, 'back');
		const resultPromise = this.animateLeg({
			figure,
			legStr: oppositeLegStr,
			duration: stepDuration,
			transformFrom: FIGURE_STEP_AMPLITUDE,
			transformTo: 0,
			easing: mina.easeout
		})
			.delay(stepDuration);
		if (stepsLeft === 1) {
			return resultPromise;
		}
		// Па-
		return resultPromise.then(() => {
			this.kick(figure, legStr, 'front');
			return this.animateLeg({
				figure,
				legStr,
				duration: stepDuration,
				transformFrom: 0,
				transformTo: FIGURE_STEP_AMPLITUDE
			});
		})
			// Пи-
			.then(() => {
				this.kick(figure, legStr, 'back');
				return this.animateLeg({
					figure,
					legStr,
					duration: stepDuration,
					transformFrom: FIGURE_STEP_AMPLITUDE,
					transformTo: 0,
					easing: mina.easeout
				});
			})
			// То-
			.then(() => {
				this.kick(figure, oppositeLegStr, 'back');
			})
			.delay(stepDuration)
			// Па-
			.then(() => {
				this.kick(figure, legStr, 'front');
				return this.animateLeg({
					figure,
					legStr,
					duration: stepDuration,
					transformFrom: 0,
					transformTo: FIGURE_STEP_AMPLITUDE
				});
			})
			.then(() => this.animateLegsRepeatZapateo({
				figure,
				legStr: oppositeLegStr,
				stepDuration,
				stepsLeft: stepsLeft - 1
			}));
	}

	async animateLegsRepeatZamba({
		figure,
		legStr,
		stepDuration,
		stepsLeft
	}) {
		if (stepsLeft < 1) {
			return Promise.resolve();
		}
		const oppositeLegStr = this.getOppositeLeg(legStr);

		await Promise.all([
			this.animateLeg({
				figure,
				legStr,
				duration: stepDuration * 2,
				transformFrom: FIGURE_STEP_AMPLITUDE,
				transformTo: -FIGURE_STEP_AMPLITUDE,
			}),
			this.animateLeg({
				figure,
				legStr: oppositeLegStr,
				duration: stepDuration * 2,
				transformFrom: -FIGURE_STEP_AMPLITUDE,
				transformTo: FIGURE_STEP_AMPLITUDE,
			})
		]);
		await Promise.all([
			this.animateLeg({
				figure,
				legStr: oppositeLegStr,
				duration: stepDuration,
				transformFrom: FIGURE_STEP_AMPLITUDE,
				transformTo: -FIGURE_STEP_AMPLITUDE,
			}),
			this.animateLeg({
				figure,
				legStr,
				duration: stepDuration,
				transformFrom: -FIGURE_STEP_AMPLITUDE,
				transformTo: FIGURE_STEP_AMPLITUDE,
			})
		]);
		await this.animateLegsRepeatZamba({
			figure,
			legStr,
			stepDuration,
			stepsLeft: stepsLeft - 1
		});
	}

	animateFigureTimeZapateo(figure, timeLength, beats) {
		return this.animateLegsRepeatZapateo({
			figure,
			legStr: LEGS.RIGHT,
			stepDuration: timeLength / beats / 6,
			stepsLeft: beats
		})
			.finally(() => {
				$(`.kick`, figure.node)
					.addClass(`invisible`);
			});
	}

	animateFigureTimeBasic(figure, timeLength, beats, firstLeg, isLastElement) {
		const stepDuration = timeLength / beats / 3;
		// Если последний элемент, анимируем меньше на два шага (на 2/3 базового шага)
		const steps = isLastElement ? (beats * 3 - 2) : (beats * 3);
		return this.animateLegsRepeat({
			figure,
			legStr: firstLeg,
			stepDuration,
			stepsLeft: steps
		});
	}

	animateFigureTimeZamba(figure, timeLength, beats, firstLeg) {
		return this.animateLegsRepeatZamba({
			figure,
			legStr: firstLeg,
			stepDuration: timeLength / beats / 3,
			stepsLeft: beats
		});
	}

	animateFigureTimeSimple(figure, timeLength, beats, firstLeg) {
		return this.animateLegsRepeat({
			figure,
			legStr: firstLeg,
			stepDuration: timeLength / beats,
			stepsLeft: beats
		});
	}

	/**
	 * Анимация фигур в такт
	 * @param  {Object}  figure     Объект фигуры
	 * @param  {Number}  timeLength Длительность отрезка
	 * @param  {Number}  beats      Количество тактов отрезка
	 * @param  {Number}  stepStyle  Стиль шага
	 * @param  {Boolean} isLastElement Это последний элемент музкальной части
	 */
	public animateFigureTime({
		figure,
		timeLength,
		beats,
		stepStyle,
		isLastElement,
		firstLeg = LEGS.LEFT,
		figureHands
	}: {
		figure: Figure;
		timeLength: number;
		beats: number;
		stepStyle: STEP_STYLE;
		isLastElement: boolean;
		firstLeg?: LEGS;
		figureHands?: FIGURE_HANDS;
	}) {
		if (figureHands) {
			$(`.hands:not(.hands--${figureHands})`, figure.node).addClass('invisible');
			$(`.hands--${figureHands}`, figure.node).removeClass('invisible');
		}
		switch (stepStyle) {
			case STEP_STYLE.ZAPATEO:
				return this.animateFigureTimeZapateo(figure, timeLength, beats);
			case STEP_STYLE.SIMPLE:
				return this.animateFigureTimeSimple(figure, timeLength, beats, firstLeg);
			case STEP_STYLE.ZAMBA:
				return this.animateFigureTimeZamba(figure, timeLength, beats, firstLeg);
			default:
				return this.animateFigureTimeBasic(figure, timeLength, beats, firstLeg, isLastElement);
		}
	}

}
