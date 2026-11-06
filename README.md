# SATO48 website

Site for [next.sato48.com](https://next.sato48.com), built with [Astro](https://astro.build) and deployed to Cloudflare Workers. Pages are prerendered; only the [Keystatic](https://keystatic.com) admin runs on the Worker.

## Develop

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # dist/client (static assets) + dist/server (Worker); runs on Node
bun run preview  # serves the build in workerd
```

## Layout

- `src/pages/` – one file per page (`/`, `/film-challenge/`, `/fivefest/`, `/resources/…`)
- `src/layouts/Layout.astro` – `<head>`, fonts, global styles
- `src/components/` – shared `Nav` and `Footer`
- `src/lib/paths.ts` – `url()` and `img()` helpers for internal links and images
- `public/images/` – images
- `public/CNAME` – custom domain for GitHub Pages
- `design/` – copy of the Claude Design canvas as of the last sync (don't edit by hand)
- `scripts/design-sync.ts` – helpers for syncing canvas changes into `src/`

## Content edits

Copy, images and links are edited in the [design canvas](https://claude.ai/artifact/6YnLaQmwxYnToa4fFqmKtM)
and synced here as pull requests by the `sync-design` skill. See [docs/multica](docs/multica/README.md)
for the Multica workflow.

The home page's announcement bar is toggled by `showAnnouncement` at the top of `src/pages/index.astro`.

## Keystatic

Edit content at `/keystatic`. In `bun run dev` it writes straight to the files in this repo;
in production it commits to `SATO48/website` on GitHub, which triggers a redeploy.

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
