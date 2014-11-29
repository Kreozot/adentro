var playerId = "jplayer";
var playerSelector = "#" + playerId;

// Дробная часть от деления
var mod = function(upVal, downVal) {
	divVal = upVal / downVal;
	modVal = divVal - Math.floor(divVal);
	return modVal;
}

var getSvgSchemaDom = function() {
	var svgobject = document.getElementById('schema');
	if ('contentDocument' in svgobject) {
		var svgdom = jQuery(svgobject.contentDocument);
		return svgdom;
	} else {
		return false;
	}
}

var hideCurrentElementMarkOnSchema = function(dom) {
	if (!dom) {
		dom = getSvgSchemaDom();
	}
	$('rect', dom).myRemoveClass('current');
	$('text', dom).myRemoveClass('current');	
}

var hideCurrentElement = function(dom) {
	hideCurrentElementMarkOnSchema();
	$.animation.clear();
	$(playerSelector).data("currentElement", "");
};

// Выделение текущего элемента на SVG-схеме
var markCurrentElementOnSchema = function(element, dom) {
	if (!dom) {
		dom = getSvgSchemaDom();
	}
	if (element[0] == '#') {
		//Пропускаем обработку служебных меток
		return;
	}
	// Показываем рамку вокруг текущего блока
	var frameId = element + '-frame';
	$('rect:not(#' + frameId + ')', dom).myRemoveClass('current');
	$("#" + frameId, dom).myAddClass('current');
	// Выделяем название текущего элемента
	var textId = element + '-text';
	$('text:not(#' + textId + ')', dom).myRemoveClass('current');
	$("#" + textId, dom).myAddClass('current');	
}

// Показ текущего элемента
var showCurrentElement = function(element, time, dom) {
	if (!dom) {
		dom = getSvgSchemaDom();
	}
	if (element.split('_')[0] == "#start") {
		// Начальное расположение
		$.animation.setAtStart();
		hideCurrentElementMarkOnSchema();
		return;
	} else if (element[0] == '#') {
		//Пропускаем обработку служебных меток
		return;
	}

	markCurrentElementOnSchema(element, dom);
	// Запускаем соответствующую анимацию
	var domElement = $("#" + element, dom);
	var visualizationFuncName = domElement.data("visualization");
	var manPosition = domElement.data("manposition");
	var times = domElement.data("times");
	if (visualizationFuncName) {
		$.animation[visualizationFuncName](time, manPosition, times);
	}
};

var initSvgSchema = function() {
	var svgdom = getSvgSchemaDom();
	if (svgdom) {
		$("#schema").attr("width", $("svg", svgdom).attr("width"))
				.attr("height", $("svg", svgdom).attr("height"));

		var timeupdateEvent = function(svgdom) {
			return function(event) {
				// Есле остановлено
				if ((event.jPlayer.status.paused) && (event.jPlayer.status.currentTime == 0)) {
					hideCurrentElement(svgdom);
				} else if (!event.jPlayer.status.paused) {
					$.animation.resume();
					var time = event.jPlayer.status.currentTime;
					var element = getElement(time);
					if ($(playerSelector).data("currentElement") != element['name']) {
						$(playerSelector).data("currentElement", element['name']);
						if (element && (element['name'].length > 0)) {
							showCurrentElement(element['name'], element['timeLength'], svgdom);
						};
					};
				};
			};
		}(svgdom);
		var endedEvent = function(svgdom) {
			return function(event) {
				hideCurrentElement(svgdom);
			};
		}(svgdom);
		var pauseEvent = function(svgdom) {
			return function(event) {
				if ((event.jPlayer.status.paused) && (event.jPlayer.status.currentTime > 0)) {
					$.animation.pause();
				};
			};
		}(svgdom);

		$(playerSelector).bind($.jPlayer.event.timeupdate, timeupdateEvent)
				.bind($.jPlayer.event.ended, endedEvent)
				.bind($.jPlayer.event.pause, pauseEvent);
	};
};

var initSvgSchemaEditor = function() {
	var svgdom = getSvgSchemaDom();
	if (svgdom) {
		$("#schema").attr("width", $("svg", svgdom).attr("width"))
				.attr("height", $("svg", svgdom).attr("height"));
	};
};

/**
 * [getAnimationClassDef Получить описание определённого класса анимации из массива]
 * @param  {[type]} animationClassDefs [массив описаний классов анимаций (из navigation.js)]
 * @param  {[type]} animationId        [идентификатор нужного класса]
 * @return {[type]}                    [описание класса в виде {id, name, title}]
 */
var getAnimationClassDef = function(animationClassDefs, animationId) {
	for (var i = 0; i < animationClassDefs.length; i++) {
		if (animationId === animationClassDefs[i].id) {
			return animationClassDefs[i];
		}
	}
	return animationClassDefs[0];
}

var showAnimationLinks = function(animationClassDefs, animationId) {
	var currentClassDef = getAnimationClassDef(animationClassDefs, animationId);

	var getAnimationLinks = function(animationClassDefs) {
		var result = "";
		for (var i = 0; i < animationClassDefs.length; i++) {
			if (animationClassDefs[i].id === currentClassDef.id) {
				result += animationClassDefs[i].title;
			} else {					
				result += "<a href=\"javascript:showAnimation('" + animationClassDefs[i].id + "')\">" +
					animationClassDefs[i].title + "</a>";
			}
			if (i < animationClassDefs.length - 1) {
				result += ", ";
			}
		}
		return result;
	}
	$("#animationLinks").html(getAnimationLinks(animationClassDefs));
}

/**
 * [showMusicLinks Отобразить ссылки на музыкальные композиции]
 * @param  {[Object]} musicIds       [Массив идентификаторов композиций]
 * @param  {[String]} currentMusicId [Идентификатор текущей композиции]
 */
var showMusicLinks = function(musicIds, currentMusicId) {
	if (musicIds.length <= 1) {
		$("#musicLinks").html("");
		return;
	}

	var getMusicLinks = function() {
		var result = 'Composition: <select id="musicSelect">';
		for (var i = 0; i < musicIds.length; i++) {
			if (musicIds[i] === currentMusicId) {
				result += '<option selected="selected" value="' + musicIds[i] + '">' + 
						music.get(musicIds[i]).title + '</option>';
			} else {
				result += '<option value="' + musicIds[i] + '">' + music.get(musicIds[i]).title + '</option>';
			}
		}
		result += "</select>";
		return result;
	};

	$("#musicLinks").html(getMusicLinks());
	$('#musicSelect').change(function() {
		showMusic($(this).val());
	});
};

var loadAnimation = function(animationClass) {
	$.animation = new window[animationClass]("animation");
	$("#animation").attr("width", $.animation.width)
			.attr("height", $.animation.height)
			.attr("viewBox", "0 0 " + $.animation.width + " " + $.animation.height);	
};

/**
 * [loadSchema Загрузка схемы]
 * @param  {[String]} name           Название
 * @param  {[String]} svgName        Имя svg-файла схемы без расширения
 * @param  {[String]} musicIds    	 Массив идентификаторов музыкальных композиций
 * @param  {[String]} musicId    	 Идентификатор музыки
 * @param  {[Object]} animationClass Класс анимации (или список доступных классов)
 * @param  {[String]} animationId    Идентификатор конкретной анимации (если в animationClass пришёл список)
 */
var loadSchema = function(name, svgName, musicIds, musicId, animationClass, animationId) {
	$("#danceName").html(name);
	$("#schemaDiv").html('<object data="svg/' + svgName + '.svg" type="image/svg+xml" id="schema"></object>');
	$("#animationDiv").html('<svg id="animation" preserveAspectRatio="xMidYMid meet"></svg>');

	if (typeof animationClass === 'object') {
		showAnimationLinks(animationClass, animationId);
		var currentClassDef = getAnimationClassDef(animationClass, animationId);
		animationClass = currentClassDef.name;
	} else {
		$("#animationLinks").html("");
	}

	musicId = musicId ? musicId : musicIds[0];
	showMusicLinks(musicIds, musicId);
	var musicSchema = music.get(musicId);

	var svgobject = document.getElementById('schema');
	$(svgobject).load(function() {
		$(playerSelector).unbind($.jPlayer.event.timeupdate)
				.unbind($.jPlayer.event.ended)
				.unbind($.jPlayer.event.pause);
		loadMusicSchema(musicSchema);
		initSvgSchema();
		
		loadAnimation(animationClass);
	});
};

var loadSchemaEditor = function(name, svgName, musicIds, musicId) {
	$("#danceName").html(name + " (editor mode)");
	$("#schemaDiv").html('<object data="svg/' + svgName + '.svg" type="image/svg+xml" id="schema"></object>');
	var svgobject = document.getElementById('schema');
	$(svgobject).load(function() {
		$(playerSelector).unbind($.jPlayer.event.timeupdate)
				.unbind($.jPlayer.event.ended)
				.unbind($.jPlayer.event.pause);

		showMusicLinks(musicIds, musicId);
		var musicSchema = music.get(musicId);

		loadMusicSchema(musicSchema);
		initSvgSchemaEditor();

		console.log("editor mode on");
		$("#animationDiv").html('');
		var initTiming = $(playerSelector).data("schema");
		var timingGenerator = new TimingGenerator(initTiming);


		var timeupdateEvent = function(timingGenerator) {
			return function(event) {
				// Если остановлено
				if ((event.jPlayer.status.paused) && (event.jPlayer.status.currentTime == 0)) {
					hideCurrentElementMarkOnSchema();
					timingGenerator.clear();
				}
			};
		}(timingGenerator);

		$(playerSelector).bind($.jPlayer.event.timeupdate, timeupdateEvent);

		$("html").keypress(function(event) {
			if (event.which == 32) { //space
				var currentTime = $(playerSelector).data("jPlayer").status.currentTime;
				if (!timingGenerator.addBeat(currentTime)) {
					var newTiming = timingGenerator.getTiming();
					$("#animationDiv").html("<pre>" + JSON.stringify(newTiming, "", 4) + "</pre>");	
				}
			}
		});
	});	
};