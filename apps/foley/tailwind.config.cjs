/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				underdog: "'Underdog', sans-serif",
				'nixie-one': "'Nixie One', sans-serif",
				'londrina-sketch': "'Londrina Sketch', serif",
			},
		},
	},
	plugins: [],
};
