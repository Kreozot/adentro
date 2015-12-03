var playerId = 'jplayer';
var playerSelector = '#' + playerId;

/**
 * Загрузить музыку и тайминг
 * @param  {Object} musicDef Описание композиции
 */
var loadMusicSchema = function(musicDef) {
	$(playerSelector).jPlayer('setMedia', {
		title: musicDef.title,
		mp3: musicDef.file
	});
	$(playerSelector).data('schema', musicDef.schema);
}

/**
 * Получить элемент хореографии для данного момента в музыке
 * @param  {Number} time Позиция музыки в секундах
 * @return {String}      Идентификатор нужного элемента
 */
var getElement = function(time) {
	schema = $(playerSelector).data('schema');
	var nearestElement = {name: '', time: -1};
	jQuery.each(schema, function(key, value) {
		if (((time - value) >= 0) && ((time - value) < (time - nearestElement.time))) {
			nearestElement.name = key;
			nearestElement.time = value;
		}
	});
	var nextElement = {name: '', time: 10000};
	jQuery.each(schema, function(key, value) {
		if (((value - nearestElement.time) > 0) &&
				((value - nearestElement.time) < (nextElement.time - nearestElement.time))) {
			nextElement.name = key;
			nextElement.time = value;
			nearestElement.timeLength = nextElement.time - nearestElement.time;
		}
	});
	return nearestElement;
}

/**
 * Воспроизвести музыку с момента определённого элемента в хореографии
 * @param  {String} element Идентификатор элемента
 */
var playElement = function(element) {
	schema = $(playerSelector).data('schema');
	time = schema[element];
	$.animation.clear();
	$(playerSelector).jPlayer('play', time);
}