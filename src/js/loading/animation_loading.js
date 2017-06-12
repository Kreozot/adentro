import contentSwitch from './content_switch';

let animationLoader = {
	/**
	 * Загрузка блока анимации
	 */
	loadAnimationBlock: function () {
		contentSwitch.addBlock('animation_block', localize({ru: 'Хореография', en: 'Choreography'}),
			`<div id="animationLinks"></div>
			<svg id="animation" preserveAspectRatio="xMidYMid meet"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>`);
	},

	/**
	 * Загрузка анимации
	 * @param  {Object} animationClass  Класс анимации
	 */
	loadAnimation: function (animationClass) {
		if ($.animation) {
			$.animation.clear();
		}
		$.animation = new animationClass('animation');
		$('#animation').attr('width', $.animation.width)
			.attr('height', $.animation.height)
			.attr('viewBox', '0 0 ' + $.animation.width + ' ' + $.animation.height);
	},

	/**
	 * Получить описание определённого класса анимации из массива
	 * @param  {Object} animationClassDefs  Массив описаний классов анимаций (из navigation.js)
	 * @param  {String} animationId         Идентификатор нужного класса
	 * @return {Object}                     Описание класса в виде {id, name, title}
	 */
	getAnimationClassDef: function (animationClassDefs, animationId) {
		let animationClass = animationClassDefs.filter(animationClassDef => animationClassDef.id === animationId);
		return animationClass[0] || animationClassDefs[0];
	},

	/**
	 * Показать ссылки на варианты анимации
	 * @param  {Object} animationClassDefs  Массив описаний анимаций
	 * @param  {String} animationId         Идентификатор текущей анимации
	 */
	showAnimationLinks: function (animationClassDefs, animationId) {
		const currentClassDef = this.getAnimationClassDef(animationClassDefs, animationId);

		const getAnimationLinks = function (animationClassDefs) {
			var result = '';
			result += animationClassDefs.map(animationClassDef => {
				if (animationClassDef.id === currentClassDef.id) {
					return animationClassDef.title;
				} else {
					return `<a href="javascript:showAnimation('${animationClassDef.id}')">${animationClassDef.title}</a>`;
				}
			}).join(', ');
			return result;
		};
		$('#animationLinks').html(getAnimationLinks(animationClassDefs));
	}
};

export default animationLoader;
