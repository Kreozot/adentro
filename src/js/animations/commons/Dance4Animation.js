import DanceAnimation from './DanceAnimation';

export default class Dance4Animation extends DanceAnimation {
	constructor(id) {
		super(id);

		this.man2 = this.initFigure('man');
		this.woman2 = this.initFigure('woman');
	}

	hideFigures() {
		this.hideFigure(this.man);
		this.hideFigure(this.woman);
		this.hideFigure(this.man2);
		this.hideFigure(this.woman2);
	}

	startPosition(leftCoords1, rightCoords1, leftCoords2, rightCoords2, manPosition) {
		this.clearPaths();

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
