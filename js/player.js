var playerId = "jplayer";
var playerSelector = "#" + playerId;

/**
 * Загрузить музыку и тайминг
 * @param  {Object} musicDef Описание композиции
 */
var loadMusicSchema = function(musicDef) {
	$(playerSelector).jPlayer("setMedia", {
		title: musicDef.title,
		mp3: musicDef.file
	});
	$(playerSelector).data("schema", musicDef.schema);
}

/**
 * Получить элемент хореографии для данного момента в музыке
 * @param  {Number} time Позиция музыки в секундах
 * @return {String}      Идентификатор нужного элемента
 */
var getElement = function(time) {
	schema = $(playerSelector).data("schema");
	var nearest_element = {'name': '', 'time': -1};
	jQuery.each(schema, function(key, value) {
		if (((time - value) >= 0) && 
				((time - value) < (time - nearest_element['time']))) {
			nearest_element['name'] = key;
			nearest_element['time'] = value;
		}
	});
	var next_element = {'name': '', 'time': 10000};
	jQuery.each(schema, function(key, value) {
		if (((value - nearest_element['time']) > 0) && 
				((value - nearest_element['time']) < (next_element['time'] - nearest_element['time']))) {
			next_element['name'] = key;
			next_element['time'] = value;
			nearest_element['timeLength'] = next_element['time'] - nearest_element['time'];
		}
	});
	return nearest_element;
}

/**
 * Воспроизвести музыку с момента определённого элемента в хореографии
 * @param  {String} element Идентификатор элемента
 */
var playElement = function(element) {
	schema = $(playerSelector).data("schema");
	time = schema[element];
	$.animation.clear();
	$(playerSelector).jPlayer("play", time);
}