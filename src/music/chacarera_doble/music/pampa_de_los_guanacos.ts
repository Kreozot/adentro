import { MusicData } from 'js/types';

// Chacarera doble 6
module.exports = <MusicData>{
	id: 'chacarera_doble_6_pampa_de_los_guanacos',
	title: 'Los Reynoso — Pampa de los guanacos (6)',
	file: 'https://res.cloudinary.com/adentro/video/upload/v1621676399/music/pampa_de_los_guanacos.mp3',
	schema: require('./pampa_de_los_guanacos.yaml'),
	schemeMods: {
		vuelta: {beats: 6},
		vuelta2: {beats: 6},
		vuelta_2: {beats: 6},
		vuelta2_2: {beats: 6}
	}
};
