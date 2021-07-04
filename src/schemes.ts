export const DANCE_IDS = [
  'chacarera',
  'chacarera_doble',
  'zamba',
  'zamba_alegre',
  'gato',
  'gato_cuyano',
  'caramba',
  'bailecito',
  'escondido',
  'remedio',
  'remedio_atamisqueno',
  'huayra_muyoj',
  'huella',
  'arunguita',
] as const;

export type DanceId = typeof DANCE_IDS[number];
