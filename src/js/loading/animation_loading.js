var AnimationLoader = {
	/**
	 * Загрузка блока анимации
	 */
	loadAnimationBlock: function() {
		ContentSwitch.addBlock("animation_block", i18n.t("content_links.animation"),
			'<div id="animationLinks"></div>' +
			'<svg id="animation" preserveAspectRatio="xMidYMid meet" ' +
			'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>');
	},

	/**
	 * Загрузка анимации
	 * @param  {Object} animationClass  Класс анимации
	 */
	loadAnimation: function(animationClass) {
		$.animation = new window[animationClass]("animation");
		$("#animation").attr("width", $.animation.width)
				.attr("height", $.animation.height)
				.attr("viewBox", "0 0 " + $.animation.width + " " + $.animation.height);	
	},

	/**
	 * Получить описание определённого класса анимации из массива
	 * @param  {Object} animationClassDefs  Массив описаний классов анимаций (из navigation.js)
	 * @param  {String} animationId         Идентификатор нужного класса
	 * @return {Object}                     Описание класса в виде {id, name, title}
	 */
	getAnimationClassDef: function(animationClassDefs, animationId) {
		for (var i = 0; i < animationClassDefs.length; i++) {
			if (animationId === animationClassDefs[i].id) {
				return animationClassDefs[i];
			}
		}
		return animationClassDefs[0];
	},

	/**
	 * Показать ссылки на варианты анимации
	 * @param  {Object} animationClassDefs  Массив описаний анимаций
	 * @param  {String} animationId         Идентификатор текущей анимации
	 */
	showAnimationLinks: function(animationClassDefs, animationId) {
		var currentClassDef = this.getAnimationClassDef(animationClassDefs, animationId);

		var getAnimationLinks = function(animationClassDefs) {
			var result = "";
			for (var i = 0; i < animationClassDefs.length; i++) {
				if (animationClassDefs[i].id === currentClassDef.id) {
					result += i18n.t(animationClassDefs[i].title);
				} else {					
					result += '<a href="javascript:showAnimation(\'' + animationClassDefs[i].id + '\')" data-i18n="' + animationClassDefs[i].title + '">' +
						i18n.t(animationClassDefs[i].title) + "</a>";
				}
				if (i < animationClassDefs.length - 1) {
					result += ", ";
				}
			}
			return result;
		}
		$("#animationLinks").html(getAnimationLinks(animationClassDefs));
	}
};