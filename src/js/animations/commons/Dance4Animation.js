import DanceAnimation from './DanceAnimation';
import PairElement from './double/PairElement';

export default class Dance4Animation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.man2 = this.initFigure('man');
		this.woman2 = this.initFigure('woman');
	}

	hideFigures() {
		this.man.addClass('invisible');
		this.woman.addClass('invisible');
		this.man2.addClass('invisible');
		this.woman2.addClass('invisible');
	}

	startPosition(leftCoords1, rightCoords1, leftCoords2, rightCoords2, manPosition) {
		this.clearPaths();
		var self = this;

		if (!manPosition) {
			manPosition = this.manPosition;
		}

		if (manPosition === 'left') {
			this.startPosFigure(this.man, leftCoords1);
			this.startPosFigure(this.woman, rightCoords1);
			this.startPosFigure(this.man2, leftCoords2);
			this.startPosFigure(this.woman2, rightCoords2);
		} else {
			this.startPosFigure(this.man, rightCoords1);
			this.startPosFigure(this.woman, leftCoords1);
			this.startPosFigure(this.man2, rightCoords2);
			this.startPosFigure(this.woman2, leftCoords2);
		}
	}

	setAtStart(manPosition) {
		this.startPosition(this.startPos.left1, this.startPos.right1, this.startPos.left2, this.startPos.right2, manPosition);
	}
}
