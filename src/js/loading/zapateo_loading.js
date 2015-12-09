var ZapateoLoader = {
	loadZapateoBlock: function (svgName) {		
		ContentSwitch.addBlock('zapateo_block', i18n.t('content_links.zapateo'),
			'<object data="svg/zapateo/' + svgName + '.svg" type="image/svg+xml" id="zapateo"></object>');
	}
};