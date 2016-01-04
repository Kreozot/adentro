import EscondidoAnimation from './EscondidoAnimation.js';
import {RotateDanceAnimationElement} from './commons/elements.js';
import {getOppositePosition, Timer} from './commons/utils.js';

export default class RemedioAnimation extends EscondidoAnimation {
	constructor(id) {
		super(id);

		this.giroCoronacionElement = new RotateDanceAnimationElement(this,
			{left: 'M 50,390 200,240',
			right: 'M 390,50 240,200'}, 360);
		this.contragiroCoronacionElement = new RotateDanceAnimationElement(this,
			{left: 'M 50,390 200,240',
			right: 'M 390,50 240,200'}, -360);
	}

	rotateFigure(figure, seconds, beats, x, y, startAngle, endAngle) {
		const timeLength = seconds * 1000;
		var angle = startAngle - endAngle;
		if (angle > 360) {
			angle = angle - 360;
		}
		if (angle < -360) {
			angle = angle + 360;
		}
		const angleSpeed = angle / timeLength;

		let self = this;
		this.animations[this.animations.length] = Snap.animate(0, timeLength,
			function (value) {
				this.lastValue = value;

				self.positionFigure(figure, x, y, startAngle - angleSpeed * value);
			}, timeLength, mina.linear);

		this.animateFigureTime(figure, timeLength, beats);
	}

	esquina(seconds, manPosition, beats) {
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

		const timeLength = seconds * 1000;

		this.animateFigurePath(this.man, 90, manEsquinaPath, 0, manEsquinaPath.getTotalLength() - 1,
			timeLength * 3 / 4, beats * 3 / 4);
		this.animateFigurePath(this.woman, 90, womanEsquinaPath, 0, womanEsquinaPath.getTotalLength() - 1,
			timeLength * 3 / 4, beats * 3 / 4);

		this.timeouts[this.timeouts.length] = new Timer(() => {
			const manMovePoint = manEsquinaPath.getPointAtLength(manEsquinaPath.getTotalLength() - 1);
			const womanMovePoint = womanEsquinaPath.getPointAtLength(womanEsquinaPath.getTotalLength() - 1);

			this.rotateFigure(this.man, seconds / 4, beats / 4,
				manMovePoint.x, manMovePoint.y, manMovePoint.alpha + 90, manPaths.angle - 270);
			this.rotateFigure(this.woman, seconds / 4, beats / 4,
				womanMovePoint.x, womanMovePoint.y, womanMovePoint.alpha + 90, womanPaths.angle - 270);
		}, timeLength * 3 / 4);
	}

	zapateoZarandeo(seconds, manPosition, beats) {
		this.clearPaths();
		this.zarandeoElement.drawPath(getOppositePosition(manPosition));
		const parts = beats >= 8 ? 4 : 2;
		const partSeconds = seconds / parts;
		const partBeats = beats / parts;
		this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds, 0.5, 1);
		if (beats >= 8) {
			this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_FORWARD, partSeconds * 2, 0, 0.5);
			this.zarandeoElement.startAnimation(partSeconds, partBeats, this.DIRECTION_BACKWARD, partSeconds * 3, 0.5, 1);
		}

		this.zapateoElement.drawPath(manPosition);
		this.zapateoElement.startAnimation(seconds, beats);
	}

	giroContragiroCoronacion(seconds, manPosition, beats) {
		this.clearPaths();
		const partSeconds = seconds / 2;
		const partBeats = beats / 2;
		const manAngle = this.startPos[manPosition].angle;
		const womanAngle = this.startPos[getOppositePosition(manPosition)].angle;
		this.giroCoronacionElement.drawPath(manPosition);
		this.contragiroCoronacionElement.drawPath(manPosition, true);

		this.initRotateIcon(87, 352, 45, false);
		this.initRotateIcon(352, 87, 45, false);
		this.initRotateIcon(162, 277, 45, true);
		this.initRotateIcon(277, 162, 45, true);

		this.giroCoronacionElement.startAnimation(partSeconds, partBeats, manAngle, womanAngle, this.DIRECTION_FORWARD, 0, 0, 0.5);
		this.contragiroCoronacionElement.startAnimation(partSeconds, partBeats, manAngle, womanAngle, this.DIRECTION_FORWARD, partSeconds, 0.5, 1);
	}
}
