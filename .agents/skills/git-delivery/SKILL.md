---
name: git-delivery
description: Use the pinned native Git Flow CLI for protected v2 delivery through GitHub pull requests.
---

# Git delivery

Use this Skill for the v2 `main` and `dev` delivery path. GitHub rulesets own remote protection. The pinned git-flow-next 2.1.0 CLI owns local branch naming and start or publish commands.

## Admission

Before any Git Flow start or publish, verify all of the following in the one canonical checkout:

- `origin` is `https://github.com/bemoat/web-starter-v2.git`.
- The checkout is the known workspace, has one physical Git worktree, and has no competing writer.
- No Git lock files are present.
- Tracked, ignored, and generated WIP is identified and preserved. The known untracked `AGENTS.md` and `CLAUDE.md` files and standard generated directories are preserved; other untracked or ignored WIP stops admission.
- A feature or release starts from protected `dev`; a hotfix starts from protected `main`.
- Publish is allowed only for the matching `feature/*`, `release/*`, or `hotfix/*` branch.
- The current ref matches the command. Stop on a wrong ref, wrong origin, dirty unowned WIP, or an unexpected branch.

Set `GIT_FLOW_BIN` to the absolute path of the pinned executable. Run it directly; do not rely on a shell `git flow` alias or PATH resolution. Confirm the version before use. Run the admission guard before each start or publish. Configure a local repository only after `dev` is protected:

```bash
export GIT_FLOW_BIN=/absolute/path/to/pinned/git-flow
"$GIT_FLOW_BIN" version # must report 2.1.0 (git-flow-next)
"$GIT_FLOW_BIN" init --local --main=main --develop=dev --no-create-branches --defaults

NODE_OPTIONS=--no-deprecation node --import=tsx/esm .agents/skills/git-delivery/scripts/admission.ts start feature
"$GIT_FLOW_BIN" feature start <name> --no-fetch --no-worktree
NODE_OPTIONS=--no-deprecation node --import=tsx/esm .agents/skills/git-delivery/scripts/admission.ts publish feature
"$GIT_FLOW_BIN" feature publish

NODE_OPTIONS=--no-deprecation node --import=tsx/esm .agents/skills/git-delivery/scripts/admission.ts start release
"$GIT_FLOW_BIN" release start <name> --no-fetch --no-worktree
NODE_OPTIONS=--no-deprecation node --import=tsx/esm .agents/skills/git-delivery/scripts/admission.ts publish release
"$GIT_FLOW_BIN" release publish

NODE_OPTIONS=--no-deprecation node --import=tsx/esm .agents/skills/git-delivery/scripts/admission.ts start hotfix
"$GIT_FLOW_BIN" hotfix start <name> --no-fetch --no-worktree
NODE_OPTIONS=--no-deprecation node --import=tsx/esm .agents/skills/git-delivery/scripts/admission.ts publish hotfix
"$GIT_FLOW_BIN" hotfix publish
```

Open a feature PR to `dev` and a release or hotfix PR to `main`. After a Founder-merged release or hotfix, sync only its reviewed changes back to `dev` through a separate PR. Do not assume a hotfix fixture proves release PR acceptance.

The Git Flow `publish` command creates the remote topic branch and refuses if it already exists. For later commits on that published branch, rerun the matching `publish` admission guard and use an ordinary non-force push to the verified `origin` upstream.

## Finish boundary

Finish work through a reviewed GitHub pull request. Do not run a Git Flow finish command against protected `dev` or `main`. Do not force-push, delete protected refs, rebase shared refs, or bypass the required `check`.

If any admission fact is unknown, stop and report the missing evidence. Continue only after the exact ref, owner, WIP, CI, and review state are read back.
