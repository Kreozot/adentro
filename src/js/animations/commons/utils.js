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
		}
	};

	this.resume();
}

const positions = [
	['start_left', 'start_right'],
	['left', 'right'],
	['top', 'bottom']
];

/**
 * Получение противоположной позиции
 * @param  {String} position Позиция
 * @return {String}          Позиция, противоположная указанной
 */
export function getOppositePosition(position) {
	for (var i = 0; i < positions.length; i++) {
		const pair = positions[i];
		if (position === pair[0]) {
			return pair[1];
		}
		if (position === pair[1]) {
			return pair[0];
		}
	}
	return 'left';
}

/**
 * Дробная часть от деления
 * @param  {Number} upVal   Числитель
 * @param  {Number} downVal Знаменатель
 * @return {Number}         Дробная часть от деления
 */
export function mod(upVal, downVal) {
	const divVal = upVal / downVal;
	return divVal - Math.floor(divVal);
}

// Транспонирует угол в промежуток от 0 до 360
export function normalizeAngle(angle) {
	if (angle > 360) {
		angle = angle - 360;
	}
	if (angle < 0) {
		angle = 360 + angle;
	}
	return angle;
}
