const konstaConfig = require('konsta/config');

/** @type {import('tailwindcss').Config} */
module.exports = konstaConfig({
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'base-dark': '#06080d',
				'base-dark-light': '#12161f',
			},
		},
	},
});
