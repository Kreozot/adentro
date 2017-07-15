import plyr from 'plyr';
require('plyr/dist/plyr.css');
const $player = $('#player');
import {getElement} from './timing/timing';

export default class Player {
	constructor(main) {
		this.main = main;
		this.player = plyr.setup({
			iconUrl: '/plyr.svg'
		})[0];
		this.scheme = [];
		this.currentElement = null;
	}

	initEvents() {
		this.player.on('timeupdate', () => {
			// Если остановлено
			if ((this.player.isPaused()) && (this.player.getCurrentTime() == 0)) {
				this.main.hideCurrentElement();
			} else {
				this.main.animationLoader.animation.resume();
				const time = this.player.getCurrentTime();
				const element = getElement(this.scheme, time);
				if (this.currentElement !== element.name) {
					this.currentElement = element.name;
					if (element.name) {
						this.main.showCurrentElement(element.name, element.timeLength);
					}
				}
			}
		});
		this.player.on('ended', () => {
			this.main.hideCurrentElement();
			this.currentElement = null;
		});
		this.player.on('pause', () => {
			if ((this.player.isPaused()) && (this.player.getCurrentTime() !== 0)) {
				this.main.animationLoader.animation.pause();
			}
		});
	}

	/**
	 * Загрузить музыку и тайминг
	 * @param  {Object} musicDef Описание композиции
	 */
	loadMusicSchema(musicDef) {
		this.player.source({
			type: 'audio',
			title: musicDef.title,
			sources: [{
				src: musicDef.file,
				type: 'audio/mp3'
			}]
		});
		this.scheme = musicDef.schema;
	}

	/**
	 * Воспроизвести музыку с момента определённого элемента в хореографии
	 * @param  {String} element Идентификатор элемента
	 */
	playElement(element) {
		const time = this.scheme[element];
		this.main.animationLoader.animation.clear();
		this.player.seek(time);
		this.player.play();
	}

	get currentTime() {
		return this.player.getCurrentTime();
	}
}
