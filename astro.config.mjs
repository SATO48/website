// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// Keystatic's admin UI (/keystatic) is a server-rendered React app, but this site
// deploys as static assets with no adapter and renders no React itself. Load
// React + Keystatic only under `astro dev`, where Keystatic edits the content
// files locally; builds stay fully static. (Loading React during `bun --bun astro
// build` also fails: Bun can't load react-dom/server from Astro's SSR chunks.)
const isDev = process.argv.includes('dev');

// Served from the custom domain in public/CNAME.
// https://astro.build/config
export default defineConfig({
  site: 'https://next.sato48.com',
  // Keystatic's UI and API use slash-less URLs, so don't enforce slashes in dev.
  trailingSlash: isDev ? 'ignore' : 'always',
  integrations: [sitemap(), markdoc(), ...(isDev ? [react(), keystatic()] : [])],
});
