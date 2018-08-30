import {
	normalizeAngle,
	getAngleDiff,
	smoothRotationAngle,
	getAngleBetweenPoints,
	FIGURE_ANGLE_SPEED,
	FIGURE_ANGLE_TICK,
} from './angles';

describe('angles', () => {
	describe('normalizeAngle', () => {
		test('нормализует угол от -180 до 180', () => {
			const res = normalizeAngle(-270, -180);
			expect(res).toBe(90);
		});
	});

	describe('getAngleBetweenPoints', () => {
		test('должна возвращать 45 если точки являются противоположными углами квадрата', () => {
			const res = getAngleBetweenPoints([90, 90], [0, 0]);
			expect(res).toBe(45);
		});
		test('должна возвращать -135 если вторая точка правее первой', () => {
			const res = getAngleBetweenPoints([0, 0], [90, 90]);
			expect(res).toBe(-135);
		});
	});

	describe('getAngleDiff', () => {
		test('возвращает корректный угол когда оба угла от 0 до 180', () => {
			const res = getAngleDiff(90, 180);
			expect(res).toBe(90);
		});

		test('возвращает корректный угол когда оба угла от 180 до 360', () => {
			const res = getAngleDiff(180, 200);
			expect(res).toBe(20);
		});

		test('возвращает корректный угол когда оба угла от 0 до -180', () => {
			const res = getAngleDiff(-90, -180);
			expect(res).toBe(-90);
		});

		test('возвращает корректный угол когда оба угла от -180 до -360', () => {
			const res = getAngleDiff(-180, -200);
			expect(res).toBe(-20);
		});

		test('возвращает корректный угол когда один угол отрицательный', () => {
			const res = getAngleDiff(-45, 45);
			expect(res).toBe(90);
		});
	});

	describe('smoothRotationAngle', () => {
		test('Должен возвращать угол с плавным изменением, если разница углов выше пороговой', () => {
			const currentAngle = 180;
			const newAngle = currentAngle + FIGURE_ANGLE_TICK + 1;
			const res = smoothRotationAngle(newAngle, currentAngle);
			expect(res).toBe(currentAngle + FIGURE_ANGLE_SPEED);
		});

		test('Должен возвращать угол с плавным изменением, если разница углов выше пороговой (отрицательная)', () => {
			const currentAngle = 180;
			const newAngle = currentAngle - FIGURE_ANGLE_TICK - 1;
			const res = smoothRotationAngle(newAngle, currentAngle);
			expect(res).toBe(currentAngle - FIGURE_ANGLE_SPEED);
		});
	});
});
