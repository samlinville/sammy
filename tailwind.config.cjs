/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			'sans': ['Söhne', 'system-ui'],
			'mono': ['Monaco']
		},
		extend: {},
	},
	plugins: [],
}
