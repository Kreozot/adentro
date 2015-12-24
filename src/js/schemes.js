module.exports = {
	bailecito: function (callback) {
		require.ensure(['schemeParams/bailecito.js'], function (require) {
			callback(require('schemeParams/bailecito.js'));
		});
	},
	caramba: function (callback) {
		require.ensure(['schemeParams/caramba.js'], function (require) {
			callback(require('schemeParams/caramba.js'));
		});
	},
	chacarera: function (callback) {
		require.ensure(['schemeParams/chacarera.js'], function (require) {
			callback(require('schemeParams/chacarera.js'));
		});
	},
	chacarera_6: function (callback) {
		require.ensure(['schemeParams/chacarera_6.js'], function (require) {
			callback(require('schemeParams/chacarera_6.js'));
		});
	},
	chacarera_doble: function (callback) {
		require.ensure(['schemeParams/chacarera_doble.js'], function (require) {
			callback(require('schemeParams/chacarera_doble.js'));
		});
	},
	chacarera_doble_6: function (callback) {
		require.ensure(['schemeParams/chacarera_doble_6.js'], function (require) {
			callback(require('schemeParams/chacarera_doble_6.js'));
		});
	},
	escondido: function (callback) {
		require.ensure(['schemeParams/escondido.js'], function (require) {
			callback(require('schemeParams/escondido.js'));
		});
	},
	gato: function (callback) {
		require.ensure(['schemeParams/gato.js'], function (require) {
			callback(require('schemeParams/gato.js'));
		});
	},
};
