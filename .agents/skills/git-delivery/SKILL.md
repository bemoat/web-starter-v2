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

### Exact root .env preservation exception

The default-deny ignored-WIP rule has one narrow exception: the exact root Git porcelain entry `!! .env`. This exception preserves the file in place; it does not grant permission to inspect, log, read, hash, move, modify, delete, or disclose its contents.

Use this exception only when the current Founder-approved Work Order contains an explicit Founder attestation that this exact root .env is the intended local environment file and must remain unmodified. An OS UID match alone does not establish Founder intent.

The guard additionally verifies that the command is running at the canonical repository root; the root .env is a regular file and not a symlink; its realpath is exactly the root .env path; its owner UID matches the executing process; it has one link and no group/other write bits; and two consecutive lstat metadata snapshots match for device, inode, size, timestamps, owner, link count, and mode. The check reads metadata only. Any missing, unstable, non-regular, symlinked, non-canonical, or non-owner-controlled file remains rejected. The guard also requires the caller to pass `--founder-attests-root-env-preservation` for an invocation that admits this entry; without the flag, the entry remains rejected.

This does not verify historical file identity across prior receipts or replace the Founder attestation. The attestation and any task-specific preservation evidence remain in the Work Order. The flag is only an explicit per-invocation assertion; use it only when the current Founder-approved Work Order contains that attestation.

Every ignored or untracked path outside the existing preserved WIP allowlists remains rejected, including .env variants such as .env.local or .env.production, nested paths, and other unpreserved ignored roots. The existing exact AGENTS.md and CLAUDE.md untracked files and standard generated roots listed above remain preserved. Any additional non-allowlisted status entry, tracked modification, origin/ref/upstream mismatch, Git lock, extra worktree, or other admission violation remains a STOP condition.

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

#### Post-Founder-merge checkout release (one physical checkout)

A GitHub PR readback confirming the Founder merge marks `PR_MERGED`; it does **not** imply that the local checkout was released. For a merged `feature/* -> dev` PR, complete the local release as part of the normal after-finish handoff when an authorized operator is available, or at the beginning of the next task's acquisition **before** starting any new feature. Do not delay acknowledgement of the successful PR merge or create another approval checkpoint merely to report the local state.

**Owner and preauthorization:** Founder/local operator owns postmerge checkout
mutation by default. For a new `feature/* -> dev` Source task, include the
following bounded clause in its original Founder Source-approval work order
and verify that the Founder explicitly approved it at task admission:
"For this authorized objective and its resulting feature PR to protected
`dev`, I additionally preauthorize exactly one safe post-Founder-merge
local checkout release by one separately admitted exclusive native Child
in the same physical checkout. This permission becomes usable only after
the Founder merge and required exact-merge-SHA checks are verified and
origin/ref/ownership/locks, all tracked/untracked/ignored/generated WIP,
and a safe switch plus fast-forward-only `dev` transition are freshly
verified. Root stays read-only; the prior Writer does not silently retain
ownership. STOP without mutation on missing evidence or unsafe state.
The grant ends on one recorded PASS or STOP and cannot authorize Source
changes, protected merge, deployment, additional checkout or cleanup."
A valid Founder approval containing this clause covers the conditional
postmerge maintenance; do not request a second Founder approval solely
to repeat it after the merge. Verify the clause at original task admission,
not first during postmerge release. Its absence is **not** implicit
permission: retain Founder/local operator ownership, or obtain specific
Founder authority; never treat an Issue link, Skill, prior Child or
successful PR merge as Child mutation authorization. Root may only inspect
and hand off; a new/reused Child must independently prove exclusive
maintenance ownership before acting.

**Before touching Git:** verify the canonical origin/push URL, exact GitHub merged PR and destination, live protected destination ref, one physical checkout, no competing owner/writer, no locks, current branch/HEAD, local and remote refs, and tracked/untracked/**ignored/generated** WIP ownership. If any WIP would be lost/overwritten, is unowned/unknown, or cannot be verified, **STOP and preserve it**; clean tracked status alone is not enough.

For a verified merged `feature/* -> dev`, and only if the same checkout can safely transition: fetch current `origin/dev`, switch the existing checkout to local `dev`, and fast-forward **only** to the verified remote `dev` head (e.g. `git fetch origin dev`, `git switch dev`, `git merge --ff-only origin/dev`, with intervening verification). Re-read branch, HEAD versus live `origin/dev`, WIP and worktree count. Mark `LOCAL_CHECKOUT_RELEASED` only on successful readback. Retain the old local feature branch by default; a deleted remote upstream alone does not require local deletion, pruning or repair.

Never use `git flow finish`, reset, clean, stash/pop, force, branch `-D`, prune, an additional worktree, or deletion of ignored/generated state as housekeeping. Optional local branch deletion is **out of scope**, not a prerequisite; consider it later only on separate explicit request and proof the branch is fully integrated, unneeded and free of unreached work.

For `release/*` or `hotfix/* -> main`, verify the Founder main merge independently; **do not** infer that dev contains those changes. Preserve the separately reviewed `main -> dev` sync PR boundary where applicable. A future feature starts from live protected `dev` only after that task's valid admission. STOP on unmerged/uncertain PR, wrong origin/ref/owner, WIP or lock conflict, divergent `dev` (non-FF), or unverified protection; report the exact blocker without destructive repair.

`READY_FOR_NEXT_TASK` is **not** conferred by checkout release. The next task independently verifies its Issue/authorization, Node pin, repository-local PStack Host provenance, Cloudflare/local-data boundaries and normal admission. Do not add a second readiness ceremony.
