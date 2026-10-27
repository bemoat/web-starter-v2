<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Codex L0

- This is a Codex-only repository. Use the canonical checkout and one exclusive writer/physical checkout; preserve all tracked, ignored, generated, and untracked WIP.
- Before authorized Source or GitHub mutation, identify the task-specific Issue and approved work order from the current request or an explicit authorized handoff. Verify their repository, authorization, scope, and accountable owner from live GitHub. Verify that this physical checkout and its `origin` identify the repository named by that task. An instruction-source branch does not select a task or authorize Source; do not infer a task from Issue #2, a previous or latest Issue, or the roadmap.
- Founder authorization and the live Issue define WHAT/WHETHER; installed Skills define generic engineering HOW.
- PStack source is the immutable official `cursor/plugins@ab69380dd50ee47d426b35cb8369cffdddafc218:pstack/` tree `880564357e051d7c7802da1cb5d8df1d0b008299`, documented in `plugins/pstack/NOTICE.md`. Keep official files traceable to this pin; do not mix the community port or a floating ref.
- Codex uses the repository-local native `pstack@pstack-official` plugin from `.agents/plugins/marketplace.json`, enabled by `.codex/config.toml`. The official root `plugins/pstack/plugin.json` supplies upstream metadata; a minimal `plugins/pstack/.codex-plugin/plugin.json` declares `./skills/` because the upstream manifest has no Skills field. It adds no runtime, hooks, or model routing. Use only tools and model/effort controls exposed by the active Codex Host; Cursor-only `Task` routing and model slugs do not establish Codex capabilities.
- Do not add an adapter runtime, rewrite official Skills, activate hooks, add `plugins/pstack/hooks/**`, or rely on default hook discovery. Do not write user-global PStack, Cursor, or Codex configuration. Add other Codex-specific compatibility only if a real Host check proves it necessary and the live work order permits it.
- Official PStack setup guidance may describe Cursor rules, global configuration, hooks, or model fan-out. Those instructions are non-operative here. Preserve the project-local native plugin path and this root `AGENTS.md` safety routing.

## Dispatcher and Architect continuity

- ChatGPT Dispatcher or Architect reentry uses the selected Project's explicit `REPO_FULL_NAME` and `INSTRUCTION_REF` bindings with the GitHub Connector. Verify the exact repository, named branch, effective enforceable protection, and one commit SHA; then fetch the shared Loader, this root `AGENTS.md`, and only the Guide selected by `PROJECT_ROLE` from that repository at that SHA. Do not assume ChatGPT autoloads `AGENTS.md`; missing or mismatched identity, ref, protection, or files are a STOP. Do not load the other role's Guide during routine entry. `INSTRUCTION_REF` identifies instructions only; it does not select a Working Issue or authorize task work.
- The selected Guide owns that ChatGPT role's workflow and user-led Working Issue discovery. This file and the Loader define shared repository binding and safety only. Keep mutable state, task evidence, approvals, and handoffs in GitHub rather than in this file; never hardcode current objective, batch, status, token, ref, or handoff state here.
- Codex Execution uses native `AGENTS.md` startup discovery and the repository-local plugin. Verify that the physical checkout and `origin` match the repository named by the explicit task work order, then verify that task's Issue and authorization in the same repository before Source or GitHub mutation. For a fork, `upstream` is metadata only and never operational authority. A parent's Issues, approvals, protection, Cloudflare resources, and Project Settings are not child authority. Missing task identity, repository match, or effective authorization means `REPOSITORY_AUTHORITY_MISMATCH / STOP`. An Issue comment is a durable work order, not a command that launches Codex.
- Reusing an effective scoped authorization across a fresh session does not create new authority or transfer the exclusive writer role.
- Preserve one authorized Codex writer, one physical checkout, and all tracked, ignored, generated, and untracked WIP at session boundaries. Send short destination-specific handoffs with the objective and relevant Issue or PR URL. Read back GitHub after each durable Issue, PR, ref, CI, or review transition.
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
