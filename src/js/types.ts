import DanceAnimation from './animations/commons/DanceAnimation';
import AnimationLoader from './loading/AnimationLoader';
import Navigation from './navigation';
import Player from './player';

export type Element = {
	name: string;
	time: number;
	timeLength?: number;
	nextElementId?: string;
}

export interface SchemeBar {
	bar: true;
}

export interface SchemeElement {
	id: string;
	beats: number;
	manPosition: 'left' | 'right' | 'bottom' | 'top';
	class: string;
	visualization: string;
	title: string;
};

export type SchemeItem = (SchemeElement | SchemeBar);

export function isSchemeElement(item: SchemeItem): item is SchemeElement {
	return (item as SchemeElement).id !== undefined;
}

export type SchemePart = SchemeItem[];

export type Scheme = SchemePart[];

export type SchemeMap = {
	[key: string]: SchemeElement
};

export type Timing = {
	[key: string]: number;
}

export type MusicData = {
	id: string;
	title: string;
	file: string;
	schema: Timing;
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

export type AnimationVariantParams = {
	id: string;
	title: string;
	animClass: DanceAnimation;
}

export interface MainClass {
	showCurrentElement(element: Element);
	hideCurrentElement();
	animationLoader: AnimationLoader;
	player: Player;
	navigation: Navigation;
	loadSchema(schemeParams: SchemeParams, musicId: string, animationId: string);
	showLanguageLinks();
	loadSchemaEditor(schemeParams: SchemeParams, musicId: string);
	showMusicLinks(musicData: MusicData[], currentMusicId: string);
	getModScheme(scheme: Scheme, schemeMods?);
	renderScheme(scheme: Scheme, editorMode?);
}

