# Quick Action: Sync website

Settings → Quick Actions → New.

| Field | Value |
| --- | --- |
| Name | Sync website |
| Description | Send the design changes on this issue to the website for review (opens a pull request). |
| Target | Agent: Website Sync |
| Visibility | Team |

## Prompt

Multica sends the prompt as written. It allows no `{{variables}}` or @mentions, and the agent
already has the issue as context.

```text
Sync the website from the design canvas for this issue, using the sync-design skill.

Port every change made in the canvas since the last sync, not only the ones discussed here, and
open one pull request against main. Use this issue's key in the branch name, the PR title and a
"Closes <key>" line in the PR body so the issue closes when the PR is merged.

When you're done, comment here with the pull request link and a short, plain-language list of
what will change on the site, page by page. If anything needs a developer, say what and why. If
there was nothing new to sync, just say so.
```
