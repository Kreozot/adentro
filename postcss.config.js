module.exports = {
	plugins: [
		require('precss'),
		require('postcss-preset-env')({ stage: 0 }),
		require('autoprefixer'),
		require('cssnano'),
	]
};
