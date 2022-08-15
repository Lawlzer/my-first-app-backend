module.exports = {
	presets: ['@babel/preset-env', '@babel/preset-typescript'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['.'],
				alias: {
					'~': './dist',
				},
			},
		],
	],
};

// Potentially useful?
// module.exports = {
// 	presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
// 	plugins: [
// 		[
// 			'@babel/plugin-transform-runtime',
// 			'@babel/proposal-class-properties',
// 			'@babel/transform-regenerator',
// 			'@babel/plugin-transform-template-literals',
// 			'react-hot-loader/babel',
// 			'module-resolver',
// 			{
// 				root: ['.'],
// 				alias: {
// 					'~': './dist',
// 				},
// 			},
// 		],
// 	],
// };
