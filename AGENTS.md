<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository workflow

## Engineering quick reference

This repository is a Next.js and Payload application for Cloudflare Workers, with local Wrangler bindings for development and tests. Read dependency versions from `package.json` and `pnpm-lock.yaml`. `.node-version` selects Node.js; `package.json`'s `engines` and `packageManager` fields define the supported Node.js and pnpm versions.

| Path | Owns |
| --- | --- |
| `src/app/(frontend)/` | Public pages and layout |
| `src/app/(payload)/` | Payload admin and API routes |
| `src/collections/`, `src/globals/`, `src/lib/` | Payload schema, shared settings, and application helpers |
| `src/payload.config.ts` | Payload, D1, R2, and generated type configuration |
| `src/migrations/` | Database migrations |
| `tests/int/`, `tests/e2e/` | Vitest integration tests and Playwright end-to-end tests |
| `wrangler.jsonc` | Worker and binding configuration |

Choose a focused check only after reading the active Work Order and the relevant local data boundary.

| Command | What it does and what it can change |
| --- | --- |
| `pnpm run lint` | Runs ESLint across the repository. |
| `pnpm run typecheck` | Runs TypeScript with `--noEmit`. |
| `pnpm run check` | Runs the Cloudflare guard, lint, typecheck, and all integration tests. Integration tests use local persisted D1 state, so this command is not side-effect free. |
| `pnpm run test:int -- tests/int/<spec>.int.spec.ts` | Runs one integration spec with the isolated `.wrangler-test/state/v3` persistence path. It can change that test database. |
| `pnpm run test:e2e -- tests/e2e/<spec>.spec.ts` | Starts `pnpm dev`, which can generate types and push schema changes, then runs one Playwright spec with `.wrangler-test/e2e` persistence. Playwright imports `dotenv/config`, which can read `.env`. The run can change test data and writes reports and results. |
| `pnpm run test` | Runs all integration and E2E tests. It can change both test databases, start the Payload dev server, generate types, push schema changes, read `.env` through Playwright, and write reports and results. |
| `pnpm run generate:types` | Rewrites `cloudflare-env.d.ts` and `src/payload-types.ts`. |
| `pnpm run build` | Runs `next build`, writes build output, and uses `.wrangler-build/state/<pid>` for local bindings. |
| `pnpm run dev` | Starts Next.js. Payload development can generate types and push schema changes to the bound D1 database. |
| `pnpm run devsafe` | Deletes `.next` and `.open-next`, then starts Next.js. |

The test scripts select separate local persistence paths. Verify the binding and fixture identity before any test that can write. Never point a command at the preserved original D1 or alter its SQLite main, WAL, or SHM files. Do not run a broad suite by default. `pnpm run check` includes every integration test; select a focused spec when the Work Order permits the test and its side effects. Do not treat a command name or local binding as proof that a database is disposable.

## Authorization and ownership

- Founder authorization and the live task Issue define WHAT and WHETHER; installed Skills define engineering HOW. Before Source, Git, or GitHub mutation, verify the exact repository, task-specific Issue, approved Work Order, scope, accountable owner, current protected ref, and physical checkout from live GitHub and local read-only evidence. An instruction-source branch, open Issue, prior Issue, PR, roadmap, or parent task does not grant authority.
- Use one canonical physical checkout and one exclusive Source Writer. Do not allow concurrent writes to that checkout. A current task-scoped Founder/operator ownership attestation or recorded exclusive Writer lease, checked against checkout identity, ref, WIP, and locks, is sufficient when no conflict exists. Root is controller-only and never writes Source, tests, generated files, or Git state, creates commits, or publishes PRs. Admit exactly one native Child Writer only after the task and Host gates pass. If no authorized Child can run, stop instead of writing in Root. Read-only agents and unrelated open applications are not competing Writers. Reuse valid same-task ownership evidence when no conflict or material state change exists. Same-task reentry does not require new Host UI inspection or a new ownership attestation when ownership is unchanged and no conflict exists. Do not inspect unrelated application windows or enumerate processes to prove no conflict; escalate inspection only on conflicting ownership, unexpected mutation, locks, or other concrete evidence.
- Use a separate read-only Reviewer for the immutable final PR HEAD when required. An optional read-only Solver is allowed only when the Work Order permits it.
- Verify effective Host restrictions, their workspace boundaries, and approval behavior. A no-action instruction is not an enforced read-only sandbox. A task that makes no changes under `workspace-write` is a no-action task, not an enforced read-only task. `workspace-write` can qualify only when the Host enforces and reports the authorized boundary. `auto_review` does not prove Full Access or authorize escalation. Stop if permission exceeds scope or cannot be verified. A required final Reviewer needs a separate Child identity and its own effective read-only permissions.
- Before every authorized task or reentry, read `.agents/pstack-models.md` and select the active Host profile. Treat model and effort rows as preferences. Verify Host availability and acceptance when observable. Record `REQUESTED`, `HOST_UI_REPORTED`, `HOST_ACCEPTED`, and `RUNTIME_VERIFIED` separately; use `NOT_OBSERVABLE` where evidence is unavailable. Do not infer model acceptance or runtime routing from a request, a task label, or the sheet.
- Preserve all tracked, untracked, ignored, and generated WIP. Identify it before checkout or other Git mutation, including standard output directories and local data. Never overwrite, remove, move, stash, reset, clean, or repair unowned WIP. Do not apply, pop, or drop an existing task stash unless the Work Order explicitly permits it. The exact root `.env` may be preserved through the Git Delivery guard only when the current Founder-approved Work Order contains its explicit attestation and the guard's metadata checks pass. Never read, hash, log, move, or modify `.env`.
- One approved task envelope permits sequential in-scope edits, focused verification, and ordinary corrections without repeated microapproval. It does not expand the approved files, data, commands, or environment. Name any needed disposable-output recovery allowance in advance. Stop when a new side effect exceeds the Work Order.

## PStack provenance and admission

The pinned upstream is `michael-denyer/pstack-claude@356c6e0f978df729eb16f227d795f34d221c5aad`. Before relying on PStack HOW, verify the repository-local Skill files, tracked blob identities, vendored source mapping, and provenance against that pin. Stop on missing, modified, untracked, escaping, or conflicting files. Read the complete selected Skill, `plugins/pstack/skills/poteto-mode/SKILL.md`, and `plugins/pstack/skills/poteto-mode/references/codex-tools.md`, plus any referenced files required by the workflow.

Codex's intended plugin source is local `./plugins/pstack`, enabled by `.codex/config.toml` and declared in `.agents/plugins/marketplace.json`. These files do not prove plugin activation. Do not use a user-global installation. If the Host exposes a source-selection receipt, verify it selects this pinned local plugin. Stop if it selects a conflicting source. Do not use file-direct mode to override conflicting native evidence.

Cursor may use verified repository-local Skill text as HOW, but these files do not prove Cursor plugin discovery or model routing.

When native source selection is not observable and no conflict exists, use `PSTACK_SOURCE_MODE=FILE_DIRECT_PINNED_LOCAL` only for verified local engineering HOW:

1. Root completes read-only Stage A for repository identity, protected instruction authority, local configuration, pinned provenance, and tracked Skill identities. Stage A does not admit a Writer or prove native activation.
2. After a Founder-approved Work Order, exclusive checkout ownership, and Host restrictions are verified, exactly one Child completes Stage B before any Source, test, database, or Git mutation. The Child verifies its physical checkout, origin, HEAD, protected instruction SHA, ownership, real paths, tracking, blob identities, vendored mapping, pin, and complete required file reads.
3. Record the Child identity, Skill paths and blobs, source pin, completed reads, and permission evidence. Record `NATIVE_PLUGIN_ACTIVATION=NOT_OBSERVABLE` when the Host provides no receipt. Record `PSTACK_SOURCE_MODE=FILE_DIRECT_PINNED_LOCAL`. Configuration and file reads alone never establish native activation.

File-direct mode grants no task authority, Source permission, model routing, sandbox exception, Git or migration authority, or permission to bypass a workflow that requires native plugin activation. Do not add an adapter, enable hooks, install or update PStack, or write global settings. The repository-local plugin is hook-free.
Do not repeat a consumed diagnostic only to obtain the same unavailable native receipt. This policy does not retroactively authorize prior work.

## Load only the relevant guidance

- For a Git, ref, or PR operation, read `.agents/skills/git-delivery/SKILL.md` and run its admission guard before each feature start or publish. Use the pinned `git-flow-next` 2.1.0 executable directly. Start an authorized feature with `--no-fetch --no-worktree`. Never force-push, finish against protected branches, rebase shared refs, delete branches, or bypass required CI.
- For local Cloudflare, D1, R2, or binding work, read `.agents/skills/cloudflare-safety/SKILL.md` and keep checks local and read-only unless the Work Order explicitly permits a bounded operation. Do not access remote resources, credentials, migrations, deployment, production, or settings. A local D1 fixture still requires verified local bindings, explicit authority, and a known disposable path. Never substitute, recreate, repair, checkpoint, or open a preserved original database or its WAL and SHM files.
- For Payload work, read `.agents/skills/payload/SKILL.md` and the relevant reference. For Wrangler work, read `.agents/skills/wrangler/SKILL.md` and its source guide. For code using Next.js, read the matching guide under `node_modules/next/dist/docs/` before writing code and heed deprecations.
- For other nontrivial work, read only the relevant installed PStack Skill and framework guide. Use this file as a routing map, not as a duplicate Skill, loader, registry, or controller.

The source of truth depends on the rule. This file owns repository identity, task admission, Host boundaries, PStack admission, Writer and WIP protection, and merge limits. The shared ChatGPT Loader and selected Guide own Project bindings and role workflow. `.agents/pstack-models.md` owns model preferences. The Git Delivery Skill and its guard own Git commands. The Cloudflare Safety Skill and its guard own local binding checks. `package.json` owns command definitions. CI and GitHub rulesets own required status checks and branch protection.

## ChatGPT Project continuity

On ChatGPT Dispatcher or Architect entry, use the selected Project's explicit `REPO_FULL_NAME` and `INSTRUCTION_REF` with the GitHub Connector. Verify the exact repository, named protected branch, effective protection, and one immutable commit. Fetch the shared Loader, root `AGENTS.md`, and only the Guide selected by `PROJECT_ROLE` from that repository at that SHA. Do not assume ChatGPT loaded these files. Stop on missing or mismatched evidence. Never fall back to another repository, branch, cached text, unmerged candidate, or role's Guide. The Loader and `INSTRUCTION_REF` select trusted instructions, not a task or authority. Follow the selected Guide for that role's workflow and user-led Issue discovery. Keep mutable task state and handoffs in GitHub, not in this file. Never put a current objective, status, token, ref, or handoff state here.

Codex uses native `AGENTS.md` discovery and the repository-local PStack source. The Child verifies the physical checkout and `origin` against the explicit Work Order, then verifies the same repository's live Issue and authorization. If task identity, repository match, or effective authorization is missing, report `REPOSITORY_AUTHORITY_MISMATCH / STOP`. A parent's Issues, approvals, protection, resources, and Project Settings do not transfer authority. For a fork, `upstream` is metadata only. A comment records a work order but does not launch an agent. A fresh session does not inherit checkout ownership or Child permissions.

## Delivery and stop conditions

Use a separate, genuinely read-only Reviewer for the same immutable final PR HEAD when required. Verify the required App15368 `check` on that exact HEAD. Agents do not merge protected branches or deploy; the Founder merges. Read back live GitHub after each durable Issue, PR, ref, CI, or review transition. For a permitted post-merge checkout release, follow the exact conditional grant in the approved Work Order and Git Delivery Skill; a merge alone does not authorize local Git mutation.

Stop and preserve state when authority, ownership, permissions, PStack provenance, WIP, refs, data identity, scope, CI, or reviewer independence is missing or contradictory. Never use Full Access, a second Writer or physical checkout, destructive cleanup, stash operations, database migration, remote Cloudflare operation, production action, deployment, or protected merge as an agent. Do not add nested instruction files, workflows, hooks, tests, CI, dependencies, or other Source files unless the live task scope explicitly permits them. Report the exact gap and the smallest lawful recovery.
