import ZambaAnimation from './ZambaAnimation';
import {directions} from './commons/DanceAnimation';
import PairElement from './commons/elements/double/PairElement';
import {getOppositePosition} from './commons/utils';

export default class ZambaSimpleAnimation extends ZambaAnimation {
	constructor(id) {
		super(id);

		this.elements = {
			...this.elements,

			arrestoSimple: new PairElement(this, {
				left: 'm 40,160 c 0,40 80,80 160,80 80,0 160,-40 160,-80 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 z',
				right: 'm 560,160 c 0,-40 -80,-80 -160,-80 -80,0 -160,40 -160,80 0,40 80,80 160,80 80,0 160,-40 160,-80 z'
			}),

			coronacion: new PairElement(this, {
				left: 'm 40,160 230,0',
				right: 'm 560,160 -230,0'
			})
		};

		this.vueltaGato = this.vuelta;
		this.arresto2 = this.arresto;
	}

	mediaVuelta(lengthS, manPosition, beats) {
		this.elements.mediaVuelta.setAngle(-45);
		return this.elements.mediaVuelta.fullAnimation({lengthS, beats, manPosition});
	}

	vuelta(lengthS, manPosition, beats) {
		this.elements.vuelta.setAngle(-45);
		return this.elements.vuelta.fullAnimation({lengthS, beats, manPosition});
	}

	arresto(lengthS, manPosition, beats) {
		this.elements.arrestoSimple.setAngle(-45);
		return this.elements.arrestoSimple.fullAnimation({lengthS, beats, manPosition});
	}

	arrestoDoble(lengthS, manPosition, beats) {
		this.elements.mediaVueltaToArresto.setAngle(-45);
		this.elements.arresto.setAngle(45);
		this.elements.arrestoBack.setAngle(-45);

		this.clearPaths();
		this.elements.mediaVueltaToArresto.drawPath(manPosition);
		this.elements.arresto.drawPath(manPosition);
		this.elements.arrestoBack.drawPath(manPosition);

		return this.elements.mediaVueltaToArresto.startAnimation({
			lengthS: lengthS / 4,
			beats: beats / 4
		})
			.then(() => this.elements.arresto.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4,
				direction: directions.BACKWARD,
				startPart: 1,
				stopPart: 0
			}))
			.then(() => this.elements.arresto.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4
			}))
			.then(() => this.elements.arrestoBack.startAnimation({
				lengthS: lengthS / 4,
				beats: beats / 4
			}));
	}

	mediaVueltaCoronacion(lengthS, manPosition, beats) {
		this.elements.mediaVuelta.setAngle(-45);

		this.clearPaths();
		this.elements.mediaVuelta.drawPath(manPosition);
		this.elements.coronacion.drawPath(getOppositePosition(manPosition));

		return this.elements.mediaVuelta.startAnimation({
			lengthS: lengthS * 4 / beats,
			beats: 4
		})
			.then(() => this.elements.coronacion.startAnimation({
				lengthS: lengthS * 3 / beats,
				beats: 3,
				isLastElement: true
			}));
	}
}
