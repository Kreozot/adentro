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
