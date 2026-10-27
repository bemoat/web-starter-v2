<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Codex L0

- This is a Codex-only repository. Use the canonical checkout and one exclusive writer/physical checkout; preserve all tracked, ignored, generated, and untracked WIP.
- Before authorized work, use the active project's explicit repository and canonical MC Issue binding. Verify that the Issue belongs to that repository and that this physical checkout and its `origin` identify the same repository. Discover the current Issue/child, branch/HEAD/PR/CI, effective scope, and exactly one current ONE NEXT from live GitHub; do not assume this Starter's Issue #2 applies to a child repository.
- Founder authorization and the live Issue define WHAT/WHETHER; installed Skills define generic engineering HOW.
- PStack Host dependency: resolve the pinned external source `michael-denyer/pstack-claude@356c6e0f978df729eb16f227d795f34d221c5aad` before relying on PStack behavior; stop if the installed Skill is absent or resolves elsewhere.
- For Codex tool mapping, read `plugins/pstack/skills/poteto-mode/references/codex-tools.md` from that pinned source; do not add an adapter runtime, install/update PStack, or enable hooks.
- Codex uses the repository-local native `pstack@pstack-claude` plugin from `.agents/plugins/marketplace.json`, enabled by `.codex/config.toml`. Its vendored skills and notices must remain traceable to the pinned source. Do not depend on a user-global PStack installation.
- The repository-local plugin is hook-free. Do not add `plugins/pstack/hooks/**`, register a PStack `SessionStart` hook, or rely on default hook discovery.
- The pinned upstream Codex mapping and `setup-pstack` documentation also describe hook-capable or global-runtime variants; those variants are non-operative here. Do not follow them to enable hooks or write user-global PStack state. Use only the project-local native plugin and this root `AGENTS.md`.

## Global MC and Adviser continuity

- ChatGPT Global MC or Adviser reentry starts from the selected Project's explicit `REPO_FULL_NAME` and canonical `MC_ISSUE_URL` bindings and the GitHub Connector. Verify that both identify the same repository, then fetch the Loader, Guide, and root `AGENTS.md` at the same exact merged protected commit in that repository. Do not assume ChatGPT autoloads `AGENTS.md`; missing files or mismatched bindings are a STOP.
- After that versioned fetch, recover live authority from the bound canonical MC Issue, the active Issue or child and its latest approved work order, the current PR and head/base refs, the effective authorization and accountable owner, and exactly one actionable ONE NEXT. Keep mutable state, evidence, and handoffs in GitHub rather than in this file; never hardcode current batch, status, token, ref, or handoff state here.
- Codex Execution uses native `AGENTS.md` startup discovery and the repository-local plugin. Verify that the physical checkout and `origin` identify the repository named by the active work order and that its canonical MC Issue belongs to that repository. For a fork, `upstream` is metadata only and never operational authority. A parent's Issues, approvals, protection, Cloudflare resources, and Project Settings are not child authority. Missing or mismatched identity or effective child authorization means `PROJECT_BINDING_REQUIRED / STOP` or `REPOSITORY_AUTHORITY_MISMATCH / STOP`. An Issue comment is a durable work order, not a command that launches Codex.
- Keep one active objective, one actionable ONE NEXT, and one accountable owner. Reusing an effective scoped authorization across a fresh session does not create authority or transfer the exclusive writer role.
- Preserve one authorized Codex writer, one physical checkout, and all tracked, ignored, generated, and untracked WIP at session boundaries. Send short destination-specific handoffs with the objective and canonical Issue or PR URL. Read back GitHub after each durable Issue, PR, ref, CI, or review transition.
- Fail closed on missing authority, writer ownership, WIP or ref integrity, reviewer independence, or GitHub access. Do not add a loader, router, registry, controller, duplicate workflow, or historical handoff surface.

## Progressive disclosure

- Git, ref, or PR start/publish/reentry: read `.agents/skills/git-delivery/SKILL.md`.
- Local Cloudflare, D1/R2, or binding safety: read `.agents/skills/cloudflare-safety/SKILL.md`; keep checks local and read-only.
- Nontrivial implementation or review: read only the relevant installed PStack Skill and required framework guide; avoid unrelated Skills.
- When routes overlap, read `.agents/skills/cloudflare-safety/SKILL.md` for the boundary, then only the needed workflow Skill.
- This file is a routing index, not a dispatcher, registry, loader, controller, or duplicate PStack.

## Safety boundaries

- Never use protected-branch finish, force-push, destructive cleanup, deployment, migration, remote Cloudflare/resource access, or production operations.
- Do not add nested instruction files, Claude workflows, hooks, tests, CI, dependencies, or other files unless live scope explicitly permits them.
- Stop and report the exact gap when authority, ownership, ref, WIP, scope, or safety is unclear.
- Protected merges are Founder-only; agents do not merge or deploy. Re-read live GitHub state after each durable boundary.
