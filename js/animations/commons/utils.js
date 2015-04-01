function extend(Child, Parent) {
	var F = function() { }
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

/**
 * Таймер
 * @param {Function} callback Функция
 * @param {Number}   delay    Задержка в мс
 */
function Timer(callback, delay) {
	var remaining = delay;
	if (!remaining) {
		remaining = 0;
	};
	var paused = true, timerId, start;

	this.pause = function() {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
		paused = true;
	};

	this.resume = function() {
		if (paused && (remaining >= 0)) {
			paused = false;
			start = new Date();
			timerId = window.setTimeout(callback, remaining);
		};
	};

	this.resume();
}

/**
 * Получение противоположной позиции
 * @param  {String} position Позиция
 * @return {String}          Позиция, противоположная указанной
 */
function getOppositePosition(position) {
	switch (position) {
		case "start_left":
			return "start_right";
		case "start_right":
			return "start_left";
		case "left":
			return "right";
		case "right":
			return "left";
		case "top":
			return "bottom";
		case "bottom":
			return "top";
		default:
			return "left";
	}
};
