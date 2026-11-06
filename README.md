# SATO48 website

Site for [next.sato48.com](https://next.sato48.com), built with [Astro](https://astro.build) and deployed to Cloudflare Workers. Pages are prerendered; only the [Keystatic](https://keystatic.com) admin runs on the Worker.

## Develop

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # dist/client (static assets) + dist/server (Worker); runs on Node
bun run check    # type-check pages against the content schema
bun run preview  # serves the build in workerd
```

## Layout

- `src/pages/` – one file per page (`/`, `/film-challenge/`, `/fivefest/`, `/resources/…`)
- `src/layouts/Layout.astro` – `<head>`, fonts, global styles
- `src/components/` – shared `Nav` and `Footer`
- `src/lib/paths.ts` – `url()` and `href()` helpers for internal links and images
- `src/lib/content.ts` – reads Keystatic content for the pages
- `keystatic.config.ts`, `src/keystatic/` – the content schema (what's editable at `/keystatic`)
- `src/content/` – the content: site settings, one file per page, rules documents, Inspiration Packages
- `public/images/` – images (Keystatic-managed ones are named after their field)
- `public/CNAME` – custom domain for GitHub Pages

## Content edits

Everything a visitor reads is edited in [Keystatic](https://keystatic.com) at `/keystatic`:

- **Pages**: Home, Film Challenge, FiveFest, Resources and the 404 page, section by section
  (headings, text, buttons, dates, cards, images, SEO title and description).
- **Rules & history**: the full rules documents (each its own page at `/resources/<slug>/`, listed
  on Resources) and the Inspiration Packages archive.
- **Site**: the home page announcement bar, plus menu, footer, logo and organization details.

In `bun run dev` Keystatic writes straight to the files in this repo; in production it commits to
`SATO48/website` on GitHub, which triggers a redeploy. If `.env` sets
`PUBLIC_KEYSTATIC_STORAGE=github`, use the `website-local-keystatic` launch config (port 4322) to
edit local files instead. See [docs/multica](docs/multica/README.md) for requesting edits through
Multica.

## Keystatic setup

Production needs a Keystatic GitHub App. Create it once by running dev with
`PUBLIC_KEYSTATIC_STORAGE=github` in `.env` and following the prompts at `/keystatic`, then set
these on the Cloudflare Worker:

- `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` as
  runtime secrets (Settings → Variables and Secrets)
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` as a build variable (Settings → Build → Variables), because
  it's inlined into the admin UI at build time

## Deploy

Cloudflare Workers Builds runs `bun run build` and then `npx wrangler deploy` on every push.
`wrangler.jsonc` is the base config; the Astro adapter writes the final one to `dist/server/`.
