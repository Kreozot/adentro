import contentSwitch from './content_switch';
import animationLinksTemplate from '../templates/animationLinks.ejs';
import animationBlockTemplate from '../templates/animationBlock.ejs';

const minAnimationWidth = 600;
const maxAnimationHeight = 325;

export default class AnimationLoader {
	constructor(main) {
		this.main = main;
		this.animation = null;
	}

	/**
	 * Загрузка блока анимации
	 */
	loadAnimationBlock() {
		contentSwitch.addBlock('animation_block', localize({ru: 'Хореография', en: 'Choreography'}),
			animationBlockTemplate());
	}

	/**
	 * Загрузка анимации
	 * @param  {Object} AnimationClass  Класс анимации
	 * @param  {Object} turnOnPreloader  Нужно ли включать preloader для блока с анимацией
	 */
	loadAnimation(AnimationClass) {
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
	getAnimationClassDef(animationClassDefs, animationId) {
		let animationClass = animationClassDefs.filter(animationClassDef => animationClassDef.id === animationId);
		return animationClass[0] || animationClassDefs[0];
	}

	/**
	 * Показать ссылки на варианты анимации
	 * @param  {Object} animationClassDefs  Массив описаний анимаций
	 * @param  {String} currentAnimationId         Идентификатор текущей анимации
	 */
	showAnimationLinks(animationClassDefs, currentAnimationId) {
		const navigation = this.main.navigation;
		$('#animationLinks').html(animationLinksTemplate({
			animationClassDefs,
			currentAnimationId,
			text: {
				variations: localize({ru: 'Вариации', en: 'Variations'})
			}
		}));
		$('.animation-links__link').on('click', function () {
			const animationId = $(this).data('animation-id');
			navigation.showAnimation(animationId);
		});
	}
}
