import DanceAnimation from './animations/commons/DanceAnimation';

export type Element = {
	name: string;
	time: number;
	timeLength?: number;
	nextElementId?: string;
}

export type SchemeElement = {
	beats: number;
	manPosition: 'left'| 'right' | 'bottom' | 'top';
	class: 'esquina' | 'avance' | 'zapateo' | 'coronacion';
	visualization: string;
	title: string;
};

export type Scheme = SchemeElement[];

export type MusicData = {
    id: string;
    title: string;
    file: string;
    schema: Scheme;
    schemeMods?: {
        [key: string]: any;
    }
}

export type ExtendedAnimationType = {
    id: string;
    animClass: DanceAnimation;
    title: string;
}

export type SchemeParams = {
    name: string;
    scheme: Scheme;
    music: MusicData[];
    animation: DanceAnimation | ExtendedAnimationType[];
};

