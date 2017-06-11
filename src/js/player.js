var playerId = 'jplayer';
var playerSelector = '#' + playerId;

class Player {
	/**
	 * Загрузить музыку и тайминг
	 * @param  {Object} musicDef Описание композиции
	 */
	loadMusicSchema(musicDef) {
		$(playerSelector).jPlayer('setMedia', {
			title: musicDef.title,
			mp3: musicDef.file
		});
		$(playerSelector).data('schema', musicDef.schema);
	}

	/**
	 * Воспроизвести музыку с момента определённого элемента в хореографии
	 * @param  {String} element Идентификатор элемента
	 */
	playElement(element) {
		const schema = $(playerSelector).data('schema');
		const time = schema[element];
		$.animation.clear();
		$(playerSelector).jPlayer('play', time);
	}
}

$('#' + playerId).jPlayer({
	swfPath: '',
	supplied: 'mp3'
});

export default Player;
