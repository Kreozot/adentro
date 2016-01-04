/**
 * Таймер
 * @param {Function} callback Функция
 * @param {Number}   delay    Задержка в мс
 */
export function Timer(callback, delay) {
	var remaining = delay || 0;
	var paused = true;
	var timerId;
	var start;

	this.pause = function () {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
		paused = true;
	};

	this.resume = function () {
		if (paused && (remaining >= 0)) {
			paused = false;
			start = new Date();
			timerId = window.setTimeout(callback, remaining);
		};
	};

	this.resume();
}

/**
 * Получение противоположной позиции
 * @param  {String} position Позиция
 * @return {String}          Позиция, противоположная указанной
 */
export function getOppositePosition(position) {
	switch (position) {
		case 'start_left':
			return 'start_right';
		case 'start_right':
			return 'start_left';
		case 'left':
			return 'right';
		case 'right':
			return 'left';
		case 'top':
			return 'bottom';
		case 'bottom':
			return 'top';
		default:
			return 'left';
	}
};

/**
 * Дробная часть от деления
 * @param  {Number} upVal   Числитель
 * @param  {Number} downVal Знаменатель
 * @return {Number}         Дробная часть от деления
 */
export function mod(upVal, downVal) {
	const divVal = upVal / downVal;
	return divVal - Math.floor(divVal);
};
