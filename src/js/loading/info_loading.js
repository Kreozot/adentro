import contentSwitch from './content_switch';

let infoLoader = {
	/**
	 * Загрузка информации
	 * @param  {String} info HTML с информацией
	 */
	loadInfoBlock: function (info) {
		if (info) {
			contentSwitch.addBlock('info', localize({ru: 'Информация', en: 'Information'}), info);
		}
	}
};

export default infoLoader;
