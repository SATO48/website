# Editing the site through Multica

Content for next.sato48.com is edited in a Claude Design canvas and synced into this repo as a
pull request. Multica is the front door for the people making the edits.

```
 Requester            Website Editor agent          Claude Design canvas
 opens issue  ───────▶ edits text / images / links ─▶ (source of truth for content)
 "change X"            replies with summary + link          │
     │                                                       │  (people can also edit
     │  happy? clicks "Sync website" quick action            │   it directly in Claude Design)
     ▼                                                       ▼
 Website Sync agent ── downloads canvas, diffs against design/, ports to src/, opens PR
     │                     PR title/body carry the issue key (e.g. "Closes SAT-42")
     ▼
 Developer reviews + merges ──▶ GitHub Pages deploy (existing workflow)
                           └──▶ Multica GitHub App sees the merge, moves the issue to Done
```

Why it's built this way:

- **The canvas stays the content source, the code stays the build source.** `design/` keeps a
  copy of the canvas as of the last sync, so each sync ports only the *diff* since then. Code-only
  work (SEO tags, the mobile menu, structured data) survives syncs, and reviewers see a small,
  plain-language PR rather than a regenerated site.
- **Multica and Claude Design are interchangeable editors.** Both write the same canvas, and the
  sync doesn't care who made the change. Start with Multica, since your editors already know it.
  Use Claude Design directly for visual tweaks that are easier to point at than to describe.
- **Two agents, not one.** The editor needs only the canvas. The sync agent also needs the repo
  and GitHub push rights. Keeping them apart means a content request can never push code.
- **No custom close-on-merge code.** Multica's GitHub App links a PR to an issue when the key is
  in the branch, title or `Closes <KEY>`, and moves the issue to Done when the PR merges.

## Pieces

| Piece | Where |
| --- | --- |
| Skill: edit the canvas | [`.claude/skills/edit-website-content/SKILL.md`](../../.claude/skills/edit-website-content/SKILL.md) |
| Skill: sync canvas → PR | [`.claude/skills/sync-design/SKILL.md`](../../.claude/skills/sync-design/SKILL.md) |
| Sync helper script | [`scripts/design-sync.ts`](../../scripts/design-sync.ts) |
| Last-synced canvas copy | [`design/`](../../design/) |
| Agent: Website Editor | [website-editor-agent.md](website-editor-agent.md) |
| Agent: Website Sync | [website-sync-agent.md](website-sync-agent.md) |
| Quick Action: Sync website | [quick-action-sync-website.md](quick-action-sync-website.md) |

## One-time setup

1. **Runtime machine.** The agents run on a Multica daemon with the Claude Code runtime. That
   machine's `claude` must be signed in to the claude.ai account that owns the canvas (or one it's
   shared with as an editor), because the canvas is read and written with Claude Code's Artifact
   tool. **Verify this first** (see "Open questions" below).
2. **GitHub for the sync agent.** On the daemon host: `gh auth login` as an account (ideally a bot)
   that can push branches and open PRs on `SATO48/website`, plus `bun` on `PATH`. Multica doesn't
   inject GitHub credentials.
3. **Repo.** Add `https://github.com/SATO48/website` under Settings → Code (or as a project
   resource) so the sync agent can `multica repo checkout` it.
4. **Skills.** Import both skills into the workspace from GitHub (Skills → Import → URL), pointing
   at the two folders under `.claude/skills/` on `main`. Then attach `edit-website-content` to the
   editor and `sync-design` to the sync agent. Multica doesn't read skills from inside a checked-out
   repo, so this step matters. After changing a skill in the repo, run `multica skill refresh <id>`.
5. **Agents.** Create both from the drafts linked above.
6. **Quick Action.** Settings → Quick Actions → New, from the draft. Target: the Website Sync agent,
   visibility Team.
7. **Close on merge.** Install the Multica GitHub App on `SATO48/website` and leave "After PRs
   merge, move the issue to" at **Done**.

## Day to day

1. The requester opens an issue ("Change the FiveFest dates to …", with images attached if any)
   and assigns it to **Website Editor**.
2. The editor updates the canvas and comments with what changed and a link. The requester checks
   the canvas and replies in the thread with any corrections.
3. When it looks right, the requester clicks **Sync website** in the issue sidebar.
4. The sync agent opens a PR and comments the link. The issue goes to In Review.
5. A developer reviews and merges. The site deploys, and Multica moves the issue to Done.

Several requests can pile up in the canvas before one sync. The sync carries everything changed
since the last one, and its PR lists it all.

## Later: previews and review

When preview environments arrive, add a deploy-preview job on PRs and have the sync agent comment
the preview URL on the issue. The requester can then approve on the issue before a developer merges.
Nothing above has to change for that.

## Open questions to verify before rollout

- **The Artifact tool under the daemon.** I confirmed the canvas reads, writes and image downloads
  from an interactive Claude Code session. I didn't confirm that a headless Claude Code run
  launched by the Multica daemon gets the same Artifact tool. Test it by assigning the sync agent a
  dummy issue. If the tool is missing, the fallback is to run the sync from a Claude Code session
  (the `sync-design` skill works the same there) while keeping the editor in Claude Design.
- **Concurrent edits.** If someone edits the canvas while a sync runs, the next sync picks it up.
  Nothing is lost, but the PR may not include the very latest edit.
