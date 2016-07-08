/**
 * Тайминг элемента хореографии
 * @param {String} elementId  Идентификатор элемента
 * @param {Number} beatCount  Количество тактов
 */
class ElementTiming {
	constructor(elementId, beatCount) {
		this.elementId = elementId;
		this.beatCount = beatCount;
		this.beats = [];
	}

	/**
	 * Добавление доли
	 * @param  {Number} seconds Время в секундах
	 * @return {Boolean} 	    false, если достигли конца элемента
	 */
	addBeat(seconds) {
		if (this.beats.length < this.beatCount) {
			this.beats[this.beats.length] = seconds;

			console.log(this.beats.length + ' beat on ' + seconds + ' (' + this.elementId + ')');
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Получить среднюю длительность одной доли
	 * @return {Number} Средняя длительность доли в секундах
	 */
	getAverageBeatTime() {
		// Находим длительность всех долей, кроме последней
		var beatsLen = this.beats.map(function (beat, i, beats) {
			if (i == beats.length - 1) {
				return 0;
			} else {
				return beats[i + 1] - beat;
			}
		});
		// Считаем сумму длительностей
		var beatsLenSum = beatsLen.reduce(function (sum, value) {
			return sum + value;
		}, 0);
		// Вычисляем среднюю длительность
		return beatsLenSum / (this.beatCount - 1);
	}

	/**
	 * Получить время начала элемента (за пол доли до первой сильной доли)
	 * @return {Number} Время начала элемента в секундах
	 */
	getBeginTime() {
		var time = this.beats[0] - this.getAverageBeatTime();
		if (!time) {
			time = this.beats[0];
		}
		time = Math.round(time * 10) / 10;
		return time;
	}
}

/**
 * Генератор тайминга
 */
export default class TimingGenerator {
	constructor() {
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
		var elementsList = [];

		function addElement(id, beatCount) {
			elementsList[elementsList.length] = {id: id, beatCount: beatCount};
		}

		// var svgobject = document.getElementById('schema');
		// if (svgobject.contentDocument) {
		var svgdom = jQuery('#schemaDiv svg');
		var currentY = 0;
		var currentPart = 1;

		$('rect.element', svgdom).each(function (index, element) {
			// Если перешли на новую строку, добавляем паузу
			if (element.attributes.y.value != currentY) {
				currentY = element.attributes.y.value;
				if (currentPart != 1) {
					addElement('#pause_' + currentPart, 1);
				}
				addElement('#start_' + currentPart, 1);
				currentPart += 1;
			}
			addElement(element.id, element.attributes['data-times'].value);
		});
		addElement('#end', 1);

		return elementsList;
		// }
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
		var currentElement = this.elementsList[this.currentElementIndex];

		if (this.currentElementIndex >= this.elementsTiming.length) {
			this.elementsTiming[this.elementsTiming.length] = new ElementTiming(currentElement.id, currentElement.beatCount);
			markCurrentElementOnSchema(currentElement.id);
		}
		if (!this.elementsTiming[this.elementsTiming.length - 1].addBeat(seconds)) {
			this.currentElementIndex += 1;
			this.addBeat(seconds);
		}
		return true;
	}

	/**
	 * Получить тайминг
	 * @return {String} Описание тайминга в готовом для вставки формате
	 */
	getTiming() {
		var newTiming = {};
		for (var i = 0; i < this.elementsTiming.length; i++) {
			newTiming[this.elementsTiming[i].elementId] = this.elementsTiming[i].getBeginTime();
		}
		return newTiming;
	}
}
