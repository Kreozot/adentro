import contentSwitch from './content_switch';

let lapateoLoader = {
	loadZapateoBlock: function (svg) {
		contentSwitch.addBlock('zapateo_block', localize({ru: 'Сапатео', en: 'Zapateo'}),
			'<object data="svg/zapateo/' + svg + '.svg" type="image/svg+xml" id="zapateo"></object>');
	}
};

export default zapateoLoader;
