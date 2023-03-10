import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// import torchlight from 'remark-torchlight';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import svelte from "@astrojs/svelte";

// import customMono from './src/assets/monokai.json';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), tailwind(), svelte()],
  markdown: {
    extendDefaultPlugins: true
    // remarkPlugins: [torchlight]
  },
});