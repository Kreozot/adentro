import Promise from 'bluebird';
import {LEGS, STEP_STYLE} from './const';

// Амплитуда шага в пикселях (в одну сторону)
const FIGURE_STEP_AMPLITUDE = 13;

export default class Legs {
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
	}) {
		return new Promise((resolve) => {
			this.animations.push(Snap.animate(
				transformFrom,
				transformTo,
				(value) => this.moveLeg(figure, legStr, value),
				duration,
				easing,
				resolve)
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

	animateLegsRepeat(figure, legStr, stepDuration, stepsLeft) {
		if (stepsLeft < 1) {
			return;
		}
		const oppositeLegStr = this.getOppositeLeg(legStr);

		return Promise.all([
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
		])
			.then(() => this.animateLegsRepeat(figure, oppositeLegStr, stepDuration, stepsLeft - 1));
	}

	animateLegsRepeatZapateo(figure, legStr, stepDuration, stepsLeft) {
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
			.then(() => this.animateLegsRepeatZapateo(figure, oppositeLegStr, stepDuration, stepsLeft - 1));
	}

	animateLegsRepeatZamba(figure, legStr, stepDuration, stepsLeft) {
		if (stepsLeft < 1) {
			return Promise.resolve();
		}
		const oppositeLegStr = this.getOppositeLeg(legStr);

		return Promise.all([
			this.animateLeg(figure, legStr, stepDuration * 2, FIGURE_STEP_AMPLITUDE, -FIGURE_STEP_AMPLITUDE, mina.linear),
			this.animateLeg(figure, oppositeLegStr, stepDuration * 2, -FIGURE_STEP_AMPLITUDE, FIGURE_STEP_AMPLITUDE, mina.linear)
		])
			.then(() => Promise.all([
				this.animateLeg(figure, oppositeLegStr, stepDuration, FIGURE_STEP_AMPLITUDE, -FIGURE_STEP_AMPLITUDE, mina.linear),
				this.animateLeg(figure, legStr, stepDuration, -FIGURE_STEP_AMPLITUDE, FIGURE_STEP_AMPLITUDE, mina.linear)
			]))
			.then(() => this.animateLegsRepeatZamba(figure, legStr, stepDuration, stepsLeft - 1));
	}

	animateFigureTimeZapateo(figure, timeLength, beats) {
		return this.animateLegsRepeatZapateo(figure, LEGS.RIGHT, timeLength / beats / 6, beats)
			.finally(() => {
				$(`.kick`, figure.node)
					.addClass(`invisible`);
			});
	}

	animateFigureTimeBasic(figure, timeLength, beats, firstLeg, isLastElement) {
		const stepDuration = timeLength / beats / 3;
		// Если последний элемент, анимируем меньше на два шага (на 2/3 базового шага)
		const steps = isLastElement ? (beats * 3 - 2) : (beats * 3);
		this.animateLegsRepeat(figure, firstLeg, stepDuration, steps);
	}

	animateFigureTimeZamba(figure, timeLength, beats, firstLeg) {
		this.animateLegsRepeatZamba(figure, firstLeg, timeLength / beats / 3, beats);
	}

	animateFigureTimeSimple(figure, timeLength, beats, firstLeg) {
		this.animateLegsRepeat(figure, firstLeg, timeLength / beats, beats);
	}

	/**
	 * Анимация фигур в такт
	 * @param  {Ojbect}  figure     Объект фигуры
	 * @param  {Number}  timeLength Длительность отрезка
	 * @param  {Number}  beats      Количество тактов отрезка
	 * @param  {Number}  stepStyle  Стиль шага
	 * @param  {Boolean} isLastElement Это последний элемент музкальной части
	 */
	animateFigureTime({
		figure,
		timeLength,
		beats,
		stepStyle,
		isLastElement,
		firstLeg = LEGS.LEFT,
		figureHands
	}) {
		if (figureHands) {
			$(`.hands:not(.hands--${figureHands})`, figure.node).addClass('invisible');
			$(`.hands--${figureHands}`, figure.node).removeClass('invisible');
		}
		switch (stepStyle) {
			case STEP_STYLE.ZAPATEO:
				this.animateFigureTimeZapateo(figure, timeLength, beats);
				break;
			case STEP_STYLE.SIMPLE:
				this.animateFigureTimeSimple(figure, timeLength, beats, firstLeg);
				break;
			case STEP_STYLE.ZAMBA:
				this.animateFigureTimeZamba(figure, timeLength, beats, firstLeg);
				break;
			default:
				this.animateFigureTimeBasic(figure, timeLength, beats, firstLeg, isLastElement);
		}
	}

}
