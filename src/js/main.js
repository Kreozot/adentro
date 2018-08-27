import 'babel-polyfill';
import Navigation from './navigation';
import Player from './player';
import contentSwitch from './loading/content_switch';
import AnimationLoader from './loading/AnimationLoader';
import TimingGenerator from './timing/TimingGenerator';
import Tour from './tour';
import {getElementAfter} from './timing/timing';

import schemeTemplate from './templates/scheme.ejs';
import musicLinksTemplate from './templates/musicLinks.ejs';
import langLinksTemplate from './templates/langLinks.ejs';


import {disablePreloaderInItem, itHasPreloader} from './loading/preloader';

const KEY_SPACE = 32;

class Adentro {
	constructor() {
		this.navigation = new Navigation(this);
		this.player = null;
		this.animationLoader = new AnimationLoader(this);
	}

	/**
	 * Спрятать отображение текущего элемента на схеме
	 */
	hideCurrentElementMarkOnSchema() {
		$('.element--current').removeClass('element--current');
		$('.element-title--current').removeClass('element-title--current');
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
	 * @param  {String} elementId 	  Идентификатор элемента
	 */
	markCurrentElementOnSchema(elementId) {
		if (elementId[0] === '#') {
			//Пропускаем обработку служебных меток
			return;
		}
		// Выделяем текущий элемент
		$(`.element:not(#${elementId})`).removeClass('element--current');
		$(`#${elementId}`).addClass('element--current');
		// Выделяем подпись текущего элемента
		$(`.element-title:not(.element-title--${elementId})`).removeClass('element-title--current');
		$(`.element-title--${elementId}`).addClass('element-title--current');
	}

	/**
	 * Отображение текущего элемента
	 * @param  {String} elementId 	  Идентификатор элемента
	 * @param  {Number} seconds    	  Длительность в секундах
	 */
	showCurrentElement(element) {
		const $animationContainer = $('#animation_block');

		if (itHasPreloader($animationContainer)) {
			disablePreloaderInItem($animationContainer);
		}

		if (element.name.split('_')[0] === '#start') {
			// Устанавливаем фигуры в начальное расположение следующего элемента
			const manPosition = this.schemeMap[element.nextElementId];
			this.animationLoader.animation.setAtStart(manPosition);
			this.hideCurrentElementMarkOnSchema();
			return;
		} else if (element.name[0] === '#') {
			//Пропускаем обработку служебных меток
			return;
		}

		this.markCurrentElementOnSchema(element.name);
		// Запускаем соответствующую анимацию
		const {visualization, manPosition, beats} = this.schemeMap[element.name];
		if (visualization) {
			const visualizationFunc = this.animationLoader.animation[visualization];
			if (visualizationFunc) {
				visualizationFunc.call(this.animationLoader.animation, element.timeLength, manPosition, beats);
			} else {
				throw `Не найдена функция анимации ${visualization}`;
			}
		}
	}

	/**
	 * Отобразить ссылки на музыкальные композиции
	 * @param  {Object} musicData          Массив информации о композициях
	 * @param  {String} currentMusicId    Идентификатор текущей композиции
	 */
	showMusicLinks(musicData, currentMusicId) {
		const navigation = this.navigation;

		$('#musicLinks').html(musicLinksTemplate({
			musicData,
			currentMusicId,
			text: {
				composition: this.localize({ru: 'Композиция', en: 'Composition'})
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
		}].map(lang => ({
			...lang,
			url: this.navigation.getLanguageLink(lang.id),
			isCurrent: lang.id === this.lang
		}));

		$('.lang-links').html(langLinksTemplate({languages}));
	}

	getModScheme(scheme, schemeMods = {}) {
		const modElementIds = Object.keys(schemeMods);
		return scheme.map(part => part.map(element => {
			const elementModId = modElementIds.find(modElement => modElement === element.id);
			if (elementModId) {
				return {...element, ...schemeMods[elementModId]};
			}
			return element;
		}));
	}

	getSchemeMap(scheme) {
		return scheme.reduce((result, part) => {
			return {
				...result,
				...part.reduce((partResult, element) => {
					return {
						...partResult,
						[element.id]: element
					};
				}, {})
			};
		}, {});
	}

	renderScheme(scheme, editorMode = false) {
		$('#schemaDiv').html(schemeTemplate({scheme}));
		this.adaptiveLineHeight();

		if (!this.player) {
			this.player = new Player(this, editorMode);
		}
		if (!editorMode) {
			const player = this.player;
			$('.element').on('click', function () {
				const id = $(this).attr('id');
				player.playElement(id);
			});
		}
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

		this.scheme = this.getModScheme(schemeParams.scheme, musicSchema.schemeMods);
		this.schemeMap = this.getSchemeMap(this.scheme);
		this.renderScheme(this.scheme);

		this.player.loadMusicSchema(musicSchema, this.scheme);

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

		this.scheme = this.getModScheme(schemeParams.scheme, musicSchema.schemeMods);
		this.schemeMap = this.getSchemeMap(this.scheme);
		this.renderScheme(this.scheme, true);

		this.player.loadMusicSchema(musicSchema, this.scheme);

		console.log('editor mode on');
		$('#animationDiv').html('');
		const timingGenerator = new TimingGenerator(this, this.scheme);

		$('html').keypress((event) => {
			if (event.which == KEY_SPACE) {
				if (!timingGenerator.addBeat(this.player.currentTime)) {
					const newTiming = timingGenerator.getTiming();
					$('#content').html(`<pre>${newTiming}</pre>`);
					copyText(newTiming);
				}
			}
		});
	}

	adaptiveLineHeight() {
		$('.title-row').each(function () {
			var maxHeight = 0;
			$('.element-title__text', this).each(function () {
				maxHeight = Math.max(maxHeight, $(this).outerHeight());
			});
			$(this).css('height', `${maxHeight + 7}px`);
		});
	}

	localize(textObj) {
		return textObj[this.lang];
	}
}

global.adentro = new Adentro();
global.localize = textObj => global.adentro.localize(textObj);
global.tour = new Tour();
export default Adentro;

$(window).load(function () {
	// Хак для корректной простановки параметра viewBox в SVG через jQuery
	$.attrHooks['viewbox'] = {
		set: (elem, value) => {
			elem.setAttributeNS(null, 'viewBox', String(value));
			return value;
		}
	};
	window.addEventListener('popstate', () => {
		global.adentro.navigation.loadSchemaByState();
	});

	if (!global.adentro.navigation.loadSchemaByUrl()) {
		global.adentro.navigation.showSchema('chacarera');
	}

	global.tour.startFirstTime();
});

function copyText(text) {
	const textArea = document.createElement('textarea');
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();
	try {
		document.execCommand('copy');
	} catch (err) {
		console.error('Oops, unable to copy: ' + err);
	}
	document.body.removeChild(textArea);
}

$('.logo').on('click', () => {
	if ($(window).width() <= 768) {
		$('.dance-menu, .lang-links').toggleClass('visible');
		$('.sidebar').toggleClass('sidebar--open')
			.scrollTop(0);
		$('.menu-icon').toggleClass('menu-icon--open');
	}
});

$(window).on('resize', () => global.adentro.adaptiveLineHeight());
