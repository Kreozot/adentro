import Navigation from './navigation';
import Player from './player';
import contentSwitch from './loading/content_switch';
import animationLoader from './loading/animation_loading';
import infoLoader from './loading/info_loading';
import {getElement} from './timing/timing';
import TimingGenerator from './timing/timing-generator';
import Tour from './tour';

const playerSelector = '#jplayer';

/**
 * Получить ссылку на dom svg-схемы
 * @return  {String}  Ссылка на dom svg-схемы
 */
const getSvgSchemaDom = () => $('#schemaDiv svg');

class Adentro {
	constructor() {
		this.navigation = new Navigation(this);
		this.player = new Player(this);
	}

	/**
	 * Спрятать отображение текущего элемента на схеме
	 * @param  {String} svgSchemaDom Ссылка на dom svg-схемы
	 */
	hideCurrentElementMarkOnSchema(svgSchemaDom) {
		if (!svgSchemaDom) {
			svgSchemaDom = getSvgSchemaDom();
		}
		Snap.selectAll('text.current, rect.current').forEach(function (elem) {
			elem.removeClass('current');
		});
	}

	/**
	 * Спрятать отображение и визуализацию текущего элемента
	 * @param  {String} svgSchemaDom Ссылка на dom svg-схемы
	 */
	hideCurrentElement(svgSchemaDom) {
		this.hideCurrentElementMarkOnSchema(svgSchemaDom);
		$.animation.clear();
		$(playerSelector).data('currentElement', '');
	}

	/**
	 * Выделение текущего элемента на SVG-схеме
	 * @param  {String} element 	  Идентификатор элемента
	 * @param  {String} svgSchemaDom  Ссылка на dom svg-схемы
	 */
	markCurrentElementOnSchema(element, svgSchemaDom) {
		if (!svgSchemaDom) {
			svgSchemaDom = getSvgSchemaDom();
		}
		if (element[0] === '#') {
			//Пропускаем обработку служебных меток
			return;
		}
		// Показываем рамку вокруг текущего блока
		const frameId = element + '-frame';
		Snap.selectAll('rect.current:not(#' + frameId + ')').forEach(function (elem) {
			elem.removeClass('current');
		});
		Snap('#' + frameId).addClass('current');
		// Выделяем название текущего элемента
		const textId = element + '-text';
		Snap.selectAll('text.current:not(#' + textId + ')').forEach(function (elem) {
			elem.removeClass('current');
		});
		Snap('#' + textId).addClass('current');
	}

	/**
	 * Отображение текущего элемента
	 * @param  {String} element 	  Идентификатор элемента
	 * @param  {Number} seconds    	  Длительность в секундах
	 * @param  {String} svgSchemaDom  Ссылка на dom svg-схемы
	 */
	showCurrentElement(element, seconds, svgSchemaDom) {
		if (!svgSchemaDom) {
			svgSchemaDom = getSvgSchemaDom();
		}
		if (element.split('_')[0] === '#start') {
			// Начальное расположение
			$.animation.setAtStart();
			this.hideCurrentElementMarkOnSchema();
			return;
		} else if (element[0] === '#') {
			//Пропускаем обработку служебных меток
			return;
		}

		this.markCurrentElementOnSchema(element, svgSchemaDom);
		// Запускаем соответствующую анимацию
		const domElement = $('#' + element, svgSchemaDom);
		const visualizationFuncName = domElement.data('visualization');
		const manPosition = domElement.data('manposition');
		const beats = domElement.data('times');
		if (visualizationFuncName) {
			$.animation[visualizationFuncName](seconds, manPosition, beats);
		}
	}

	/**
	 * Иницилизация схемы
	 */
	initSvgSchema() {
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
						}
					}
				}
			};
			const endedEvent = event => {
				this.hideCurrentElement(svgdom);
			};
			const pauseEvent = event => {
				let playerStatus = event.jPlayer.status;
				if ((playerStatus.paused) && (playerStatus.currentTime > 0)) {
					$.animation.pause();
				}
			};

			$(playerSelector)
				.bind($.jPlayer.event.timeupdate, timeupdateEvent)
				.bind($.jPlayer.event.ended, endedEvent)
				.bind($.jPlayer.event.pause, pauseEvent);
		}
	}

	/**
	 * Инициализация редактора тайминга
	 */
	initSvgSchemaEditor() {
		const svgdom = getSvgSchemaDom();
		if (svgdom) {
			$('#schema')
				.attr('width', $('svg', svgdom).attr('width'))
				.attr('height', $('svg', svgdom).attr('height'));
		}
	}

	/**
	 * Отобразить ссылки на музыкальные композиции
	 * @param  {Object} musicData          Массив информации о композициях
	 * @param  {String} currentMusicId    Идентификатор текущей композиции
	 * @param  {Boolean} showEmptyTiming  Показывать композиции, не имеющие разметки тайминга
	 */
	showMusicLinks(musicData, currentMusicId, showEmptyTiming) {
		if (musicData.length <= 1) {
			$('#musicLinks').html('');
			return;
		}

		const getMusicLinks = function () {
			var result = localize({ru: 'Композиция', en: 'Composition'}) + ': <select id="musicSelect">';
			var count = 0;
			musicData.forEach(musicDataEntry => {
				if (!$.isEmptyObject(musicDataEntry.schema) || showEmptyTiming) {
					if (musicDataEntry.id === currentMusicId) {
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

		const navigation = this.navigation;

		$('#musicLinks').html(getMusicLinks());
		$('#musicSelect').change(function () {
			navigation.showMusic($(this).val());
		});
	}

	/**
	 * Показать ссылки на языки
	 */
	showLanguageLinks() {
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
			return (lang.id === this.lang);
		};

		const getLanguageLinks = () => {
			let result = '<nobr>';
			result += languages.map(lang => {
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
	 * @param  {String} schemeParams   Объект параметров схемы
	 * @param  {String} musicId    	   Идентификатор музыки
	 * @param  {String} animationId    Идентификатор конкретной анимации (если в animationClass пришёл список)
	 */
	loadSchema(schemeParams, musicId, animationId) {
		// TODO: Сделать загрузку анимации, информации и сапатео как отдельные блоки (в блоке content + ссылки в content_menu)

		$('#danceName').html(schemeParams.name);
		$('#schemaDiv').html(schemeParams.svg);

		musicId = musicId || schemeParams.music[0].id;
		this.showMusicLinks(schemeParams.music, musicId);
		const musicSchema = schemeParams.music.filter(data => data.id === musicId)[0];

		$(playerSelector)
			.unbind($.jPlayer.event.timeupdate)
			.unbind($.jPlayer.event.ended)
			.unbind($.jPlayer.event.pause);
		this.player.loadMusicSchema(musicSchema);
		this.initSvgSchema();

		contentSwitch.clearContent();

		animationLoader.loadAnimationBlock();
		let animationClass = schemeParams.animation;
		if (typeof animationClass === 'object') {
			animationId = animationId ? animationId : animationClass[0].id;
			animationLoader.showAnimationLinks(animationClass, animationId);
			let currentClassDef = animationLoader.getAnimationClassDef(animationClass, animationId);
			animationClass = currentClassDef.animClass;
		}
		animationLoader.loadAnimation(animationClass);

		infoLoader.loadInfoBlock(schemeParams.info);

		contentSwitch.show('animation_block');
	}

	/**
	 * Загрузка редактора тайминга
	 * @param  {String} schemeParams   Объект параметров схемы
	 * @param  {String} musicId    	   Идентификатор музыки
	 */
	loadSchemaEditor(schemeParams, musicId) {
		$('#danceName').html(schemeParams.name + ' (editor mode)');
		$('#schemaDiv').html(schemeParams.svg);

		$(playerSelector).unbind($.jPlayer.event.timeupdate)
			.unbind($.jPlayer.event.ended)
			.unbind($.jPlayer.event.pause);

		musicId = musicId || schemeParams.music[0].id;
		this.showMusicLinks(schemeParams.music, musicId, true);
		const musicSchema = schemeParams.music.filter(data => data.id === musicId)[0];

		this.player.loadMusicSchema(musicSchema);
		this.initSvgSchemaEditor();

		console.log('editor mode on');
		$('#animationDiv').html('');
		// const initTiming = $(playerSelector).data('schema');
		const timingGenerator = new TimingGenerator();

		const timeupdateEvent = event => {
			// Если остановлено
			if ((event.jPlayer.status.paused) && (event.jPlayer.status.currentTime == 0)) {
				this.hideCurrentElementMarkOnSchema();
				timingGenerator.clear();
			}
		};

		$(playerSelector).bind($.jPlayer.event.timeupdate, timeupdateEvent);

		$('html').keypress(event => {
			if (event.which == 32) { //space
				const currentTime = $(playerSelector).data('jPlayer').status.currentTime;
				if (!timingGenerator.addBeat(currentTime)) {
					const newTiming = timingGenerator.getTiming();
					$('#content').html('<pre>' + JSON.stringify(newTiming, '', 4) + '</pre>');
				}
			}
		});
	}

	localize(textObj) {
		return textObj[this.lang];
	}
}

global.adentro = new Adentro();
global.playElement = element => adentro.player.playElement(element);
global.showAnimation = animation => adentro.navigation.showAnimation(animation);
global.showMusic = music => adentro.navigation.showMusic(music);
global.localize = textObj => adentro.localize(textObj);
global.markCurrentElementOnSchema = elem => adentro.markCurrentElementOnSchema(elem);
global.tour = new Tour();
export default Adentro;

$(window).load(function () {
	window.addEventListener('popstate', function (e) {
		adentro.navigation.loadSchemaByState();
	});

	if (!adentro.navigation.loadSchemaByUrl()) {
		adentro.navigation.showSchema('chacarera');
	}

	tour.startFirstTime();
});
