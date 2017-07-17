/**
 * Тайминг элемента хореографии
 * @param {String} elementId  Идентификатор элемента
 * @param {Number} beatCount  Количество тактов
 */
export default class ElementTiming {
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

			console.log(`${this.beats.length} beat on ${seconds} (${this.elementId})`);
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
		const beatsLen = this.beats.map((beat, i, beats) => (i === beats.length - 1) ? 0 : beats[i + 1] - beat);
		// Считаем сумму длительностей
		const beatsLenSum = beatsLen.reduce((sum, value) => sum + value, 0);
		// Вычисляем среднюю длительность
		return beatsLenSum / (this.beatCount - 1);
	}

	/**
	 * Получить время начала элемента
	 * @return {Number} Время начала элемента в секундах
	 */
	getBeginTime() {
		return Math.round(this.beats[0] * 10) / 10;
	}
}
