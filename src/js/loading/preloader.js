/**
 * Включить прелоадер у элемента
 */
export function enablePreloaderInItem($elements) {
	return $elements.each(function () {
		const $element = $(this);
		const element = $element[0];

		if ($element.hasClass('preloader')) {
			return false;
		}

		let classList = ['preloader'];

		const positionCssProp = getCssProps($element, ['position']);
		switch (positionCssProp.position) {
			case 'absolute':
			case 'fixed':
				classList.push('preloader--is-flow-item');
				break;
		}

		$element.addClass(classList.join(' '));
	});
}

/**
 * Отключить прелоадер у элемента
 */
export function disablePreloaderInItem($elements) {
	return $elements.each(function () {
		const $element = $(this);

		$element
			.removeClass('preloader')
			.removeClass('preloader--is-flow-item');
	});
}

/**
 * Отключить прелоадер у элемента
 */
export function itHasPreloader($element) {
	return ($element.length && $element.hasClass('preloader'));
}

/**
 * Берет стили у элемента по маске
 * Метод легко расширяем под дефолтный забор любых свойств
 * Также можно передавать свой набор необхоимых свойств
 * @param $item
 * @param props - передаваемый массив параметров
 * @returns {{}}
 */
function getCssProps($item, props = []) {
	let result = {},
		propsMap = [
			'border-top-style',
			'border-top-color',
			'border-bottom-style',
			'border-bottom-color',
			'border-left-style',
			'border-left-color',
			'border-right-style',
			'border-right-color',
			'background-color',
			'vertical-align',
			'text-align',
			'white-space',
			'font-weight',
			'color',
			'font-size',
			'text-decoration-line',
			'font-style',
			'display',
			'position'
		];

	if (props.length) {
		propsMap = props.filter(function (i) {
			return propsMap.indexOf(i) !== -1;
		});
	}

	return $item.css(propsMap);
}
