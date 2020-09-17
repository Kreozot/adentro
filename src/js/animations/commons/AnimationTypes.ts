export interface Figure extends Snap.Paper {
	angle?: number | null;
	top?: Figure;
	coords?: [number, number];
}

export type EasingFunction = (num: number) => number;

export type Gender = 'man' | 'woman';

export type Coords = {x: number, y: number, angle: number};

export type FigurePosition = 'left' | 'right' | 'top' | 'bottom';

export type PathStrings = {
	[key: string]: string
};
