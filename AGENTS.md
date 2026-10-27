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

## Design canvas

Site content comes from a Claude Design canvas; `design/` is its last-synced copy. Use the
`sync-design` skill to port canvas changes, and never edit `design/` by hand. Code-only changes
(SEO, scripts, layout plumbing) go straight into `src/`.
