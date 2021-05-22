import { MusicData } from 'js/types';

// Chacarera simple 6
module.exports = <MusicData>{
	id: 'la_baguala',
	title: 'La Baguala (6)',
	file: 'https://res.cloudinary.com/adentro/video/upload/v1621676417/music/la_baguala.mp3',
	schema: require('./la_baguala.yaml'),
	schemeMods: {
		vuelta: {beats: 6},
		vuelta2: {beats: 6},
		vuelta_2: {beats: 6},
		vuelta2_2: {beats: 6}
	}
};
