<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mandatory Repository Safety & Authorization Rules

- This repository may use Codex or Cursor as an explicitly admitted execution Host. The default workflow uses one canonical physical checkout with one accountable, exclusive Source Writer at a time. Writer exclusivity applies to actual write ownership of that checkout, not to open applications, idle chats, read-only agents, or unrelated sessions. Preserve all tracked, untracked, ignored, and generated WIP. Concurrent writes to the same checkout remain prohibited.

- Writer ownership admission is evidence-based and proportional. A current task-scoped Founder/operator ownership attestation or an already recorded exclusive Writer lease, combined with read-only checkout identity, branch, WIP, and Git lock checks where supported, is sufficient unless contradictory evidence exists. Reentry into the same task does not require repeating Host UI inspection or obtaining a new Founder attestation when ownership remains unchanged and no credible conflict is present. Open applications, idle chats, and read-only agents do not constitute competing Writers. Do not use Computer Use to inspect unrelated Codex, Cursor, VS Code, or ChatGPT windows, or enumerate every process, solely to prove the absence of competing Writers. Escalate inspection only upon concrete conflicting ownership, unexpected mutation, locks, or other credible concurrency evidence. Inaccessible unrelated application UIs are not, by themselves, a STOP condition. Stop on actual conflicts or unresolved material ownership contradictions; preserve WIP.

- Root Chat is CONTROLLER-ONLY: no Source, test, generated-file writes, mutating Git, commits, or PR publication. Start exactly one native Child Writer only after the active Issue and work order admit it. Use a separate native Child Reviewer for the immutable final PR HEAD when required and an optional read-only Solver only when the work order permits. If delegation is unavailable, STOP rather than writing in Root.
- Before each authorized task or reentry, explicitly read `.agents/pstack-models.md` and select only the current Host profile. Model and effort selections are preferences; verify Host availability, acceptance, and role permissions. Record requested, Host-accepted, and runtime-verified routing separately. Use `NOT_OBSERVABLE` when Host evidence is unavailable.
- The sheet is declarative guidance, not an auto-loader, model router, permission control, spending cap, or guarantee. Codex prefers the repository-local native PStack plugin and may use the explicitly verified file-direct HOW fallback defined below. Cursor may read repository-local PStack Skill text as HOW, but no Cursor plugin discovery or model routing is implied.
- Before authorized Source or GitHub mutation, identify the task-specific Issue and approved work order from the current request or an explicit authorized handoff. Verify their repository, authorization, scope, and accountable owner from live GitHub. Verify that this physical checkout and its `origin` identify the repository named by that task. An instruction-source branch does not select a task or authorize Source; do not infer a task from Issue #2, a previous or latest Issue, or the roadmap.
- Founder authorization and the live Issue define WHAT/WHETHER; installed Skills define generic engineering HOW.

## PStack Source Provenance and Admission

- The canonical pinned upstream source is `michael-denyer/pstack-claude@356c6e0f978df729eb16f227d795f34d221c5aad`. Before relying on PStack HOW, verify that the required repository-local Skill files exist and their recorded provenance corresponds to this pinned source. Stop on missing files, unresolved provenance, or conflicting source evidence.

- Codex's preferred native plugin is `pstack@pstack-claude`, enabled by `.codex/config.toml` and declared with local source `./plugins/pstack` in `.agents/plugins/marketplace.json`. These configuration files establish intended discovery, not proof of actual native plugin activation. Never depend on a user-global PStack installation.

- When the Host exposes an actual native plugin source-selection receipt, verify that the selected PStack source is the pinned repository-local plugin. If the Host explicitly selects a different, global, or conflicting source, STOP. Do not use file-direct mode to override contradictory native evidence.

- When the Host does not expose a native plugin source-selection receipt, and no contradictory native source evidence exists, `PSTACK_SOURCE_MODE=FILE_DIRECT_PINNED_LOCAL` may be used strictly for repository-local engineering HOW through a two-stage admission:

  **Stage A — Controller read-only preflight**
  Root may verify the canonical checkout, protected instruction authority, repository-local configuration, pinned provenance, and tracked Skill file identities without Source or Git mutation. This establishes preliminary source provenance only; it does not establish native plugin activation or admit a Writer.

  **Stage B — Native Child verification**
  After the active Founder-approved work order, exclusive checkout ownership, and availability of a Host-supported restrictive permission mode are verified, Root may delegate exactly one authorized native Child. Before any Source, test, database, or Git mutation, the Child must confirm its actual effective restrictive permissions and independently complete all file-direct provenance checks below. A successful spawn alone does not satisfy the Host permission or PStack admission gates. If the effective permissions or provenance cannot be verified, STOP before mutation.

  **Mandatory file-direct verification checks**

  1. Verify the physical checkout, canonical repository origin, current local HEAD, applicable protected instruction SHA, and exclusive ownership before relying on repository files.

  2. Resolve the selected Skill's real path inside `plugins/pstack/skills/`. Reject symbolic links, paths escaping the canonical checkout, untracked substitutions, and user-global or cached copies.

  3. Confirm that all required Skill files are Git-tracked, unmodified relative to their verified local HEAD blobs, and traceable to the approved vendored distribution and pinned upstream source. Independently corroborate the relevant source mapping and recorded provenance; `NOTICE.md` or marketplace configuration alone is not sufficient proof. If the checked-out files conflict with the verified provenance or source identity, STOP.

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
