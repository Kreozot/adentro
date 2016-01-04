import Navigation from './navigation.js';
import Player from './player.js';
import contentSwitch from './loading/content_switch.js';
import animationLoader from './loading/animation_loading.js';
import infoLoader from './loading/info_loading.js';
import {getElement} from './timing/timing.js';

var playerSelector = '#jplayer';

function supports_history_api() {
	return !!(window.history && history.pushState);
}

/**
 * Получить ссылку на dom svg-схемы
 * @return  {String}  Ссылка на dom svg-схемы
 */
var getSvgSchemaDom = function () {
	return $('#schemaDiv svg');//getObjectDom('schema');
};

class Adentro {

	constructor () {
		this.navigation = new Navigation(this);
		this.player = new Player(this);
	}

	/**
	 * Спрятать отображение текущего элемента на схеме
	 * @param  {String} svgSchemaDom Ссылка на dom svg-схемы
	 */
	hideCurrentElementMarkOnSchema (svgSchemaDom) {
		if (!svgSchemaDom) {
			svgSchemaDom = getSvgSchemaDom();
		}
		$('rect', svgSchemaDom).removeClass('current');
		$('text', svgSchemaDom).removeClass('current');
	}

	/**
	 * Спрятать отображение и визуализацию текущего элемента
	 * @param  {String} svgSchemaDom Ссылка на dom svg-схемы
	 */
	hideCurrentElement (svgSchemaDom) {
		this.hideCurrentElementMarkOnSchema(svgSchemaDom);
		$.animation.clear();
		$(playerSelector).data('currentElement', '');
	}

	/**
	 * Выделение текущего элемента на SVG-схеме
	 * @param  {String} element 	  Идентификатор элемента
	 * @param  {String} svgSchemaDom  Ссылка на dom svg-схемы
	 */
	markCurrentElementOnSchema (element, svgSchemaDom) {
		if (!svgSchemaDom) {
			svgSchemaDom = getSvgSchemaDom();
		}
		if (element[0] == '#') {
			//Пропускаем обработку служебных меток
			return;
		}
		// Показываем рамку вокруг текущего блока
		var frameId = element + '-frame';
		$('rect:not(#' + frameId + ')', svgSchemaDom).removeClass('current');
		$('#' + frameId, svgSchemaDom).addClass('current');
		// Выделяем название текущего элемента
		var textId = element + '-text';
		$('text:not(#' + textId + ')', svgSchemaDom).removeClass('current');
		$('#' + textId, svgSchemaDom).addClass('current');
	}

	/**
	 * Отображение текущего элемента
	 * @param  {String} element 	  Идентификатор элемента
	 * @param  {Number} seconds    	  Длительность в секундах
	 * @param  {String} svgSchemaDom  Ссылка на dom svg-схемы
	 */
	showCurrentElement (element, seconds, svgSchemaDom) {
		if (!svgSchemaDom) {
			svgSchemaDom = getSvgSchemaDom();
		}
		if (element.split('_')[0] == '#start') {
			// Начальное расположение
			$.animation.setAtStart();
			this.hideCurrentElementMarkOnSchema();
			return;
		} else if (element[0] == '#') {
			//Пропускаем обработку служебных меток
			return;
		}

		this.markCurrentElementOnSchema(element, svgSchemaDom);
		// Запускаем соответствующую анимацию
		var domElement = $('#' + element, svgSchemaDom);
		var visualizationFuncName = domElement.data('visualization');
		var manPosition = domElement.data('manposition');
		var beats = domElement.data('times');
		if (visualizationFuncName) {
			$.animation[visualizationFuncName](seconds, manPosition, beats);
		}
	}

	/**
	 * Иницилизация схемы
	 */
	initSvgSchema () {
		const svgdom = getSvgSchemaDom();
		let $player = $(playerSelector);
		if (svgdom) {
			// $('#schema').attr('width', $('svg', svgdom).attr('width'))
			// 		.attr('height', $('svg', svgdom).attr('height'));

			const timeupdateEvent = event => {
				const playerStatus = event.jPlayer.status;
				// Если остановлено
				if ((playerStatus.paused) && (playerStatus.currentTime == 0)) {
					this.hideCurrentElement(svgdom);
				} else if ((!playerStatus.paused) &&
						(!playerStatus.waitForPlay) &&
						(!playerStatus.waitForLoad)) {
					$.animation.resume();
					const time = playerStatus.currentTime;
					const element = getElement($player.data('schema'), time);
					if ($player.data('currentElement') != element.name) {
						$player.data('currentElement', element.name);
						if (element && (element.name.length > 0)) {
							this.showCurrentElement(element.name, element.timeLength, svgdom);
						};
					};
				};
			};
			const endedEvent = event => {
				this.hideCurrentElement(svgdom);
			};
			const pauseEvent = event => {
				let playerStatus = event.jPlayer.status;
				if ((playerStatus.paused) && (playerStatus.currentTime > 0)) {
					$.animation.pause();
				};
			};

			$(playerSelector)
				.bind($.jPlayer.event.timeupdate, timeupdateEvent)
				.bind($.jPlayer.event.ended, endedEvent)
				.bind($.jPlayer.event.pause, pauseEvent);
		};
	}

	/**
	 * Инициализация редактора тайминга
	 */
	initSvgSchemaEditor () {
		const svgdom = getSvgSchemaDom();
		if (svgdom) {
			$('#schema')
				.attr('width', $('svg', svgdom).attr('width'))
				.attr('height', $('svg', svgdom).attr('height'));
		};
	}

	/**
	 * Отобразить ссылки на музыкальные композиции
	 * @param  {Object} musicData          Массив идентификаторов композиций
	 * @param  {String} currentMusicId    Идентификатор текущей композиции
	 * @param  {Boolean} showEmptyTiming  Показывать композиции, не имеющие разметки тайминга
	 */
	showMusicLinks (musicData, currentMusicId, showEmptyTiming) {
		if (musicData.length <= 1) {
			$('#musicLinks').html('');
			return;
		}

		var getMusicLinks = function () {
			var result = localize({ru: 'Композиция', en: 'Composition'}) + ': <select id="musicSelect">';
			var count = 0;
			musicData.forEach(musicDataEntry => {
				if (!$.isEmptyObject(musicDataEntry.schema) || showEmptyTiming) {
					if (musicDataEntry === currentMusicId) {
						result += `<option selected="selected" value="${musicDataEntry.id}">${musicDataEntry.title}</option>`;
					} else {
						result += `<option value="${musicDataEntry.id}">${musicDataEntry.title}</option>`;
					}
					count++;
				}
			});
			if (count <= 1) {
				return '';
			}
			result += '</select>';
			return result;
		};

		$('#musicLinks').html(getMusicLinks());
		$('#musicSelect').change(function () {
			showMusic($(this).val());
		});
	}

	/**
	 * Показать ссылки на языки
	 */
	showLanguageLinks () {
		var languages = [
			{
				id: 'ru',
				title: 'ru'
			},
			{
				id: 'en',
				title: 'en'
			}
		];

		const isCurrentLang = lang => {
				// if ((lang.id == i18n.lng()) || (lang.id == i18n.lng().substr(0, 2))) {
			return false;
		}

		const getLanguageLinks = () => {
			let result = '<nobr>';
			result += languages.map(lang => {
				// TODO: Починить переключение языков
				if (isCurrentLang(lang)) {
					return lang.title;
				} else {
					return `<a href="${this.navigation.getLanguageLink(lang.id)}">${lang.title}</a>`;
				}
			}).join(' / ');
			result += '</nobr>';
			return result;
		};

		$('#lang').html(getLanguageLinks());
	}

	/**
	 * Загрузка схемы
	 * @param  {String} schemaParams   Объект параметров схемы
	 * @param  {String} musicId    	   Идентификатор музыки
	 * @param  {String} animationId    Идентификатор конкретной анимации (если в animationClass пришёл список)
	 */
	loadSchema (schemaParams, musicId, animationId) {
		// TODO: Сделать загрузку анимации, информации и сапатео как отдельные блоки (в блоке content + ссылки в content_menu)
		$('#danceName').html(schemaParams.name);
		$('#schemaDiv').html(schemaParams.svgName);

		musicId = musicId || schemaParams.music[0].id;
		this.showMusicLinks(schemaParams.music, musicId);
		var musicSchema = schemaParams.music.filter(data => data.id === musicId)[0];

		$(playerSelector)
			.unbind($.jPlayer.event.timeupdate)
			.unbind($.jPlayer.event.ended)
			.unbind($.jPlayer.event.pause);
		this.player.loadMusicSchema(musicSchema);
		this.initSvgSchema();

		contentSwitch.clearContent();

		animationLoader.loadAnimationBlock();
		var animationClass = schemaParams.animation;
		if (typeof animationClass === 'object') {
			animationId = animationId ? animationId : animationClass[0].id;
			animationLoader.showAnimationLinks(animationClass, animationId);
			var currentClassDef = animationLoader.getAnimationClassDef(animationClass, animationId);
			animationClass = currentClassDef.animClass;
		}
		animationLoader.loadAnimation(animationClass);

		infoLoader.loadInfoBlock(schemaParams.info);

		// if (schemaParams.zapateo) {
		// 	ZapateoLoader.loadZapateoBlock('repike');
		// }

		contentSwitch.show('animation_block');
	}

	/**
	 * Загрузка редактора тайминга
	 * @param  {String} schemaParams   Объект параметров схемы
	 * @param  {String} musicId    	   Идентификатор музыки
	 */
	loadSchemaEditor (schemaParams, musicId) {
		$('#danceName').html(schemaParams.name + ' (editor mode)');
		$('#schemaDiv').html(schemaParams.svgName);

		$(playerSelector).unbind($.jPlayer.event.timeupdate)
			.unbind($.jPlayer.event.ended)
			.unbind($.jPlayer.event.pause);

		musicId = musicId || schemaParams.music[0].id;
		this.showMusicLinks(schemaParams.music, musicId, true);
		var musicSchema = schemaParams.music.filter(data => data.id === musicId)[0];

		this.player.loadMusicSchema(musicSchema);
		this.initSvgSchemaEditor();

		console.log('editor mode on');
		$('#animationDiv').html('');
		var initTiming = $(playerSelector).data('schema');
		var timingGenerator = new TimingGenerator(initTiming);

		var timeupdateEvent = event => {
			// Если остановлено
			if ((event.jPlayer.status.paused) && (event.jPlayer.status.currentTime == 0)) {
				this.hideCurrentElementMarkOnSchema();
				timingGenerator.clear();
			}
		};

		$(playerSelector).bind($.jPlayer.event.timeupdate, timeupdateEvent);

		$('html').keypress(event => {
			if (event.which == 32) { //space
				var currentTime = $(playerSelector).data('jPlayer').status.currentTime;
				if (!timingGenerator.addBeat(currentTime)) {
					var newTiming = timingGenerator.getTiming();
					$('#content').html('<pre>' + JSON.stringify(newTiming, '', 4) + '</pre>');
				}
			}
		});
	}

}

global.adentro = new Adentro();
global.playElement = element => adentro.player.playElement(element);
global.showSchema = schemaId => adentro.navigation.showSchema(schemaId);
export default Adentro;
