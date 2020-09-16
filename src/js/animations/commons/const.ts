export enum STEP_STYLE {
	BASIC = 0,
	ZAPATEO = 1,
	SIMPLE = 2,
	ZAMBA = 3
};

export enum LEGS {
	LEFT = 'left',
	RIGHT = 'right'
};

/** Направления фигур относительно траектории */
export enum DIRECTIONS {
	/** Головой по тректории */
	FORWARD = 0,
	/** Спиной по траектории */
	BACKWARD = 1,
	/** Головой в исходном направлении вне зависимости от траектории */
	STRAIGHT_FORWARD = 2
};

export enum FIGURE_HANDS {
	CASTANETAS = 'castanetas',
	PANUELO = 'panuelo',
	DOWN = 'down',
	ZARANDEO = 'zarandeo',
};

export enum ROTATE {
	COUNTERCLOCKWISE = 1,
	CLOCKWISE = 2
};
