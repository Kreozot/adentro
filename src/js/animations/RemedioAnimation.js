import Promise from 'bluebird';
import EscondidoAnimation from './EscondidoAnimation';
import {zapateoAnimation, zarandeoAnimation} from './GatoAnimation';
import RotatePairElement from './commons/elements/double/RotatePairElement';
import {getOppositePosition} from './commons/utils';

export default class RemedioAnimation extends EscondidoAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			giroCoronacion: new RotatePairElement(this, {
				left: 'M 50,390 200,240',
				right: 'M 390,50 240,200'
			}, 360),

			contragiroCoronacion: new RotatePairElement(this, {
				left: 'M 50,390 200,240',
				right: 'M 390,50 240,200'
			}, -360)
		};
		this.zapateoAnimation = zapateoAnimation.bind(this);
		this.zarandeoAnimation = zarandeoAnimation.bind(this);
	}

	rotateFigure(figure, lengthS, beats, x, y, startAngle, endAngle) {
		const timeLength = lengthS * 1000;
		var angle = startAngle - endAngle;
		if (angle > 360) {
			angle = angle - 360;
		}
		if (angle < -360) {
			angle = angle + 360;
		}
		const angleSpeed = angle / timeLength;

		let self = this;
		return new Promise(resolve => {
			this.animations[this.animations.length] = Snap.animate(0, timeLength,
				function (value) {
					this.lastValue = value;

					self.positionFigure(figure, x, y, startAngle - angleSpeed * value);
				}, timeLength, mina.linear, resolve);

			this.legs.animateFigureTime({figure, timeLength, beats});
		});
	}

	esquina(lengthS, manPosition, beats) {
		this.clearPaths();
		const leftPaths = {
			esquinaPath: 'm 50,390 c 0,0 90,-70 90,-170 C 140,120 50,50 50,50',
			angle: 225
		};
		const topPaths = {
			esquinaPath: 'm 50,50 c 0,0 70,90 170,90 100,0 170,-90 170,-90',
			angle: 315
		};
		const rightPaths = {
			esquinaPath: 'm 390,50 c 0,0 -90,70 -90,170 0,100 90,170 90,170',
			angle: 45
		};
		const bottomPaths = {
			esquinaPath: 'm 390,390 c 0,0 -70,-90 -170,-90 -100,0 -170,90 -170,90',
			angle: 135
		};
		var manPaths;
		var womanPaths;

		switch (manPosition) {
			case 'left':
				manPaths = leftPaths;
				womanPaths = rightPaths;
				break;
			case 'top':
				manPaths = topPaths;
				womanPaths = bottomPaths;
				break;
			case 'right':
				manPaths = rightPaths;
				womanPaths = leftPaths;
				break;
			case 'bottom':
				manPaths = bottomPaths;
				womanPaths = topPaths;
				break;
			default:
				manPaths = leftPaths;
				womanPaths = rightPaths;
		}

		this.clearPaths();

		const manEsquinaPath = this.manPath(manPaths.esquinaPath);
		const womanEsquinaPath = this.womanPath(womanPaths.esquinaPath);

		if ((manPosition == 'left') || (manPosition == 'right')) {
			this.initRotateIcon(50, 50, -45, false);
			this.initRotateIcon(390, 390, -45, false);
		} else {
			this.initRotateIcon(50, 390, -45, false);
			this.initRotateIcon(390, 50, -45, false);
		}

		this.initManWoman();

		const timeLength = lengthS * 1000;
		const manEsquinaPathLength = manEsquinaPath.getTotalLength() - 1;
		const womanEsquinaPathLength = womanEsquinaPath.getTotalLength() - 1;
		const manMovePoint = manEsquinaPath.getPointAtLength(manEsquinaPathLength);
		const womanMovePoint = womanEsquinaPath.getPointAtLength(womanEsquinaPathLength);

		return Promise.all([
			this.animateFigurePath({
				figure: this.man,
				startAngle: 90,
				path: manEsquinaPath,
				startLen: 0,
				stopLen: manEsquinaPathLength,
				timeLength: timeLength * 3 / 4,
				beats: beats * 3 / 4
			}),
			this.animateFigurePath({
				figure: this.woman,
				startAngle: 90,
				path: womanEsquinaPath,
				startLen: 0,
				stopLen: womanEsquinaPathLength,
				timeLength: timeLength * 3 / 4,
				beats: beats * 3 / 4
			})
		]).then(() => Promise.all([
			this.rotateFigure(this.man, lengthS / 4, beats / 4, manMovePoint.x, manMovePoint.y, manMovePoint.alpha + 90, manPaths.angle - 270),
			this.rotateFigure(this.woman, lengthS / 4, beats / 4, womanMovePoint.x, womanMovePoint.y, womanMovePoint.alpha + 90, womanPaths.angle - 270)
		]));
	}

	zapateoZarandeo(lengthS, manPosition, beats) {
		this.clearPaths();

		return Promise.all([
			this.zapateoAnimation(lengthS, manPosition, beats),
			this.zarandeoAnimation(lengthS, manPosition, beats)
		]);
	}

	giroContragiroCoronacion(lengthS, manPosition, beats) {
		this.clearPaths();
		const startAngleMan = this.startPos[manPosition].angle;
		const startAngleWoman = this.startPos[getOppositePosition(manPosition)].angle;
		this.elements.giroCoronacion.drawPath(manPosition);
		this.elements.contragiroCoronacion.drawPath(manPosition, true);

		this.initRotateIcon(87, 352, 45, false);
		this.initRotateIcon(352, 87, 45, false);
		this.initRotateIcon(162, 277, 45, true);
		this.initRotateIcon(277, 162, 45, true);

		return this.elements.giroCoronacion.startAnimation({
			lengthS: lengthS / 2,
			beats: beats / 2,
			startAngleMan,
			startAngleWoman,
			startPart: 0,
			stopPart: 0.5
		})
			.then(() => this.elements.contragiroCoronacion.startAnimation({
				lengthS: lengthS / 2,
				beats: beats / 2,
				startAngleMan,
				startAngleWoman,
				startPart: 0.5,
				stopPart: 1,
				isLastElement: true
			}));
	}
}
