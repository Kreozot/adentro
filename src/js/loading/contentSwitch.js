const contentSwitch = {
	/**
	 * Очистить содержимое страницы
	 */
	clearContent: function () {
		$('#content').empty();
		$('#content_menu').empty().hide();
	},

	/**
	 * Добавить содержимое блока
	 * @param {String} blockId Идентификатор блока
	 * @param {String} content  Содержимое блока
	 */
	addContent: function (blockId, content) {
		$('#content').append(`<div id="${blockId}">${content}</div>`);
		$('#' + blockId).hide();
	},

	/**
	 * Показать блок
	 * @param  {String} blockId Идентификатор блока
	 */
	show: function (blockId) {
		$(`#content > div:not(#${blockId})`).hide();
		$(`#${blockId}`).show();
		$(`#content_menu > a:not(#${blockId}_link)`).removeClass('active');
		$(`#${blockId}_link`).addClass('active');
	},

	/**
	 * Добавить блок (вместе со ссылкой)
	 * @param {String} id      Идентификатор блока
	 * @param {String} title   Заголовок блока (для ссылки)
	 * @param {String} content Содержимое блока
	 */
	addBlock: function (id, title, content) {
		this.addContent(id, content);
	}
};

export default contentSwitch;
