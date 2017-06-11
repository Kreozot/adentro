import contentSwitch from './content_switch';

let lapateoLoader = {
	loadZapateoBlock: function (svgName) {
		contentSwitch.addBlock('zapateo_block', localize({ru: 'Сапатео', en: 'Zapateo'})),
			'<object data="svg/zapateo/' + svgName + '.svg" type="image/svg+xml" id="zapateo"></object>');
	}
};

export default zapateoLoader;
