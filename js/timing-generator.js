function ElementTiming(elementId, times) {
	this.elementId = elementId;
	this.times = times;
	this.beats = [];

	//Добавляем долю. Если больше некуда, возвращаем false
	this.addBeat = function(seconds) {		
		if (this.beats.length < this.times) {
			this.beats[this.beats.length] = seconds;

			console.log(this.beats.length + " beat on " + seconds + " (" + this.elementId + ")");
			return true;
		} else {
			return false;
		}
	}
	
	this.getAverageBeatTime = function(index) {
		// Находим длительность всех долей, кроме последней
		var beatsLen = this.beats.map(function(beat, i, beats) {
			if (i == beats.length - 1) {
				return 0;
			} else {
				return beats[i + 1] - beat;
			}
		});
		// Считаем сумму длительностей
		var beatsLenSum = beatsLen.reduce(function(sum, value) {
			return sum + value;
		}, 0);
		// Вычисляем среднюю длительность
		return beatsLenSum / (this.times - 1);
	};

	// Получить время первой секунды элемента (за пол доли до первой сильной доли)
	this.getBeginTime = function() {
		var time = this.beats[0] - this.getAverageBeatTime();
		if (!time) {
			time = this.beats[0];
		}
		time = Math.round(time * 10) / 10;
		return time;
	}
}

function TimingGenerator() {

	this.getElementsList = function() {
		var elementsList = [];

		function addElement(id, times) {
			elementsList[elementsList.length] = {id: id, times: times};
		}

		var svgobject = document.getElementById('schema');
		if ('contentDocument' in svgobject) {
			var svgdom = jQuery(svgobject.contentDocument);
			var currentY = 0;
			var currentPart = 1;

			$("rect.element", svgdom).each(function(index, element) {
				// Если перешли на новую строку, добавляем паузу
				if (element.attributes.y.value != currentY) {
					currentY = element.attributes.y.value;
					if (currentPart != 1) {
						addElement("#pause_" + currentPart, 1);
					}
					addElement("#start_" + currentPart, 1);
					currentPart += 1;
				}
				addElement(element.id, element.dataset.times);
			});
			addElement("#end", 1);

			return elementsList;
		};
	}

	this.elementsList = this.getElementsList();
	console.log(this.elementsList);
	this.elementsTiming = [];
	this.currentElementIndex = 0;
	this.lastTimeValue = 0;

	this.clear = function() {
		this.elementsTiming = [];
		this.currentElementIndex = 0;
		this.lastTimeValue = 0;
	};

	this.addBeat = function(seconds) {
		if (this.currentElementIndex >= this.elementsList.length) {
			console.log("finish");
			return false;
		}
		var currentElement = this.elementsList[this.currentElementIndex];

		if (this.currentElementIndex >= this.elementsTiming.length) {
			this.elementsTiming[this.elementsTiming.length] = new ElementTiming(currentElement.id, currentElement.times);
			markCurrentElementOnSchema(currentElement.id);
		}
		if (!this.elementsTiming[this.elementsTiming.length - 1].addBeat(seconds)) {
			this.currentElementIndex += 1;
			this.addBeat(seconds);
		}
		return true;
	};

	this.getTiming = function() {
		var newTiming = {};
		for (var i = 0; i < this.elementsTiming.length; i++) {
			newTiming[this.elementsTiming[i].elementId] = this.elementsTiming[i].getBeginTime();
		};
		return newTiming;
	};
}