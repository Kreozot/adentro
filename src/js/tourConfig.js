module.exports = {
	id: 'adentro_tour',
	steps: [
		{
			title: 'Adentro!',
			content: localize({
				ru: 'Добро пожаловать на Adentro.ru - проект по визуализации хореографии аргентинских народных танцев. В верхнем меню вы можете выбрать интересующий вас танец.',
				en: 'Welcome to Adentro.ru - Argentina folk dances visualization project. You can choose a dance in the top menu.'
			}),
			target: '#css3menu1>li',
			zindex: 9999,
			placement: 'bottom'
		},
		{
			title: localize({
				ru: 'Плеер',
				en: 'Player'
			}),
			// title: i18n.t('tour.player_title'),
			content: localize({
				ru: 'В плеере вы можете управлять воспроизведением музыки. Отображение хореографии начнётся автоматически в нужный фрагмент времени.',
				en: 'This is the player. Visualization starts automatically when the music reaches a particular point in time.'
			}),
			// content: i18n.t('tour.player'),
			target: 'jp_container_1',
			zindex: 9999,
			placement: 'right'
		},
		{
			title: localize({
				ru: 'Музыка',
				en: 'Music'
			}),
			// title: i18n.t('tour.music_title'),
			content: localize({
				ru: 'Вы также можете выбирать различные музыкальные композиции. На примере нескольких разных композиций можно лучше понять, как хореография танца ложится на музыку.',
				en: 'You can choose an another music track. This may be helpful to understand better how the choreography is connected to music.'
			}),
			// content: i18n.t('tour.music'),
			target: '#musicLinks>select',
			zindex: 9999,
			placement: 'bottom'
		},
		{
			title: localize({
				ru: 'Схема',
				en: 'Scheme'
			}),
			// title: i18n.t('tour.schema_title'),
			content: localize({
				ru: 'Схема здесь также интерактивна. Кликнув на любой элемент вы можете перемотать музыку на соответствующее место.',
				en: 'The scheme is also interactive. You can rewind the music by clicking on elements.'
			}),
			// content: i18n.t('tour.schema'),
			target: 'schemaDiv',
			zindex: 9999,
			xOffset: 'center',
			yOffset: -50,
			placement: 'bottom'
		},
		{
			title: localize({
				ru: 'Визуализация',
				en: 'Visualization'
			}),
			// title: i18n.t('tour.animation_title'),
			content: localize({
				ru: 'Под схемой будет отображаться визуализация хореографии. На акценте шага (на сильной доле) фигура будет мигать.',
				en: 'Visualization will be shown under the scheme. On an accented step the shapes will blink.'
			}),
			// content: i18n.t('tour.animation'),
			target: 'animationDiv',
			zindex: 9999,
			xOffset: 'center',
			placement: 'top'
		},
		{
			title: localize({
				ru: 'Варианты хореографии',
				en: 'Versions'
			}),
			// title: i18n.t('tour.animation_links_title'),
			content: localize({
				ru: 'Также можно выбрать другие варианты хореографии танца.',
				en: 'You can choose from different versions of choreography.'
			}),
			// content: i18n.t('tour.animation_links'),
			target: '#animationLinks>a',
			zindex: 9999,
			xOffset: 'center',
			placement: 'bottom'
		}
	]
};
