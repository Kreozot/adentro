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
};

/**
 * Воспроизвести музыку с момента определённого элемента в хореографии
 * @param  {String} element Идентификатор элемента
 */
var playElement = function(element) {
	schema = $(playerSelector).data('schema');
	time = schema[element];
	$.animation.clear();
	$(playerSelector).jPlayer('play', time);
};
