import Plyr from 'plyr';
require('plyr/dist/plyr.css');
import {getElement, getElementAfter} from './timing/timing';

export default class Player {
	constructor(main, editorMode) {
		this.main = main;
		this.interval = null;
		this.player = new Plyr('#player', {
			iconUrl: '/plyr.svg'
		});
		this.scheme = [];
		this.currentElement = null;
		if (!editorMode) {
			this.initEvents();
		}
	}

	getAndShowCurrentElement() {
		const time = this.player.currentTime;
		const element = getElement(this.scheme, time);
		if (this.currentElement !== element.name) {
			this.currentElement = element.name;
			if (element.name) {
				this.main.showCurrentElement(element.name, element.timeLength);
			}
		}
	}

	initEvents() {
		this.player.on('playing', () => {
			const {animation} = this.main.animationLoader;

			window.clearInterval(this.interval);
			this.interval = window.setInterval(() => {
				animation.resume();
				this.getAndShowCurrentElement();
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
	loadMusicSchema(musicDef, scheme) {
		this.player.source = {
			type: 'audio',
			title: musicDef.title,
			sources: [{
				src: musicDef.file,
				type: 'audio/mp3'
			}]
		};
		this.scheme = {...musicDef.schema};

		// Смещаем все элементы на треть базового шага для того, чтобы успевала анимация
		for (let key in this.scheme) {
			if (this.scheme.hasOwnProperty(key)) {
				const value = this.scheme[key];
				const nextElement = getElementAfter(this.scheme, value);
				const time = nextElement.time - value;

				let schemeElement;
				scheme.forEach(part => {
					schemeElement = part.find(element => element.id === key);
				});
				if (schemeElement) {
					this.scheme[key] = value - (time / schemeElement.beats / 3);
				}
			}
		}
	}

	/**
	 * Воспроизвести музыку с момента определённого элемента в хореографии
	 * @param  {String} element Идентификатор элемента
	 */
	playElement(element) {
		const time = this.scheme[element];
		this.main.animationLoader.animation.clear();
		this.player.currentTime = time;
		this.player.play();
	}

	get currentTime() {
		return this.player.currentTime;
	}
}
