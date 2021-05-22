import { MusicData } from 'js/types';

// Chacarera doble 6
module.exports = <MusicData>{
	id: 'chacarera_doble_6_anorazas',
	title: 'Anorazas (6)',
	file: 'https://res.cloudinary.com/adentro/video/upload/v1621676401/music/anorazas.mp3',
	schema: require('./anorazas.yaml'),
	schemeMods: {
		vuelta: {beats: 6},
		vuelta2: {beats: 6},
		vuelta_2: {beats: 6},
		vuelta2_2: {beats: 6}
	}
};
