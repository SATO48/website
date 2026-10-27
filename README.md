# SATO48 website

Static site for [next.sato48.com](https://next.sato48.com), built with [Astro](https://astro.build) on the [Bun](https://bun.sh) runtime.

## Develop

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # static output in dist/
bun run preview
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

## Deploy

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
