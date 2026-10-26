---
name: git-delivery
description: Use the pinned native Git Flow CLI for protected v2 delivery through GitHub pull requests.
---

# Git delivery

Use this Skill for the v2 `main` and `dev` delivery path. GitHub rulesets own remote protection. Git Flow owns local branch naming and start or publish commands.

## Admission

Before `git flow feature start` or `git flow feature publish`, verify all of the following in the one canonical checkout:

- `origin` is `https://github.com/bemoat/web-starter-v2.git`.
- The checkout is the known workspace and has no competing writer.
- Tracked, ignored, and generated WIP is identified and preserved. The known untracked `AGENTS.md` and `CLAUDE.md` files are preserved; other untracked WIP stops admission.
- A feature starts from protected `dev` and publishes only a `feature/*` branch.
- The current ref matches the command. Stop on a wrong ref, wrong origin, dirty unowned WIP, or an unexpected branch.

Run the local admission guard before invoking the pinned `git-flow-next` CLI. Configure a local repository only after `dev` is protected:

```bash
pnpm exec tsx .agents/skills/git-delivery/scripts/admission.ts start
git flow init --local --main=main --develop=dev --no-create-branches -d
git flow feature start <name> --no-fetch
pnpm exec tsx .agents/skills/git-delivery/scripts/admission.ts publish
git flow feature publish <name>
```

## Finish boundary

Finish work through a reviewed GitHub pull request. Do not run `git flow finish` against protected `dev` or `main`. Do not force-push, delete protected refs, rebase shared refs, or bypass the required `check`.

If any admission fact is unknown, stop and report the missing evidence. Continue only after the exact ref, owner, WIP, CI, and review state are read back.
