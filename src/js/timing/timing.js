export const getElementAfter = function (scheme, time) {
	const nextElement = {name: '', time: 10000};

	for (let key in scheme) {
		if (scheme.hasOwnProperty(key)) {
			const value = scheme[key];

			if (((value - time) > 0) &&
				((value - time) < (nextElement.time - time))) {
				nextElement.name = key;
				nextElement.time = value;
			}
		}
	}

	return nextElement;
};

/**
 * Получить элемент хореографии для данного момента в музыке
 * @param  {Object} scheme Схема
 * @param  {Number} time Позиция музыки в секундах
 * @return {String}      Объект нужного элемента с параметрами name, time, timeLength
 */
export const getElement = function (scheme, time) {
	const nearestElement = {name: '', time: -1};
	for (let key in scheme) {
		if (scheme.hasOwnProperty(key)) {
			const value = scheme[key];

			if (((time - value) >= 0) && ((time - value) < (time - nearestElement.time))) {
				nearestElement.name = key;
				nearestElement.time = value;
			}
		}
	}

	const nextElement = getElementAfter(scheme, nearestElement.time);
	nearestElement.timeLength = nextElement.time - nearestElement.time;
	nearestElement.nextElementId = nextElement.name;

	return nearestElement;
};
