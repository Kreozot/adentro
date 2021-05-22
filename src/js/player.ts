import * as Plyr from 'plyr';
require('plyr/dist/plyr.css');

import { getElement, getElementAfter } from './timing/timing';
import { isSchemeElement, MainClass, MusicData, Scheme, Timing } from './types';

export default class Player {
	main: MainClass;
	player: Plyr;
	interval: number;
	timing: Timing;
	currentElement: string;

	constructor(main: MainClass, editorMode: boolean) {
		this.main = main;
		this.interval = null;
		this.player = new Plyr('#player', {
			iconUrl: '/plyr.svg',
			invertTime: false,
		});
		this.timing = {};
		this.currentElement = null;
		if (!editorMode) {
			this.initEvents();
		}
	}

	showCurrentElement() {
		const time = this.player.currentTime;
		const element = getElement(this.timing, time);
		if (this.currentElement !== element.name) {
			this.currentElement = element.name;
			if (element.name) {
				this.main.showCurrentElement(element);
			}
		}
	}

	initEvents() {
		this.player.on('playing', () => {
			const {animation} = this.main.animationLoader;

			window.clearInterval(this.interval);
			this.interval = window.setInterval(() => {
				animation.resume();
				this.showCurrentElement();
			}, 10);
		});
		this.player.on('ended', () => {
			window.clearInterval(this.interval);
			this.main.hideCurrentElement();
			this.currentElement = null;
		});
		this.player.on('pause', () => {
			const {animation} = this.main.animationLoader;

			window.clearInterval(this.interval);
			if (this.player.paused && (this.player.currentTime !== 0)) {
				animation.pause();
			}
		});
	}

	/**
	 * Загрузить музыку и тайминг
	 * @param  {Object} musicDef Описание композиции
	 */
	loadMusicSchema(musicDef: MusicData, scheme: Scheme) {
		this.player.source = {
			type: 'audio',
			title: musicDef.title,
			sources: [{
				src: musicDef.file,
				type: 'audio/mp3'
			}]
		};
		this.timing = {...musicDef.schema};

		// Смещаем все элементы на треть базового шага для того, чтобы успевала анимация
		for (let key in this.timing) {
			if (this.timing.hasOwnProperty(key)) {
				const value = this.timing[key];
				const nextElement = getElementAfter(this.timing, value);
				const time = nextElement.time - value;

				let schemeElement;
				scheme.forEach((schemePart) => {
					schemeElement = schemePart.find((element) => {
						if (isSchemeElement(element)) {
							return element.id === key;
						}
					});
				});
				if (schemeElement) {
					this.timing[key] = value - (time / schemeElement.beats / 3);
				}
			}
		}
	}

	/**
	 * Воспроизвести музыку с момента определённого элемента в хореографии
	 * @param  {String} elementId Идентификатор элемента
	 */
	playElement(elementId: string) {
		const time = this.timing[elementId];
		this.main.animationLoader.animation.clear();
		this.player.currentTime = time;
		this.player.play();
	}

	get currentTime() {
		return this.player.currentTime;
	}
}
