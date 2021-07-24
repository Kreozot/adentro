const SCHEMES = [
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
];

module.exports.createPages = ({ actions: { createPage } }) => {
  createPage({
    path: '/',
    component: require.resolve('./src/components/index.tsx'),
    context: {
      danceId: 'chacarera',
    },
  });
  SCHEMES.forEach((danceId) => {
    createPage({
      path: `/${danceId}`,
      component: require.resolve('./src/components/index.tsx'),
      context: {
        danceId,
      },
    });
  });
};
