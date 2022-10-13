module.exports = {
	root: true,
	extends: ['custom'],
	env: {
		es6: true,
		node: true,
	},
	// parserOptions: {
	// 	project: ['tsconfig.json', 'tsconfig.dev.json'],
	// },
	ignorePatterns: [
		'/lib/**/*', // Ignore built files.
	],
	rules: {},
};
