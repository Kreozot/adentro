let contentSwitch = {
	/**
	 * Очистить содержимое страницы
	 */
	clearContent: function () {
		$('#content').empty();
		$('#content_menu').empty().hide();
	},

	/**
	 * Добавить ссылку на блок
	 * @param {String} blockId  Идентификатор блока
	 * @param {String} title     Заголовок ссылки
	 */
	addLink: function (blockId, title) {
		$('#content_menu').append(`<a href="javascript:contentSwitch.show('${blockId}');" class="content_link" id="${blockId}_link">${title}</a>`);
		if ($('#content_menu > a').length > 1) {
			$('#content_menu').show();
		}
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
		this.addLink(id, title);
	}
};

global.contentSwitch = contentSwitch;
export default contentSwitch;
