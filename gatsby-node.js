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
      schemeId: 'chacarera',
    },
  });
  SCHEMES.forEach((schemeId) => {
    createPage({
      path: `/${schemeId}`,
      component: require.resolve('./src/components/index.tsx'),
      context: {
        schemeId,
      },
    });
  });
};
