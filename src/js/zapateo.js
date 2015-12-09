function ZapateoTiming() {
	/**
	 * Получить список элементов текущей схемы
	 * @return {Object} Объект описания схемы
	 */
	this.getElementsList = function () {
		var elementsList = [];

		function addElement(pos, length) {
			elementsList[elementsList.length] = {pos: pos, length: length};
		}

		var svgobject = document.getElementById('zapateo');
		if ('contentDocument' in svgobject) {
			var svgdom = jQuery(svgobject.contentDocument);

			var firstBeat = $('svg', svgdom).attr('data-firstBeat');

			$('rect.move', svgdom).each( function (index, element) {
				addElement(element.dataset.pos, element.dataset.length);
			});

			var zapateoDef = {
				firstBeat: firstBeat,
				elementsList: elementsList
			};
			return zapateoDef;
		};
	};

	this.getTiming = function (zapateoDef, fromTime, toTime, beatCount) {
		var oneBeatLength = (toTime - fromTime) / beatCount;
		var result = [];
		for (var i = 0; i < zapateoDef.elementsList.length; i++) {
			result[i] = {
				beginTime: fromTime + zapateoDef.pos * oneBeatLength,
				endTime: fromTime + zapateoDef.pos * oneBeatLength + zapateoDef.length * oneBeatLength
			};
			zapateoDef.elementsList[i];
		};
	};

	/**
	 * Загрузка анимации
	 * @param  {Object} animationClass  Класс анимации
	 */
	var loadAnimation = function (animationClass) {
		$.animation = new window[animationClass]('animation');
		$('#animation').attr('width', $.animation.width)
				.attr('height', $.animation.height)
				.attr('viewBox', '0 0 ' + $.animation.width + ' ' + $.animation.height);	
	};

	/**
	 * Иницилизация схемы
	 */
	var initSvgZapateoSchema = function () {
		this.elementsList = this.getElementsList();
		var svgdom = getObjectDom('zapateo');
		if (svgdom) {
			$('#zapateo').attr('width', $('svg', svgdom).attr('width'))
					.attr('height', $('svg', svgdom).attr('height'));

			var timeupdateEvent = function (svgdom) {
				return function (event) {
					// Есле остановлено
					if ((event.jPlayer.status.paused) && (event.jPlayer.status.currentTime == 0)) {
						hideCurrentElement(svgdom);
					} else if ((!event.jPlayer.status.paused) && 
							(!event.jPlayer.status.waitForPlay) && 
							(!event.jPlayer.status.waitForLoad)) {
						$.animation.resume();
						var time = event.jPlayer.status.currentTime;
						var element = getElement(time);
						if ($(playerSelector).data('currentElement') != element['name']) {
							$(playerSelector).data('currentElement', element['name']);
							if (element && (element['name'].length > 0)) {
								showCurrentElement(element['name'], element['timeLength'], svgdom);
							};
						};
					};
				};
			}(svgdom);
			var endedEvent = function (svgdom) {
				return function (event) {
					hideCurrentElement(svgdom);
				};
			}(svgdom);
			var pauseEvent = function (svgdom) {
				return function (event) {
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
}
