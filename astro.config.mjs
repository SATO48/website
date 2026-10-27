// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Served from the custom domain in public/CNAME.
// https://astro.build/config
export default defineConfig({
  site: 'https://next.sato48.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
});