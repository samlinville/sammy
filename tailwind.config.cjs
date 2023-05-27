/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      'serif': ['ui-serif', 'Georgia', 'serif'],
      'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
		extend: {
      colors: {
        zinc: {
          925: '#111113',
        },
      }
    },
	},
	plugins: [],
}
