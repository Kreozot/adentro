const positions = [
	['start_left', 'start_right'],
	['left', 'right'],
	['top', 'bottom']
];

/**
 * Получение противоположной позиции
 * @param  {String} position Позиция
 * @return {String}          Позиция, противоположная указанной
 */
export function getOppositePosition(position) {
	for (var i = 0; i < positions.length; i++) {
		const pair = positions[i];
		if (position === pair[0]) {
			return pair[1];
		}
		if (position === pair[1]) {
			return pair[0];
		}
	}
	return 'left';
}

/**
 * Дробная часть от деления
 * @param  {Number} upVal   Числитель
 * @param  {Number} downVal Знаменатель
 * @return {Number}         Дробная часть от деления
 */
export function mod(upVal, downVal) {
	const divVal = upVal / downVal;
	return divVal - Math.floor(divVal);
}

export function getFigureCenter(figure) {
	// Исправлено на getBoundingClientRect из-за 10-кратной разницы производительности
	// const bBox = figure.getBBox();
	// return [bBox.cx, bBox.cy];
	const rect = figure.node.getBoundingClientRect();
	return [rect.x + rect.width / 2, rect.y + rect.height / 2];
}
