import { SchemeParams } from "./types";

type GetSchemeParamsCallback = (schemeParams: SchemeParams) => void;
type GetSchemeParamsMap = {
	[key: string]: (callback: GetSchemeParamsCallback) => void;
}

export default {
	arunguita: function (callback) {
		require.ensure(['music/arunguita'], function (require) {
			callback(require('music/arunguita'));
		}, 'arunguita');
	},
	bailecito: function (callback) {
		require.ensure(['music/bailecito'], function (require) {
			callback(require('music/bailecito'));
		}, 'bailecito');
	},
	caramba: function (callback) {
		require.ensure(['music/caramba'], function (require) {
			callback(require('music/caramba'));
		}, 'caramba');
	},
	chacarera: function (callback) {
		require.ensure(['music/chacarera'], function (require) {
			callback(require('music/chacarera'));
		}, 'chacarera');
	},
	chacarera_doble: function (callback) {
		require.ensure(['music/chacarera_doble'], function (require) {
			callback(require('music/chacarera_doble'));
		}, 'chacarera_doble');
	},
	escondido: function (callback) {
		require.ensure(['music/escondido'], function (require) {
			callback(require('music/escondido'));
		}, 'escondido');
	},
	gato: function (callback) {
		require.ensure(['music/gato'], function (require) {
			callback(require('music/gato'));
		}, 'gato');
	},
	gato_cuyano: function (callback) {
		require.ensure(['music/gato_cuyano'], function (require) {
			callback(require('music/gato_cuyano'));
		}, 'gato_cuyano');
	},
	huayra_muyoj: function (callback) {
		require.ensure(['music/huayra_muyoj'], function (require) {
			callback(require('music/huayra_muyoj'));
		}, 'huayra_muyoj');
	},
	huella: function (callback) {
		require.ensure(['music/huella'], function (require) {
			callback(require('music/huella'));
		}, 'huella');
	},
	remedio: function (callback) {
		require.ensure(['music/remedio'], function (require) {
			callback(require('music/remedio'));
		}, 'remedio');
	},
	remedio_atamisqueno: function (callback) {
		require.ensure(['music/remedio_atamisqueno'], function (require) {
			callback(require('music/remedio_atamisqueno'));
		}, 'remedio_atamisqueno');
	},
	zamba: function (callback) {
		require.ensure(['music/zamba'], function (require) {
			callback(require('music/zamba'));
		}, 'zamba');
	},
	zamba_alegre: function (callback) {
		require.ensure(['music/zamba_alegre'], function (require) {
			callback(require('music/zamba_alegre'));
		}, 'zamba_alegre');
	},
} as GetSchemeParamsMap;
