/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path');
module.exports = {
	content: [join(__dirname, 'components', '**', '*.{js,ts,jsx,tsx}')],
	theme: {
		extend: {},
	},
	plugins: [],
};
