<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository entrypoint

This is a Next.js 16 and Payload 3 application on Cloudflare Workers. `package.json`, `pnpm-lock.yaml`, `.node-version`, and configs own versions and commands.

| Path | Purpose |
| --- | --- |
| `src/app/(frontend)/`, `src/app/(payload)/` | Public site and Payload admin |
| `src/collections/`, `src/lib/` (SEO), `src/payload.config.ts` | Payload schema, SEO, and app helpers |
| `src/migrations/`, `tests/int/`, `tests/e2e/` | Database changes and integration or browser tests |
| `wrangler.jsonc`, `playwright.config.ts`, `vitest.config.mts` | Worker bindings and test configuration |

<<<<<<< HEAD
Choose focused checks only when their effects are authorized. Read the [executor guide](docs/engineering/executor-guide.md) before Child admission or any Source, test, Git, or database mutation.
=======
- Root Chat is CONTROLLER-ONLY: no Source, test, generated-file writes, mutating Git, commits, or PR publication. Start exactly one native Child Writer only after the active Issue and work order admit it. Use a separate native Child Reviewer for the immutable final PR HEAD when required and an optional read-only Solver only when the work order permits. If delegation is unavailable, STOP rather than writing in Root.
- Before each authorized task or reentry, explicitly read `.agents/pstack-models.md` and select only the current Host profile. Model and effort selections are preferences; verify Host availability, acceptance, and role permissions. Record requested, Host-accepted, and runtime-verified routing separately. Use `NOT_OBSERVABLE` when Host evidence is unavailable.
- The sheet is declarative guidance, not an auto-loader, model router, permission control, spending cap, or guarantee. Codex prefers the repository-local native PStack plugin and may use the explicitly verified file-direct HOW fallback defined below. Cursor may read repository-local PStack Skill text as HOW, but no Cursor plugin discovery or model routing is implied.
- Before authorized Source or GitHub mutation, identify the task-specific Issue and approved work order from the current request or an explicit authorized handoff. Verify their repository, authorization, scope, and accountable owner from live GitHub. Verify that this physical checkout and its `origin` identify the repository named by that task. An instruction-source branch does not select a task or authorize Source; do not infer a task from Issue #2, a previous or latest Issue, or the roadmap.
- Founder authorization and the live Issue define WHAT/WHETHER; installed Skills define generic engineering HOW.
>>>>>>> dev

## Root Chat is CONTROLLER-ONLY

Root never writes Source, tests, generated files, or Git state, commits, or publishes PRs. Use one physical checkout and one exclusive native Child Writer. Admit the Child only after task authority, Host, ownership, WIP, and PStack gates pass. Stop if no eligible Child can run.

An Independent Reviewer is a native Child Reviewer instance distinct from the Writer Child. The Writer and Reviewer may share the same Root session, execution Host, and GitHub account. The Reviewer inspects the immutable final PR HEAD and makes no Source, test, generated-output, Git, database, data, or PR mutation. Record both Child identities, the actual Host and permissions, the exact HEAD SHA, findings, verdict, and before-and-after no-mutation evidence. `workspace-write` is not read-only. Admit an optional read-only Solver only when the Work Order permits.

The protected `dev` policy and Git Delivery Skill still require Host-enforced read-only review until lawful adoption. This unmerged candidate cannot authorize its own final review or merge. Do not claim the proposed policy is operative before adoption.

## Safety kernel

- The live task Issue and Founder-approved Work Order define permitted files, operations, owner, and environment. Skills define how to perform approved work. An open Issue, PR, parent task, prior approval, or instruction-source branch does not expand scope.
- Preserve tracked, untracked, ignored, and generated WIP. Do not overwrite, remove, move, stash, reset, clean, or repair work you do not own. Never read, hash, log, move, or modify `.env`.
- Keep the preserved D1 database and its WAL and SHM files closed and unchanged unless a distinct Founder-approved operation expressly names them. Do not access remote Cloudflare, production, migrations, or deployments without separate authority.
- Verify actual Host permissions and approval behavior. `auto_review` does not grant Full Access. Do not escalate, add adapters, enable hooks, install PStack, or change Host configuration.
- Do not add instruction files, CI, dependencies, plugins, hooks, loaders, routers, or other files outside the approved Work Order.
- Stop and preserve state on missing authority, checkout, ownership, Host permissions, provenance, WIP, data identity, scope, CI, or Reviewer independence.

## Load only relevant guidance

| Work | Read |
| --- | --- |
| Task admission, Host, WIP, PStack, command effects | [Executor guide](docs/engineering/executor-guide.md) |
| Git, refs, or PR delivery | [Git Delivery Skill](.agents/skills/git-delivery/SKILL.md) |
| Cloudflare, D1, R2, or bindings | [Cloudflare Safety Skill](.agents/skills/cloudflare-safety/SKILL.md) |
| Payload schema or API | [Payload Skill](.agents/skills/payload/SKILL.md) and its relevant reference |
| Wrangler | [Wrangler Skill](.agents/skills/wrangler/SKILL.md) and its relevant source guide |
| Code or review | Verified selected PStack Skill and the relevant framework guide |
| ChatGPT Dispatcher or Architect | Protected Loader, root, and only selected role Guide at one immutable SHA |

The [model sheet](.agents/pstack-models.md) owns model and effort preferences. Record `NOT_OBSERVABLE` when Host evidence is unavailable. `package.json` owns scripts. CI and the active ruleset own checks and branch protection. The protected Loader and selected role Guide own ChatGPT Project bindings and workflow.

## Delivery

The Git Delivery Skill owns the pinned Git Flow executable and version. Follow it before each start or publish and pass its matching admission guard. Push normally to the verified upstream. Never force-push, finish against protected branches, bypass required checks, or merge or deploy as an agent.

<<<<<<< HEAD
Read GitHub back after each Issue, PR, ref, CI, or review change. Require App15368 `check=PASS` on the immutable final PR HEAD, then an independent review under the currently operative policy. The Founder alone merges protected branches. Follow the approved conditional checkout-release clause only after verified Founder merge.
=======
  4. Actually read the complete selected `plugins/pstack/skills/<selected-skill>/SKILL.md`, `plugins/pstack/skills/poteto-mode/SKILL.md`, and `plugins/pstack/skills/poteto-mode/references/codex-tools.md`. Read additional referenced files when the selected workflow requires them.

  5. Record the selected file paths, verified Git blob identities, source pin, actual Child identity, and completed file reads as auditable evidence. If any required verification is unavailable or contradictory, STOP.

  6. Record `NATIVE_PLUGIN_ACTIVATION=NOT_OBSERVABLE` and `PSTACK_SOURCE_MODE=FILE_DIRECT_PINNED_LOCAL`. Never report native plugin activation as PASS on the basis of configuration files or direct file reads alone.

  Only after the Child's provenance verification and all remaining task-specific admission gates PASS may it act as the exclusive Source Writer. Missing, contradictory, or unverifiable evidence requires STOP before mutation. Do not repeat a consumed diagnostic merely to obtain the same unavailable native receipt.

- File-direct mode is an alternative way to consume verified repository-local PStack Skill instructions, not evidence that the native plugin was activated. It grants no task authorization, Source permission, model routing, sandbox exception, Git authority, migration authority, or permission to bypass a workflow that explicitly requires native plugin activation.

## Native Host Permissions and Role Boundaries

- A task-level read-only or no-action instruction is not equivalent to an enforced read-only Host sandbox. A Child that performs no mutations under `workspace-write` may satisfy its no-action task contract, but must not be reported as having an enforced read-only sandbox.
- An exclusive Source Writer may use a genuinely Host-enforced restrictive `workspace-write` sandbox when its workspace boundary, approval behavior, and task permissions are verified and consistent with the approved work order. The presence of `auto_review` does not by itself establish Full Access or guarantee safe escalation. Any requested or granted permission exceeding the authorized boundary requires STOP unless separately and legitimately authorized under applicable higher-priority policy; it cannot be assumed from a review mode.
- A required Reviewer is a native Child Reviewer instance distinct from the Writer Child. The Reviewer may share the same Root session, Host, and GitHub account. The Reviewer inspects the immutable final PR HEAD and full diff and makes no Source, test, generated-output, Git, database, data, or PR mutation. Record both Child identities, actual Host permissions, base and head SHAs, findings, verdict, and before-and-after no-mutation evidence. `workspace-write` is writable and does not establish Host-enforced read-only access.
- The Root remains CONTROLLER-ONLY. Neither PStack provenance mode nor Host permission interpretation permits Root Source writes, concurrent Writers, additional physical worktrees, unauthorized commands, migrations, deployment, or destructive WIP operations.

## Repository-Local PStack Boundaries

- For Codex tool mapping, read the verified repository-local `plugins/pstack/skills/poteto-mode/references/codex-tools.md`. Do not add an adapter runtime, install or update PStack, or enable hooks.
- The repository-local plugin is hook-free. Do not add `plugins/pstack/hooks/**`, register a PStack `SessionStart` hook, or rely on default hook discovery.
- The pinned upstream Codex mapping and `setup-pstack` documentation also describe hook-capable or global-runtime variants; those variants are non-operative here. Do not follow them to enable hooks or write user-global PStack state. Use only the verified project-local PStack files and this root `AGENTS.md`.
- All existing Issue-specific Founder authorization, restrictive Host admission, exclusive Writer, preserved WIP, Cloudflare safety, Git Delivery, independent review, required CI, and Founder-only protected merge requirements remain fully effective. No historical violation is retroactively authorized by this provenance clarification.

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
>>>>>>> dev
