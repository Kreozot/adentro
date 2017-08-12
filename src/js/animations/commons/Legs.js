const FIGURE_STEP_AMPLITUDE = 26;

export const STEP_STYLE = {
	BASIC: 0,
	ZAPATEO: 1,
	SIMPLE: 2,
	ZAMBA: 3
};

export const LEGS = {
	LEFT: 'left',
	RIGHT: 'right'
};

export default class Legs {
	constructor(animations) {
		this.animations = animations;
	}

	moveLeg(figure, legStr, value) {
		figure.select(`.leg--${legStr}`)
			.transform(`translate(0, ${value})`);
	}

	animateLeg(figure, legStr, duration, transformFrom, transformTo, easing = mina.linear) {
		return new Promise(resolve => {
			this.animations.push(Snap.animate(transformFrom, transformTo, value => this.moveLeg(figure, legStr, value), duration, easing, resolve));
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

	animateLegs(figure, legStr, stepDuration, stepsLeft) {
		if (stepsLeft < 1) {
			return;
		}
		$(`.kick`, figure.node)
			.addClass(`invisible`);
		const self = this;
		const oppositeLegStr = this.getOppositeLeg(legStr);

		this.animations[this.animations.length] = Snap.animate(-FIGURE_STEP_AMPLITUDE / 2, FIGURE_STEP_AMPLITUDE / 2, function (value) {
			self.moveLeg(figure, legStr, value);
			self.moveLeg(figure, oppositeLegStr, -value);
		}, stepDuration, mina.linear, () => {
			self.animateLegs(figure, oppositeLegStr, stepDuration, stepsLeft - 1);
		});
	}

	animateLegsZapateo(figure, legStr, stepDuration, stepsLeft) {
		if (stepsLeft < 1) {
			return Promise.resolve();
		}
		const oppositeLegStr = this.getOppositeLeg(legStr);
		const transformFrom = 0;
		const transformTo = FIGURE_STEP_AMPLITUDE / 2;

		this.kick(figure, oppositeLegStr, 'back');
		return this.animateLeg(figure, oppositeLegStr, stepDuration, transformTo, transformFrom, mina.easeout)
			.delay(stepDuration)
			.then(() => {
				this.kick(figure, legStr, 'front');
				return this.animateLeg(figure, legStr, stepDuration, transformFrom, transformTo);
			})
			.then(() => {
				this.kick(figure, legStr, 'back');
				return this.animateLeg(figure, legStr, stepDuration, transformTo, transformFrom, mina.easeout);
			})
			.then(() => {
				this.kick(figure, oppositeLegStr, 'back');
			})
			.delay(stepDuration)
			.then(() => {
				this.kick(figure, legStr, 'front');
				return this.animateLeg(figure, legStr, stepDuration, transformFrom, transformTo);
			})
			.then(() => this.animateLegsZapateo(figure, oppositeLegStr, stepDuration, stepsLeft - 1));
	}

	animateLegsZamba(figure, legStr, stepDuration, stepsLeft) {
		if (stepsLeft < 1) {
			return Promise.resolve();
		}
		const oppositeLegStr = this.getOppositeLeg(legStr);
		const transformFrom = 0;
		const transformTo = FIGURE_STEP_AMPLITUDE / 2;

		return this.animateLeg(figure, legStr, stepDuration * 2, transformFrom, transformTo)
			.then(() => this.animateLeg(figure, oppositeLegStr, stepDuration, transformFrom, transformTo))
			.then(() => this.animateLegsZapateo(figure, legStr, stepDuration, stepsLeft - 1));
	}

	animateFigureTimeZapateo(figure, timeLength, beats) {
		$(`.hands:not(.hands--${FIGURE_HANDS.DOWN})`, figure.node).addClass('invisible');
		$(`.hands--${FIGURE_HANDS.DOWN}`, figure.node).removeClass('invisible');

		return this.animateLegsZapateo(figure, LEGS.RIGHT, timeLength / beats / 6, beats)
			.finally(() => {
				$(`.kick`, figure.node)
					.addClass(`invisible`);
			});
	}

	animateFigureTimeBasic(figure, timeLength, beats, isLastElement) {
		const stepDuration = timeLength / beats / 3;
		// Если последний элемент, анимируем меньше на два шага (на 2/3 базового шага)
		const steps = isLastElement ? (beats * 3 - 2) : (beats * 3);
		this.animateLegs(figure, LEGS.LEFT, stepDuration, steps);
	}

	animateFigureTimeZamba(figure, timeLength, beats) {
		const stepDuration = timeLength / beats / 3;
		// Если последний элемент, анимируем меньше на два шага (на 2/3 базового шага)
		const steps = isLastElement ? (beats * 3 - 2) : (beats * 3);
		this.animateLegsZamba(figure, LEGS.LEFT, stepDuration, steps);
	}

	animateFigureTimeSimple(figure, timeLength, beats) {
		this.animateLegs(figure, LEGS.LEFT, timeLength / beats, beats);
	}

	/**
	 * Анимация фигур в такт
	 * @param  {Ojbect}  figure     Объект фигуры
	 * @param  {Number}  timeLength Длительность отрезка
	 * @param  {Number}  beats      Количество тактов отрезка
	 * @param  {Number}  stepStyle  Стиль шага
	 * @param  {Boolean} isLastElement Это последний элемент музкальной части
	 */
	animateFigureTime({figure, timeLength, beats, stepStyle, isLastElement}) {
		switch (stepStyle) {
			case STEP_STYLE.ZAPATEO:
				this.animateFigureTimeZapateo(figure, timeLength, beats);
				break;
			case STEP_STYLE.SIMPLE:
				this.animateFigureTimeSimple(figure, timeLength, beats);
				break;
			case STEP_STYLE.ZAMBA:
				this.animateFigureTimeZamba(figure, timeLength, beats);
				break;
			default:
				this.animateFigureTimeBasic(figure, timeLength, beats, isLastElement);
		}
	}

}
