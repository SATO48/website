// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// The Cloudflare adapter runs dev requests inside workerd, which can't write to the
// project folder, so Keystatic's local storage mode wouldn't work. Use it for builds
// only; `astro dev` keeps Astro's own server, where on-demand routes still work.
const isDev = process.argv.includes('dev');

// Served from the custom domain in public/CNAME.
// https://astro.build/config
export default defineConfig({
  site: 'https://next.sato48.com',
  // Keystatic's UI and API use slash-less URLs, so Astro can't enforce trailing slashes.
  // Pages still build to directories, and Workers static assets redirect slash-less
  // page URLs to the trailing-slash version.
  trailingSlash: 'ignore',
  // Pages are prerendered and served as static assets; only Keystatic's admin UI
  // (/keystatic) and API (/api/keystatic) run on the Worker.
  // The site has no image optimization or sessions, so skip the Cloudflare Images and
  // KV bindings the adapter would otherwise auto-provision on deploy.
  // Prerender in Node rather than workerd, so pages can read Keystatic content from disk
  // (src/lib/content.ts).
  adapter: isDev ? undefined : cloudflare({ imageService: 'passthrough', prerenderEnvironment: 'node' }),
  session: false,
  integrations: [sitemap(), react(), keystatic()],
});
