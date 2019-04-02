const ESPANOL_REGEXP = /^[ A-Za-záéóíúüñ-]+$/i;
const RUSSIAN_REGEXP = /^[ А-Яа-яЁё-]+$/i;
const ID_REGEXP = /^[a-z_]+$/;
const END_OF_FILE = /\n$/gm;

module.exports = function (plop) {
	plop.setGenerator('scheme', {
		description: 'Новая схема танца',
		prompts: [
			{
				type: 'input',
				name: 'nameEs',
				message: 'Название танца (español)',
				validate: (value) => ESPANOL_REGEXP.test(value)
			},
			{
				type: 'input',
				name: 'nameRu',
				message: 'Название танца (по-русски)',
				validate: (value) => RUSSIAN_REGEXP.test(value)
			},
			{
				type: 'input',
				name: 'id',
				message: 'Идентификатор танца',
				validate: (value) => ID_REGEXP.test(value)
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/music/{{id}}/index.js',
				templateFile: 'plop-templates/music-index.hbs',
			},
			{
				type: 'add',
				path: 'src/music/{{id}}/scheme.yaml',
				templateFile: 'plop-templates/scheme.hbs',
			},
			{
				type: 'append',
				path: 'src/config/menu.yaml',
				templateFile: 'plop-templates/menu-item.hbs',
				pattern: END_OF_FILE
			},
		],
	});
};
