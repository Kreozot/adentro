var playerId = "jplayer";
var playerSelector = "#" + playerId;

/**
 * Дробная часть от деления
 * @param  {Number} upVal   Числитель
 * @param  {Number} downVal Знаменатель
 * @return {Number}         Дробная часть от деления
 */
var mod = function(upVal, downVal) {
	divVal = upVal / downVal;
	modVal = divVal - Math.floor(divVal);
	return modVal;
}

function supports_history_api() {
  return !!(window.history && history.pushState);
}

/**
 * Получить ссылку на dom объекта
 * @param  {String} id Идентификатор объекта
 * @return {String}    Ссылка на dom объекта
 */
var getObjectDom = function(id) {
	var object = document.getElementById(id);
	if ('contentDocument' in object) {
		var dom = jQuery(object.contentDocument);
		return dom;
	} else {
		return false;
	}
}

/**
 * Получить ссылку на dom svg-схемы
 * @return  {String}  Ссылка на dom svg-схемы
 */
var getSvgSchemaDom = function() {
	return getObjectDom('schema');
}

/**
 * Спрятать отображение текущего элемента на схеме
 * @param  {String} svgSchemaDom Ссылка на dom svg-схемы
 */
var hideCurrentElementMarkOnSchema = function(svgSchemaDom) {
	if (!svgSchemaDom) {
		svgSchemaDom = getSvgSchemaDom();
	}
	$('rect', svgSchemaDom).myRemoveClass('current');
	$('text', svgSchemaDom).myRemoveClass('current');	
}

/**
 * Спрятать отображение и визуализацию текущего элемента
 * @param  {String} svgSchemaDom Ссылка на dom svg-схемы
 */
var hideCurrentElement = function(svgSchemaDom) {
	hideCurrentElementMarkOnSchema(svgSchemaDom);
	$.animation.clear();
	$(playerSelector).data("currentElement", "");
};

/**
 * Выделение текущего элемента на SVG-схеме
 * @param  {String} element 	  Идентификатор элемента
 * @param  {String} svgSchemaDom  Ссылка на dom svg-схемы
 */
var markCurrentElementOnSchema = function(element, svgSchemaDom) {
	if (!svgSchemaDom) {
		svgSchemaDom = getSvgSchemaDom();
	}
	if (element[0] == '#') {
		//Пропускаем обработку служебных меток
		return;
	}
	// Показываем рамку вокруг текущего блока
	var frameId = element + '-frame';
	$('rect:not(#' + frameId + ')', svgSchemaDom).myRemoveClass('current');
	$("#" + frameId, svgSchemaDom).myAddClass('current');
	// Выделяем название текущего элемента
	var textId = element + '-text';
	$('text:not(#' + textId + ')', svgSchemaDom).myRemoveClass('current');
	$("#" + textId, svgSchemaDom).myAddClass('current');	
}

/**
 * Отображение текущего элемента
 * @param  {String} element 	  Идентификатор элемента
 * @param  {Number} seconds    	  Длительность в секундах
 * @param  {String} svgSchemaDom  Ссылка на dom svg-схемы
 */
var showCurrentElement = function(element, seconds, svgSchemaDom) {
	if (!svgSchemaDom) {
		svgSchemaDom = getSvgSchemaDom();
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

	markCurrentElementOnSchema(element, svgSchemaDom);
	// Запускаем соответствующую анимацию
	var domElement = $("#" + element, svgSchemaDom);
	var visualizationFuncName = domElement.data("visualization");
	var manPosition = domElement.data("manposition");
	var times = domElement.data("times");
	if (visualizationFuncName) {
		$.animation[visualizationFuncName](seconds, manPosition, times);
	}
};

/**
 * Иницилизация схемы
 */
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
				} else if ((!event.jPlayer.status.paused) && 
						(!event.jPlayer.status.waitForPlay) && 
						(!event.jPlayer.status.waitForLoad)) {
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

/**
 * Инициализация редактора тайминга
 */
var initSvgSchemaEditor = function() {
	var svgdom = getSvgSchemaDom();
	if (svgdom) {
		$("#schema").attr("width", $("svg", svgdom).attr("width"))
				.attr("height", $("svg", svgdom).attr("height"));
	};
};

/**
 * Отобразить ссылки на музыкальные композиции
 * @param  {Object} musicIds          Массив идентификаторов композиций
 * @param  {String} currentMusicId    Идентификатор текущей композиции
 * @param  {Boolean} showEmptyTiming  Показывать композиции, не имеющие разметки тайминга
 */
var showMusicLinks = function(musicIds, currentMusicId, showEmptyTiming) {
	if (musicIds.length <= 1) {
		$("#musicLinks").html("");
		return;
	}

	var getMusicLinks = function() {
		var result = i18n.t("other.composition") + ': <select id="musicSelect">';
		var count = 0;
		for (var i = 0; i < musicIds.length; i++) {
			if (!jQuery.isEmptyObject(music.get(musicIds[i]).schema) || showEmptyTiming) {
				if (musicIds[i] === currentMusicId) {
					result += '<option selected="selected" value="' + musicIds[i] + '">' + 
							music.get(musicIds[i]).title + '</option>';
				} else {
					result += '<option value="' + musicIds[i] + '">' + music.get(musicIds[i]).title + '</option>';
				}
				count++;
			}
		}
		if (count <= 1) {
			return "";
		}
		result += "</select>";
		return result;
	};

	$("#musicLinks").html(getMusicLinks());
	$('#musicSelect').change(function() {
		showMusic($(this).val());
	});
};

/**
 * Показать ссылки на языки
 */
var showLanguageLinks = function() {
	var languages = [
		{
			id: "ru",
			title: "ru"
		},
		{
			id: "en",
			title: "en"
		}
	];

	var getLanguageLinks = function() {
		var result = '<nobr>';
		for (var i = 0; i < languages.length; i++) {
			if ((languages[i].id == i18n.lng()) || (languages[i].id == i18n.lng().substr(0, 2))) {
				result += languages[i].title
			} else {
				result += '<a href="' + getLanguageLink(languages[i].id) + '">' + languages[i].title + '</a>';
			}
			if (i < languages.length - 1) {
				result += " / ";
			}
		}
		result += '</nobr>';
		return result;
	};

	$("#lang").html(getLanguageLinks());
};

/**
 * Загрузка схемы
 * @param  {String} name           Название
 * @param  {String} svgName        Имя svg-файла схемы без расширения
 * @param  {String} musicIds       Массив идентификаторов музыкальных композиций
 * @param  {String} musicId    	   Идентификатор музыки
 * @param  {Object} animationClass Класс анимации (или список доступных классов)
 * @param  {String} animationId    Идентификатор конкретной анимации (если в animationClass пришёл список)
 * @param  {String} infoName       Имя файла с информацией (без расширения)
 */
var loadSchema = function(name, svgName, musicIds, musicId, animationClass, animationId, infoName) {
	// TODO: Сделать загрузку анимации, информации и сапатео как отдельные блоки (в блоке content + ссылки в content_menu)
	$("#danceName").html(name);
	$("#schemaDiv").html('<object data="svg/' + svgName + '.svg" type="image/svg+xml" id="schema"></object>');

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

		ContentSwitch.clearContent();

		AnimationLoader.loadAnimationBlock();	
		if (typeof animationClass === 'object') {
			AnimationLoader.showAnimationLinks(animationClass, animationId);
			var currentClassDef = AnimationLoader.getAnimationClassDef(animationClass, animationId);
			animationClass = currentClassDef.name;
		}		
		AnimationLoader.loadAnimation(animationClass);

		InfoLoader.loadInfoBlock(infoName);

		ContentSwitch.show("animation_block");
	});
};

/**
 * Загрузка редактора тайминга
 * @param  {String} name         Название
 * @param  {String} svgName      Имя svg-файла схемы без расширения
 * @param  {String} musicIds     Массив идентификаторов музыкальных композиций
 * @param  {String} musicId    	 Идентификатор музыки
 */
var loadSchemaEditor = function(name, svgName, musicIds, musicId) {
	$("#danceName").html(name + " (editor mode)");
	$("#schemaDiv").html('<object data="svg/' + svgName + '.svg" type="image/svg+xml" id="schema"></object>');
	var svgobject = document.getElementById('schema');
	$(svgobject).load(function() {
		$(playerSelector).unbind($.jPlayer.event.timeupdate)
				.unbind($.jPlayer.event.ended)
				.unbind($.jPlayer.event.pause);

		musicId = musicId ? musicId : musicIds[0];
		showMusicLinks(musicIds, musicId, true);
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