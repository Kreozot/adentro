import locale from 'js/locale';

module.exports = {
	id: 'adentro_tour',
	i18n: {
		nextBtn: locale.get({ru: 'Далее', en: 'Next'}),
		prevBtn: locale.get({ru: 'Назад', en: 'Prev'}),
		doneBtn: locale.get({ru: 'Готово', en: 'Done'}),
		skipBtn: locale.get({ru: 'Пропустить', en: 'Skip'}),
		closeTooltip: locale.get({ru: 'Закрыть', en: 'Close'}),
	},
	steps: [
		{
			title: 'Adentro!',
			content: locale.get({
				ru: 'Добро пожаловать на Adentro.ru - проект по визуализации хореографии аргентинских народных танцев. В меню слева вы можете выбрать интересующий вас танец.',
				en: 'Welcome to Adentro.ru - Argentina folk dances visualization project. You can choose a dance in the left menu.'
			}),
			target: '.logo-image',
			zindex: 9999,
			placement: 'right'
		},
		{
			title: locale.get({
				ru: 'Плеер',
				en: 'Player'
			}),
			content: locale.get({
				ru: 'В плеере вы можете управлять воспроизведением музыки. Отображение хореографии начнётся автоматически в нужный фрагмент времени.',
				en: 'This is the player. Visualization starts automatically when the music reaches a particular point in time.'
			}),
			target: '.plyr',
			zindex: 9999,
			placement: 'bottom'
		},
		{
			title: locale.get({
				ru: 'Музыка',
				en: 'Music'
			}),
			content: locale.get({
				ru: 'Вы также можете выбирать различные музыкальные композиции. На примере нескольких разных композиций можно лучше понять, как хореография танца ложится на музыку.',
				en: 'You can choose an another music track. This may be helpful to understand better how the choreography is connected to music.'
			}),
			target: '#musicSelect',
			zindex: 9999,
			placement: 'bottom'
		},
		{
			title: locale.get({
				ru: 'Схема',
				en: 'Scheme'
			}),
			content: locale.get({
				ru: 'Схема здесь также интерактивна. Кликнув на любой элемент вы можете перемотать музыку на соответствующее место.',
				en: 'The scheme is also interactive. You can rewind the music by clicking on elements.'
			}),
			target: '#schemaDiv',
			zindex: 9999,
			xOffset: 'center',
			yOffset: -50,
			placement: 'bottom'
		},
		{
			title: locale.get({
				ru: 'Визуализация',
				en: 'Visualization'
			}),
			content: locale.get({
				ru: 'Под схемой будет отображаться условная визуализация хореографии.',
				en: 'Visualization will be shown under the scheme.'
			}),
			target: '#animation_block',
			zindex: 9999,
			xOffset: 'center',
			placement: 'top'
		},
		{
			title: locale.get({
				ru: 'Варианты хореографии',
				en: 'Versions'
			}),
			content: locale.get({
				ru: 'Также можно выбрать другие варианты хореографии танца.',
				en: 'You can choose from different versions of choreography.'
			}),
			target: '#animationLinks>a',
			zindex: 9999,
			xOffset: 'center',
			placement: 'top'
		}
	]
};
