import {ROTATE} from './const';

// Угол поворота после которого срабатывает сглаживание вращения
const FIGURE_ANGLE_TICK = 25;
// Максимальный угол поворота за такт анимации
const FIGURE_ANGLE_SPEED = 3;

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
 * Сгладить угол поворота
 * @param  {Number} newAngle Новый угол
 * @param  {Number} currentAngle Текущий угол
 * @param  {Number} rotateDirection Идентификатор направления поворота (для плавного изменения градуса)
 * @return {Number} Угол с учётом плавного поворота
 */
export function smoothRotationAngle(newAngle, currentAngle, rotateDirection) {
	const angleDiff = normalizeAngle(currentAngle) - normalizeAngle(newAngle);
	if ((Math.abs(angleDiff) > FIGURE_ANGLE_TICK) &&
		(Math.abs(angleDiff) < 360 - FIGURE_ANGLE_TICK)) {
		const rotateTo = rotateDirection ||
			(((angleDiff > 190) || ((angleDiff < 0) && (angleDiff > -180))) ? ROTATE.COUNTERCLOCKWISE : ROTATE.CLOCKWISE);
		if (rotateTo === ROTATE.COUNTERCLOCKWISE) {
			return currentAngle + FIGURE_ANGLE_SPEED;
		} else {
			return currentAngle - FIGURE_ANGLE_SPEED;
		}
	}
	return newAngle;
}
