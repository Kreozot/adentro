import { MusicData } from 'js/types';

// Chacarera simple 6
module.exports = <MusicData>{
	id: 'la_penadora',
	title: 'La Penadora (6)',
	file: 'https://res.cloudinary.com/adentro/video/upload/v1621676410/music/la_penadora.mp3',
	schema: require('./la_penadora.yaml'),
	schemeMods: {
		vuelta: {beats: 6},
		vuelta2: {beats: 6},
		vuelta_2: {beats: 6},
		vuelta2_2: {beats: 6}
	}
};
