/**
 * Получить элемент хореографии для данного момента в музыке
 * @param  {Object} scheme Схема
 * @param  {Number} time Позиция музыки в секундах
 * @return {String}      Идентификатор нужного элемента
 */
var getElement = function (scheme, time) {
	// schema = $(playerSelector).data('schema');
	var nearestElement = {name: '', time: -1};
	jQuery.each(scheme, function (key, value) {
		if (((time - value) >= 0) && ((time - value) < (time - nearestElement.time))) {
			nearestElement.name = key;
			nearestElement.time = value;
		}
	});
	var nextElement = {name: '', time: 10000};
	jQuery.each(scheme, function (key, value) {
		if (((value - nearestElement.time) > 0) &&
				((value - nearestElement.time) < (nextElement.time - nearestElement.time))) {
			nextElement.name = key;
			nextElement.time = value;
			nearestElement.timeLength = nextElement.time - nearestElement.time;
		}
	});
	return nearestElement;
};

module.exports = getElement;