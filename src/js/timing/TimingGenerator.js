import ElementTiming from './ElementTiming';
import yaml from 'js-yaml';

/**
 * Генератор тайминга
 */
export default class TimingGenerator {
	constructor(main) {
		this.main = main;
		this.elementsList = this.getElementsList();
		console.log(this.elementsList);
		this.elementsTiming = [];
		this.currentElementIndex = 0;
		this.lastTimeValue = 0;
	}

	/**
	 * Получить список элементов текущей схемы
	 * @return {Array} Массив описаний элементов схемы в формате [{id, beatCount}...]
	 */
	getElementsList() {
		const elementsList = [];

		function addElement(id, beatCount) {
			elementsList.push({id, beatCount});
		}

		const svgdom = $('#schemaDiv svg');
		let currentY = 0;
		let currentPart = 1;

		$('rect.element', svgdom).each(function (index, element) {
			// Если перешли на новую строку, добавляем паузу
			if (element.attributes.y.value != currentY) {
				currentY = element.attributes.y.value;
				if (currentPart != 1) {
					addElement('#pause_' + currentPart, 1);
				}
				addElement('#start_' + currentPart, 1);
				currentPart++;
			}
			addElement(element.id, element.attributes['data-times'].value);
		});
		addElement('#end', 1);

		return elementsList;
	}

	/**
	 * Очистить информацию о тайминге
	 */
	clear() {
		this.elementsTiming = [];
		this.currentElementIndex = 0;
		this.lastTimeValue = 0;
	}

	/**
	 * Добавить долю
	 * @param {Number} seconds Время в секундах
	 */
	addBeat(seconds) {
		if (this.currentElementIndex >= this.elementsList.length) {
			console.log('finish');
			return false;
		}
		const currentElement = this.elementsList[this.currentElementIndex];

		if (this.currentElementIndex >= this.elementsTiming.length) {
			this.elementsTiming.push(new ElementTiming(currentElement.id, currentElement.beatCount));
			this.main.markCurrentElementOnSchema(currentElement.id);
		}
		if (!this.elementsTiming[this.elementsTiming.length - 1].addBeat(seconds)) {
			this.currentElementIndex++;
			this.addBeat(seconds);
		}
		return true;
	}

	/**
	 * Получить тайминг
	 * @return {String} Описание тайминга в готовом для вставки формате
	 */
	getTiming() {
		const newTiming = this.elementsTiming.reduce((timing, timingElement) => {
			timing[timingElement.elementId] = timingElement.getBeginTime();
			return timing;
		}, {});
		return yaml.safeDump(newTiming);
	}
}
