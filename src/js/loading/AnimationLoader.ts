import contentSwitch from './contentSwitch';
import locale from 'js/locale';
import { AnimationVariantParams, MainClass } from 'js/types';
import DanceAnimation from 'js/animations/commons/DanceAnimation';

const animationLinksTemplate = require('../templates/animationLinks.ejs');
const animationBlockTemplate = require('../templates/animationBlock.ejs');

const minAnimationWidth = 600;
const maxAnimationHeight = 325;

export default class AnimationLoader {
	main: MainClass;
	animation: DanceAnimation;

	constructor(main) {
		this.main = main;
		this.animation = null;
	}

	/**
	 * Загрузка блока анимации
	 */
	loadAnimationBlock() {
		contentSwitch.addBlock('animation_block', locale.get({ru: 'Хореография', en: 'Choreography'}),
			animationBlockTemplate());
	}

	/**
	 * Загрузка анимации
	 * @param  {Object} AnimationClass  Класс анимации
	 */
	loadAnimation(AnimationClass: typeof DanceAnimation) {
		const $animationBlock = $('#animation');

		if (this.animation) {
			this.animation.clear();
		}
		this.animation = new AnimationClass('animation');
		const ratio = Math.min(maxAnimationHeight, this.animation.height) / Math.max(minAnimationWidth, this.animation.width) * 100;
		$('.animation-container').css('padding-bottom', ratio + '%');
		$animationBlock
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('viewBox', `-20 -20 ${this.animation.width + 40} ${this.animation.height + 40}`);
	}

	/**
	 * Получить описание определённого класса анимации из массива
	 * @param  {Object} animationClassDefs  Массив описаний классов анимаций (из navigation.js)
	 * @param  {String} animationId         Идентификатор нужного класса
	 * @return {Object}                     Описание класса в виде {id, name, title}
	 */
	getAnimationClassDef(animationClassDefs: AnimationVariantParams[], animationId: string) {
		let animationClass = animationClassDefs.filter(animationClassDef => animationClassDef.id === animationId);
		return animationClass[0] || animationClassDefs[0];
	}

	/**
	 * Показать ссылки на варианты анимации
	 * @param  {Object} animationClassDefs  Массив описаний анимаций
	 * @param  {String} currentAnimationId         Идентификатор текущей анимации
	 */
	showAnimationLinks(animationClassDefs: AnimationVariantParams[], currentAnimationId: string) {
		const navigation = this.main.navigation;
		$('#animationLinks').html(animationLinksTemplate({
			animationClassDefs,
			currentAnimationId,
			text: {
				variations: locale.get({ru: 'Вариации', en: 'Variations'})
			}
		}));
		$('.animation-links__link').on('click', function () {
			const animationId = $(this).data('animation-id');
			navigation.showAnimation(animationId);
		});
	}
}
