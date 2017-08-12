import Promise from 'bluebird';
import GatoAnimation from './GatoAnimation';
import SingleElement from './commons/elements/single/SingleElement';
import PairElement from './commons/elements/double/PairElement';
import ZapateoElement from './commons/elements/single/ZapateoElement';
import {DIRECTIONS, FIGURE_HANDS} from './commons/const';
import {getOppositePosition} from './commons/utils';

class HuellaManAnimationElement extends SingleElement {
	constructor(animation, pathStrings, gender, figure) {
		super(animation, pathStrings, gender, figure);

		this.animationFunction = function ({lengthMs, beats, startPart = 0, stopPart = 1, figureHands = FIGURE_HANDS.CASTANETAS}) {
			return this.animation.animateFigurePath({
				figure: this.figure,
				startAngle: this.position === 'left' ? -90 : 90,
				path: this.path,
				startLen: this.pathLength * startPart,
				stopLen: this.pathLength * stopPart,
				timeLength: lengthMs,
				beats,
				figureHands,
				direction: DIRECTIONS.STRAIGHT_FORWARD
			});
		};
	}
}

export default class HuellaAnimation extends GatoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			avance: new PairElement(this, {
				left: 'M 40,160 140,260 240,160 140,60 z',
				right: 'M 560,160 460,60 360,160 460,260 z'
			}),

			zapateo: new ZapateoElement(this, this.man, {
				left: 'm 40,160 320,0',
				right: 'm 560,160 -320,0'
			}),

			manGiro1: new HuellaManAnimationElement(this, {
				left: 'm 360,160 40,-40',
				right: 'm 240,160 -40,40'
			}, 'man', this.man),

			manGiro2: new HuellaManAnimationElement(this, {
				left: 'm 400,120 c 0,0 -100,0 -100,40 0,40 100,40 100,40',
				right: 'm 200,200 c 0,0 100,0 100,-40 0,-40 -100,-40 -100,-40'
			}, 'man', this.man),

			manGiro3: new HuellaManAnimationElement(this, {
				left: 'm 400,200 c 0,0 -100,-40 -360,-40',
				right: 'm 200,120 c 0,0 100,40 360,40'
			}, 'man', this.man),

			manGiro1_contra: new HuellaManAnimationElement(this, {
				left: 'm 360,160 40,40',
				right: 'M 240,160 200,120'
			}, 'man', this.man),

			manGiro2_contra: new HuellaManAnimationElement(this, {
				left: 'm 400,200 c 0,0 -100,0 -100,-40 0,-40 100,-40 100,-40',
				right: 'm 200,120 c 0,0 100,0 100,40 0,40 -100,40 -100,40'
			}, 'man', this.man),

			manGiro3_contra: new HuellaManAnimationElement(this, {
				left: 'm 400,120 c 0,0 -100,40 -360,40',
				right: 'm 200,200 c 0,0 100,-40 360,-40'
			}, 'man', this.man),

			womanGiro: new SingleElement(this, {
				left: 'm 40,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 C 240,80 200,40 140,40 80,40 40,80 40,140 z',
				right: 'M 560,140 C 560,80 520,40 460,40 400,40 360,80 360,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 z'
			}, 'woman', this.woman),

			mediaContraVueltaMan: new SingleElement(this, {
				left: 'M 560,160 C 560,110 440,40 300,40 160,40 40,110 40,160',
				right: 'm 40,160 c 0,50 120,120 260,120 140,0 260,-70 260,-120'
			}, 'man', this.man),

			mediaContraVueltaWoman: new SingleElement(this, {
				left: 'M 560,160 C 560,110 440,40 300,40 160,40 40,110 40,160',
				right: 'm 40,160 c 0,50 120,120 260,120 140,0 260,-70 260,-120'
			}, 'woman', this.woman)
		};
	}

	giroMano(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.womanGiro.drawPath(getOppositePosition(manPosition));
		this.elements.manGiro1.drawPath(manPosition);
		this.elements.manGiro2.drawPath(manPosition);
		this.elements.manGiro3.drawPath(manPosition);

		const womanPromise = this.elements.womanGiro.startAnimation({
			lengthS,
			beats
		});
		const manPromise = this.elements.manGiro1.startAnimation({
			lengthS: lengthS / 4,
			beats: beats / 4,
			direction: DIRECTIONS.STRAIGHT_FORWARD
		})
			.then(() => this.elements.manGiro2.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2,
				direction: DIRECTIONS.STRAIGHT_FORWARD
			}))
			.then(() => this.elements.manGiro3.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				direction: DIRECTIONS.STRAIGHT_FORWARD
			}));

		return Promise.all([womanPromise, manPromise]);
	}

	contraGiroMano(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.womanGiro.drawPath(getOppositePosition(manPosition));
		this.elements.manGiro1_contra.drawPath(manPosition);
		this.elements.manGiro2_contra.drawPath(manPosition);
		this.elements.manGiro3_contra.drawPath(manPosition);

		const womanPromise = this.elements.womanGiro.startAnimation({
			lengthS,
			beats,
			direction: DIRECTIONS.BACKWARD,
			startPart: 1,
			stopPart: 0
		});
		const manPromise = this.elements.manGiro1_contra.startAnimation({
			lengthS: lengthS / 4,
			beats: beats / 4,
			direction: DIRECTIONS.STRAIGHT_FORWARD
		})
			.then(() => this.elements.manGiro2_contra.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2,
				direction: DIRECTIONS.STRAIGHT_FORWARD
			}))
			.then(() => this.elements.manGiro3_contra.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				direction: DIRECTIONS.STRAIGHT_FORWARD
			}));

		return Promise.all([womanPromise, manPromise]);
	}

	mediaContraVuelta(lengthS, manPosition, beats) {
		this.clearPaths();
		this.elements.mediaContraVueltaMan.drawPath(manPosition);
		this.elements.mediaContraVueltaWoman.drawPath(getOppositePosition(manPosition));

		return Promise.all([
			this.elements.mediaContraVueltaMan.startAnimation({
				lengthS,
				beats,
				direction: DIRECTIONS.FORWARD,
				startPart: 1,
				stopPart: 0
			}),
			this.elements.mediaContraVueltaWoman.startAnimation({
				lengthS,
				beats,
				direction: DIRECTIONS.BACKWARD,
				startPart: 1,
				stopPart: 0
			})
		]);
	}
}
