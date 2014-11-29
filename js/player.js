var playerId = "jplayer";
var playerSelector = "#" + playerId;

var loadMusicSchema = function(musicSchema) {
	$(playerSelector).jPlayer("setMedia", {
		title: musicSchema.title,
		oga: musicSchema.file
	});
	$(playerSelector).data("schema", musicSchema.schema);
}

var getElement = function(time) {
	schema = $(playerSelector).data("schema");
	var nearest_element = {'name': '', 'time': -1};
	jQuery.each(schema, function(key, value) {
		if (((time - value) >= 0) && (((time - value) < (time - nearest_element['time'])))) {
			nearest_element['name'] = key;
			nearest_element['time'] = value;
		}
	});
	var next_element = {'name': '', 'time': 10000};
	jQuery.each(schema, function(key, value) {
		if (((value - nearest_element['time']) > 0) && 
				(((value - nearest_element['time']) < (next_element['time'] - nearest_element['time'])))) {
			next_element['name'] = key;
			next_element['time'] = value;
			nearest_element['timeLength'] = next_element['time'] - nearest_element['time'];
		}
	});
	return nearest_element;
}

var playElement = function(element) {
	schema = $(playerSelector).data("schema");
	time = schema[element];
	$.animation.clear();
	$(playerSelector).jPlayer("play", time);
}