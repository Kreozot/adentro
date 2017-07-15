/**
 * Получить элемент хореографии для данного момента в музыке
 * @param  {Object} scheme Схема
 * @param  {Number} time Позиция музыки в секундах
 * @return {String}      Идентификатор нужного элемента
 */
export const getElement = function (scheme, time) {
	// schema = $(playerSelector).data('schema');
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
	const nextElement = {name: '', time: 10000};

	for (let key in scheme) {
		if (scheme.hasOwnProperty(key)) {
			const value = scheme[key];

			if (((value - nearestElement.time) > 0) &&
				((value - nearestElement.time) < (nextElement.time - nearestElement.time))) {
				nextElement.name = key;
				nextElement.time = value;
				nearestElement.timeLength = nextElement.time - nearestElement.time;
			}
		}
	}
	return nearestElement;
};
