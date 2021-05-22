import { Element, Timing } from '../types';

export const getElementAfter = function (timing: Timing, time: number): Element {
	const nextElement = {name: '', time: 10000};

	for (let key in timing) {
		if (timing.hasOwnProperty(key)) {
			const value = timing[key];

			if (((value - time) > 0) &&
				((value - time) < (nextElement.time - time))) {
				nextElement.name = key;
				nextElement.time = value;
			}
		}
	}

	return nextElement;
};

/**
 * Получить элемент хореографии для данного момента в музыке
 * @param  {Object} timing Тайминг элементов
 * @param  {Number} time Позиция музыки в секундах
 * @return {Object}      Объект нужного элемента с параметрами name, time, timeLength
 */
export const getElement = function (timing: Timing, time: number): Element {
	const nearestElement: Element = {name: '', time: -1};
	for (let key in timing) {
		if (timing.hasOwnProperty(key)) {
			const value = timing[key];

			if (((time - value) >= 0) && ((time - value) < (time - nearestElement.time))) {
				nearestElement.name = key;
				nearestElement.time = value;
			}
		}
	}

	const nextElement = getElementAfter(timing, nearestElement.time);
	nearestElement.timeLength = nextElement.time - nearestElement.time;
	nearestElement.nextElementId = nextElement.name;

	return nearestElement;
};
