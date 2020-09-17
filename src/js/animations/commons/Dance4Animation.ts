import { Coords, Figure, FigurePosition } from './AnimationTypes';
import DanceAnimation from './DanceAnimation';

export default class Dance4Animation extends DanceAnimation {
	man2: Figure;
	woman2: Figure;
	protected startPos4: {
		left1?: Coords,
		right1?: Coords,
		left2?: Coords,
		right2?: Coords,
	};

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

	private startPosition4(leftCoords1: Coords, rightCoords1: Coords, leftCoords2: Coords, rightCoords2: Coords, manPosition: FigurePosition) {
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
		this.startPosition4(this.startPos4.left1, this.startPos4.right1, this.startPos4.left2, this.startPos4.right2, manPosition);
	}
}
