var InfoLoader = {
	/**
	 * Загрузка информации
	 * @param  {String} infoName Имя файла с информацией (без расширения)
	 */
	loadInfoBlock: function (infoName) {
		if (infoName) {
			$.get('info/' + infoName + '.inc', function (data) {
				ContentSwitch.addBlock('info', i18n.t('content_links.info'), data);
			});
		};
	}
};