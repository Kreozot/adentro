import Navigation from './navigation';
import Player from './player';
import contentSwitch from './loading/content_switch';
import AnimationLoader from './loading/AnimationLoader';
import TimingGenerator from './timing/TimingGenerator';
import Tour from './tour';

import schemeTemplate from './templates/scheme.ejs';
import musicLinksTemplate from './templates/musicLinks.ejs';
import langLinksTemplate from './templates/langLinks.ejs';

const playerSelector = '#player';

const KEY_SPACE = 32;

class Adentro {
	constructor() {
		this.navigation = new Navigation(this);
		this.player = new Player(this);
		this.animationLoader = new AnimationLoader(this);
	}

	/**
	 * Спрятать отображение текущего элемента на схеме
	 */
	hideCurrentElementMarkOnSchema() {
		Snap.selectAll('text.current, rect.current').forEach(elem => {
			elem.removeClass('current');
		});
	}

	/**
	 * Спрятать отображение и визуализацию текущего элемента
	 */
	hideCurrentElement() {
		this.hideCurrentElementMarkOnSchema();
		this.animationLoader.animation.clear();
	}

	/**
	 * Выделение текущего элемента на SVG-схеме
	 * @param  {String} element 	  Идентификатор элемента
	 */
	markCurrentElementOnSchema(element) {
		if (element[0] === '#') {
			//Пропускаем обработку служебных меток
			return;
		}
		// Показываем рамку вокруг текущего блока
		const frameId = `${element}-frame`;
		Snap.selectAll(`rect.current:not(#${frameId})`).forEach(function (elem) {
			elem.removeClass('current');
		});
		Snap(`#${frameId}`).addClass('current');
	}

	/**
	 * Отображение текущего элемента
	 * @param  {String} element 	  Идентификатор элемента
	 * @param  {Number} seconds    	  Длительность в секундах
	 */
	showCurrentElement(element, seconds) {
		if (element.split('_')[0] === '#start') {
			// Начальное расположение
			this.animationLoader.animation.setAtStart();
			this.hideCurrentElementMarkOnSchema();
			return;
		} else if (element[0] === '#') {
			//Пропускаем обработку служебных меток
			return;
		}

		this.markCurrentElementOnSchema(element);
		// Запускаем соответствующую анимацию
		const domElement = $('#' + element);
		const visualizationFuncName = domElement.data('visualization');
		const manPosition = domElement.data('manposition');
		const beats = domElement.data('times');
		if (visualizationFuncName) {
			const visualizationFunc = this.animationLoader.animation[visualizationFuncName];
			if (visualizationFunc) {
				const result = visualizationFunc.call(this.animationLoader.animation, seconds, manPosition, beats);
				if (result) {
					result
						.delay(50)
						.then(() => {
							console.log('after animation');
							this.player.getAndShowCurrentElement();
						});
				}
			} else {
				throw `Не найдена функция анимации ${visualizationFuncName}`;
			}
		}
	}

	/**
	 * Отобразить ссылки на музыкальные композиции
	 * @param  {Object} musicData          Массив информации о композициях
	 * @param  {String} currentMusicId    Идентификатор текущей композиции
	 * @param  {Boolean} showEmptyTiming  Показывать композиции, не имеющие разметки тайминга
	 */
	showMusicLinks(musicData, currentMusicId, showEmptyTiming) {
		const navigation = this.navigation;

		$('#musicLinks').html(musicLinksTemplate({
			musicData,
			currentMusicId,
			text: {
				composition: localize({ru: 'Композиция', en: 'Composition'})
			}
		}));
		$('#musicSelect').change(function () {
			navigation.showMusic($(this).val());
		});
	}

	/**
	 * Показать ссылки на языки
	 */
	showLanguageLinks() {
		const languages = [{
			id: 'ru',
			title: 'ru'
		},
		{
			id: 'en',
			title: 'en'
		}].map(lang => {
			lang.url = this.navigation.getLanguageLink(lang.id);
			lang.isCurrent = lang.id === this.lang;
			return lang;
		});

		$('#lang').html(langLinksTemplate({languages}));
	}

	renderScheme(scheme, schemeMods = {}) {
		const modElementIds = Object.keys(schemeMods);
		const modScheme = scheme.map(part => part.map(element => {
			const elementModId = modElementIds.find(modElement => modElement === element.id);
			if (elementModId) {
				return {...element, ...schemeMods[elementModId]};
			}
			return element;
		}));
		$('#schemaDiv').html(schemeTemplate({scheme: modScheme}));

		const player = this.player;
		$('.element').on('click', function () {
			const id = $(this).attr('id');
			player.playElement(id);
		});
	}

	/**
	 * Загрузка схемы
	 * @param  {String} schemeParams   Объект параметров схемы
	 * @param  {String} musicId    	   Идентификатор музыки
	 * @param  {String} animationId    Идентификатор конкретной анимации (если в animationClass пришёл список)
	 */
	loadSchema(schemeParams, musicId, animationId) {
		$('#danceName').html(schemeParams.name);

		musicId = musicId || schemeParams.music[0].id;
		this.showMusicLinks(schemeParams.music, musicId);
		const musicSchema = schemeParams.music.filter(data => data.id === musicId)[0];

		this.renderScheme(schemeParams.scheme, musicSchema.schemeMods);

		this.player.loadMusicSchema(musicSchema);
		this.player.initEvents();

		contentSwitch.clearContent();

		this.animationLoader.loadAnimationBlock();
		let animationClass = schemeParams.animation;
		if (typeof animationClass === 'object') {
			animationId = animationId ? animationId : animationClass[0].id;
			this.animationLoader.showAnimationLinks(animationClass, animationId);
			let currentClassDef = this.animationLoader.getAnimationClassDef(animationClass, animationId);
			animationClass = currentClassDef.animClass;
		}
		this.animationLoader.loadAnimation(animationClass);

		contentSwitch.show('animation_block');
	}

	/**
	 * Загрузка редактора тайминга
	 * @param  {String} schemeParams   Объект параметров схемы
	 * @param  {String} musicId    	   Идентификатор музыки
	 */
	loadSchemaEditor(schemeParams, musicId) {
		$('#danceName').html(schemeParams.name + ' (editor mode)');

		musicId = musicId || schemeParams.music[0].id;
		this.showMusicLinks(schemeParams.music, musicId, true);
		const musicSchema = schemeParams.music.filter(data => data.id === musicId)[0];

		this.renderScheme(schemeParams.scheme, musicSchema.schemeMods);

		this.player.loadMusicSchema(musicSchema);

		console.log('editor mode on');
		$('#animationDiv').html('');
		const timingGenerator = new TimingGenerator(this);

		$('html').keypress(event => {
			if (event.which == KEY_SPACE) {
				if (!timingGenerator.addBeat(this.player.currentTime)) {
					const newTiming = timingGenerator.getTiming();
					$('#content').html(`<pre>${newTiming}</pre>`);
				}
			}
		});
	}

	localize(textObj) {
		return textObj[this.lang];
	}
}

global.adentro = new Adentro();
global.localize = textObj => adentro.localize(textObj);
global.tour = new Tour();
export default Adentro;

$(window).load(function () {
	// Хак для корректной простановки параметра viewBox в SVG через jQuery
	$.attrHooks['viewbox'] = {
		set: function (elem, value, name) {
			elem.setAttributeNS(null, 'viewBox', String(value));
			return value;
		}
	};
	window.addEventListener('popstate', function (e) {
		adentro.navigation.loadSchemaByState();
	});

	if (!adentro.navigation.loadSchemaByUrl()) {
		adentro.navigation.showSchema('chacarera');
	}

	tour.startFirstTime();
});
