var ContentSwitch = {
	/**
	 * Очистить содержимое страницы
	 */
	clearContent: function () {
		$('#content').empty();
		$('#content_menu').empty();
	},

	/**
	 * Добавить ссылку на блок
	 * @param {String} block_id  Идентификатор блока
	 * @param {String} title     Заголовок ссылки
	 */
	addLink: function (block_id, title) {
		$('#content_menu').append('<a href="javascript:ContentSwitch.show(\'' + block_id +
			'\');" class="content_link" id="' + block_id + '_link">' + title + '</a>');
	},

	/**
	 * Добавить содержимое блока
	 * @param {String} block_id Идентификатор блока
	 * @param {String} content  Содержимое блока
	 */
	addContent: function (block_id, content) {
		$('#content').append('<div id="' + block_id + '">' + content + '</div>');
		$('#' + block_id).hide();
	},

	/**
	 * Показать блок
	 * @param  {String} block_id Идентификатор блока
	 */
	show: function (block_id) {
		$('#content > div:not(#' + block_id + ')').hide();
		$('#' + block_id).show();
		$('#content_menu > a:not(#' + block_id + '_link)').removeClass('active');
		$('#' + block_id + '_link').addClass('active');
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
