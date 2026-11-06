# Editing the site through Multica

Content for next.sato48.com lives in Keystatic content files in this repo (`src/content/`).
People can edit it two ways, and both end in a reviewed change to `main`:

```
 Requester            Website Editor agent
 opens issue  ───────▶ edits src/content/ on a branch, opens PR ("Closes SAT-42")
 "change X"            comments the PR link + plain-language summary
                                 │
 Editor at /keystatic ───────────┤  (GitHub mode: edits commit to a branch;
                                 │   open a PR from the Keystatic UI)
                                 ▼
 Developer reviews + merges ──▶ Cloudflare Workers Builds deploys
                           └──▶ Multica GitHub App sees the merge, moves the issue to Done
```

Why it's built this way:

- **One source of truth.** Keystatic's files are what the site builds from, so an edit made by
  the agent and an edit made at `/keystatic` are the same kind of change, reviewed the same way.
- **One agent.** Editing content now means editing files in the repo, so the editor needs repo
  access and GitHub push rights. It's limited by its skill to `src/content/` and images.
- **No custom close-on-merge code.** Multica's GitHub App links a PR to an issue when the key is
  in the branch, title or `Closes <KEY>`, and moves the issue to Done when the PR merges.

## Pieces

| Piece | Where |
| --- | --- |
| Skill: edit content | [`.claude/skills/edit-website-content/SKILL.md`](../../.claude/skills/edit-website-content/SKILL.md) |
| Content schema | [`keystatic.config.ts`](../../keystatic.config.ts), [`src/keystatic/`](../../src/keystatic/) |
| Agent: Website Editor | [website-editor-agent.md](website-editor-agent.md) |

## One-time setup

1. **GitHub.** On the daemon host: `gh auth login` as an account (ideally a bot) that can push
   branches and open PRs on `SATO48/website`, plus `bun` on `PATH`. Multica doesn't inject GitHub
   credentials.
2. **Repo.** Add `https://github.com/SATO48/website` under Settings → Code (or as a project
   resource) so the agent can `multica repo checkout` it.
3. **Skill.** Import `edit-website-content` into the workspace from GitHub (Skills → Import →
   URL), pointing at `.claude/skills/edit-website-content` on `main`, and attach it to the agent.
   Multica doesn't read skills from inside a checked-out repo. After changing the skill in the
   repo, run `multica skill refresh <id>`.
4. **Agent.** Create it from the draft linked above.
5. **Close on merge.** Install the Multica GitHub App on `SATO48/website` and leave "After PRs
   merge, move the issue to" at **Done**.

If you previously set up the canvas workflow, delete the Website Sync agent, the "Sync website"
Quick Action and the `sync-design` skill from the workspace.

## Day to day

1. The requester opens an issue ("Change the FiveFest dates to …", with images attached if any)
   and assigns it to **Website Editor**.
2. The editor opens a PR and comments with what changed and the link. The requester replies in the
   thread with any corrections; the editor pushes them to the same PR.
3. A developer reviews and merges. The site deploys, and Multica moves the issue to Done.
