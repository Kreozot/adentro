import {ROTATE} from './const';

// Угол поворота после которого срабатывает сглаживание вращения
export const FIGURE_ANGLE_TICK = 25;
// Максимальный угол поворота за такт анимации
export const FIGURE_ANGLE_SPEED = 3;

// Транспонирует угол в промежуток от startingAngle до startingAngle + 360
export function normalizeAngle(angle, startingAngle = 0) {
	if (angle > startingAngle + 360) {
		angle = angle - 360;
	}
	if (angle < startingAngle) {
		angle = 360 + angle;
	}
	return Math.round(angle);
}

/**
 * Получить разницу между двумя углами
 * @param {Number} angle1 Угол в градусах
 * @param {Number} angle2 Второй угол в градусах
 */
export function getAngleDiff(angle1, angle2) {
	return normalizeAngle(normalizeAngle(angle2, -180) - normalizeAngle(angle1, -180), -180);
}

/**
 * Сгладить угол поворота
 * @param  {Number} newAngle Новый угол
 * @param  {Number} currentAngle Текущий угол
 * @param  {Number} rotateDirection Идентификатор направления поворота (для плавного изменения градуса)
 * @return {Number} Угол с учётом плавного поворота
 */
export function smoothRotationAngle(newAngle, currentAngle, rotateDirection) {
	const angleDiff = getAngleDiff(currentAngle, newAngle);
	if ((Math.abs(angleDiff) > FIGURE_ANGLE_TICK) &&
		(Math.abs(angleDiff) < 360 - FIGURE_ANGLE_TICK)) {
		const rotateTo = rotateDirection ||
			(angleDiff > 0 ? ROTATE.COUNTERCLOCKWISE : ROTATE.CLOCKWISE);
		if (rotateTo === ROTATE.COUNTERCLOCKWISE) {
			return currentAngle + FIGURE_ANGLE_SPEED;
		} else {
			return currentAngle - FIGURE_ANGLE_SPEED;
		}
	}
	return newAngle;
}

/**
 * Получить угол между прямой, соединяющей две точки и горизонтальной осью
 * @param {Array} point1 Координаты [x, y] первой точки
 * @param {Array} point2 Координаты [x, y] второй точки
 */
export function getAngleBetweenPoints(point1, point2) {
	const lengthX = point1[0] - point2[0];
	const lengthY = point1[1] - point2[1];
	// Угол, корректирующий направление угла в зависимости от того, какая фигура правее
	const directionFix = lengthX > 0 ? 0 : -180;

	return (Math.atan(lengthY / lengthX) * 180 / Math.PI) + directionFix;
}
