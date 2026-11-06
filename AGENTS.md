## Development

When starting the dev server, use background mode:

```
bun --bun astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Version control

This repo is a colocated [Jujutsu](https://jj-vcs.github.io/jj/) (`jj`) and git repo. Prefer `jj`
over `git` when it's installed; fall back to `git` where it isn't (e.g. CI or a fresh agent host).

- Describe the working copy with `jj describe -m "…"` (or `jj commit -m "…"` to start a new change).
- Branch for a PR with `jj bookmark create <name> -r @` and push with `jj git push -b <name>`.
- Sync with `jj git fetch` and rebase onto main with `jj rebase -d main@origin`.
- Use `gh` for GitHub operations (PRs, issues) either way.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Content

Site copy, links and images are edited in Keystatic (`/keystatic`) and stored in `src/content/`
(YAML and Markdoc) and `public/images/`. The schema lives in `keystatic.config.ts` and
`src/keystatic/`; pages read it through `src/lib/content.ts`. When a page needs new editable
content, add the field to the schema and its value to the content file in the same change, and
keep styling in code. Use the `edit-website-content` skill for content-only edits.

Keystatic renames an image to match its field's path when an entry is saved
(`public/images/home/archive/posters/0/image.jpg`), so name new images that way and keep one image
folder per singleton.
