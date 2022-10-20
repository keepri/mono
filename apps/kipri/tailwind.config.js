/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path');
module.exports = {
	content: [
		join(__dirname, 'src', '**', '*.{js,ts,jsx,tsx}'),
		join(__dirname, '..', '..', 'packages', 'ui', '**', '*.{js,ts,jsx,tsx}'),
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
