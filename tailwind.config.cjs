/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	plugins: [require('daisyui')],
	theme: {
		extend: {
			colors: {
				'base-dark': '#06080d',
				'base-dark-light': '#12161f',
			},
		},
	},
	// daisyUI config (optional)
	daisyui: {
		// themes: true,
		themes: [
			{
				light: {
					primary: '#151515',

					secondary: '#e36a5c',

					accent: '#d97706',

					neutral: '#e5e7eb',

					'base-100': '#ECECEC',

					info: '#22d3ee',

					success: '#9CB686',

					warning: '#FFD261',

					error: '#FC9783',

					'base-200': '#f3f4f6',
					'base-300': '#ced3d9',
					'base-content': '#000000',
				},

				dark: {
					primary: '#ffffff',

					secondary: '#e36a5c',

					accent: '#d97706',

					neutral: '#111111',

					'base-100': '#0A0A0A',

					info: '#22d3ee',

					success: '#9CB686',

					warning: '#FFD261',

					error: '#FC9783',

					'base-200': '#1d1d1d',
					'base-300': '#1d1d1d',
					'base-content': '#000000',
				},
			},
		],
		styled: true,
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
		darkTheme: 'dark',
	},
};
