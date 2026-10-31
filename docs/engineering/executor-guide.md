# Executor guide

This guide owns v2 coding-task admission and the effects of local commands. The live task Issue and Founder-approved Work Order own each task's authority. Root `AGENTS.md` owns the safety kernel. Existing Skills own their specialist procedures.

## Admit one task

Root Chat is CONTROLLER-ONLY. Root reads this guide and checks the live Work Order before admitting a Child. Root does not edit files, tests, generated output, Git state, commits, or PRs.

Before a Child writes, verify all of the following from the live Issue and the physical checkout:

1. The repository, task Issue, approved Work Order, exact file and operation scope, accountable owner, protected ref, and required delivery state match.
2. The checkout is the canonical physical path. Confirm `origin`, the current branch and HEAD, its upstream, the live protected ref, and the PR head when one exists.
3. One physical worktree exists. No Git lock or competing Writer exists. Use a current task-scoped ownership attestation or exclusive Writer lease, checked against the checkout, ref, WIP, and locks. Idle chats, open applications, and read-only agents are not competing Writers.
4. All tracked, untracked, ignored, generated, and application-visible WIP has an owner and a preservation plan. A clean `git status` does not report ignored files.
5. The Child's effective Host permissions and approval behavior match the approved operation. Read-only wording does not create an enforced read-only Host.
6. Repository-local PStack provenance and the Child's required Stage B checks pass before any Source, test, Git, or database mutation.

For forks, `upstream` is metadata, not authority. A parent's Issue, approvals, resources, or Project Settings do not transfer to the Child. Verify task identity and authorization in the same repository.

Stop on a mismatch, missing evidence, unexpected editor change, unowned WIP, lock, conflicting Writer, or unapproved side effect. Do not switch branches, clear state, repair a fixture, or widen permissions to make admission pass. On same-task reentry, reuse ownership and Host evidence without repeating UI checks when those facts remain unchanged and no concrete conflict exists. Do not inspect unrelated windows or enumerate processes without a concrete conflict signal.

### Preserve local state

Identify tracked and untracked paths with `git status --porcelain=v1 -uall`. Inspect ignored paths and generated output separately. Record existing stashes and their path lists without applying, dropping, popping, or rewriting them. Protect open-editor changes as WIP until filesystem and editor state agree.

Treat `.env` as a local file. Never open, read, log, hash, move, modify, or delete it. The Git Delivery guard may preserve only the exact root entry when the current Work Order contains the Founder attestation and the guard confirms its metadata. Pass `--founder-attests-root-env-preservation` only under that attestation. The flag is not a bypass for another guard failure.

Keep the preserved original D1 database and its WAL and SHM files closed and unchanged. Never substitute, recreate, repair, checkpoint, or inspect them. A future task needs a separate Founder-approved operation that names the data and effect. A local binding name does not prove that a fixture is disposable.

## Verify the Host and ownership

Read `.agents/pstack-models.md` and select the active Host profile. Verify the Host-reported effective filesystem boundary and approval mode. A no-action task under `workspace-write` is not a read-only task. `auto_review` does not authorize Full Access or an escalation.

The task's Founder-approved risk decision may address a known ambient Host boundary for that task. It does not authorize writes outside the approved files and operations or override a specific higher-priority prohibition. If a real conflict remains, stop and quote it.

Record model routing separately:

- `REQUESTED` is the model and effort requested at dispatch.
- `HOST_UI_REPORTED` is the identified Child's task-card selection, or `NOT_OBSERVABLE` when unavailable.
- `HOST_ACCEPTED` requires Host-returned acceptance for that Child. A successful spawn alone is not acceptance.
- `RUNTIME_VERIFIED` requires evidence of the model and effort served to that Child.

Follow the model sheet's fallback for ordinary low or medium risk work. Record `ROUTING_ASSUMED=PARTIAL` only when that fallback applies. Never infer exact routing from a request or task label. Stop when a model or effort critical to the task is unsupported or the Host reports a conflicting substitution.

## Verify repository-local PStack

The pinned source is `michael-denyer/pstack-claude@356c6e0f978df729eb16f227d795f34d221c5aad`. Verify it against `plugins/pstack/NOTICE.md`, `.agents/pstack-models.md`, and the pinned upstream `tools/upstream.json` and `tools/forks.json`. Use the vendored mapping to explain local ports and forks.

For every Skill used, verify that the local file is regular, tracked, contained under this repository, and has the expected blob at the verified HEAD. Reject symbolic links, real paths outside the canonical checkout, untracked substitutions, and global or cached copies. Verify its source mapping and read the full file. Read `plugins/pstack/skills/poteto-mode/SKILL.md`, `plugins/pstack/skills/poteto-mode/references/codex-tools.md`, the selected Skill, and any referenced material its workflow requires.

Root's read-only Stage A verifies repository identity, protected instruction authority, local configuration, pinned provenance, and tracked Skill identities. It establishes baseline provenance. It does not admit a Writer or prove native plugin activation. After the live Work Order, ownership, checkout, WIP, and Host gates pass, the admitted Child completes Stage B before mutation. The Child records its identity, physical checkout, origin, HEAD, protected SHA, Host permissions, approval behavior, required file paths and blobs, upstream pin, source mapping, and completed reads.

If the Host exposes a native source-selection receipt, verify that it selects the pinned local plugin. Stop if the receipt conflicts with the approved source. Configuration files do not prove activation. If native selection is unavailable and no contradictory evidence exists, use `PSTACK_SOURCE_MODE=FILE_DIRECT_PINNED_LOCAL` for engineering HOW only, and record `NATIVE_PLUGIN_ACTIVATION=NOT_OBSERVABLE`. This mode grants no authority, permission, model routing, or waiver of required activation. The project-local plugin is hook-free. Do not install, update, configure, add an adapter for, or enable hooks for PStack.

## Select only the needed specialist

Read the Git Delivery Skill for branch, guard, push, and PR work. Run its matching admission guard before every feature start or publish. Use the pinned executable directly. Push normally to the verified upstream. Do not force-push, finish against protected branches, rebase shared refs, delete branches, or bypass required CI.

Read Cloudflare Safety before local binding, D1, R2, or Cloudflare work. Its guard owns local configuration checks. Do not access credentials, Cloudflare APIs, remote resources, migrations, deployments, production targets, or settings without separate bounded authority. The presence of a local Wrangler binding does not prove a database is disposable.

Read Payload for Payload schema, API, hooks, or type-generation work. Read Wrangler for Wrangler commands or configuration, and use the installed version's source guide. Read the selected PStack Skill for coding or review HOW. For Next.js code, read the matching guide under `node_modules/next/dist/docs/` before editing and heed deprecations. Do not load unrelated Skills.

ChatGPT Dispatcher and Architect roles use the protected shared Loader, root instructions, and only their selected role Guide at one immutable instruction SHA. That Guide owns role workflow and user-led Issue discovery. Keep task receipts and handoffs in GitHub, not these instruction files. The Executor Guide does not replace that bootstrap or grant authority to another role.

## Choose a command by its effects

Read the exact script in `package.json`, its referenced config, the current Work Order, and relevant data boundary before running a command. Choose a focused check only when its output paths and data fixture are identified and covered by authority. Do not run broad suites by default. A command's name or a local binding does not establish that it is harmless.

| Command | Effects to account for |
| --- | --- |
| `pnpm run lint` | Runs ESLint across the repository. |
| `pnpm run typecheck` | Runs TypeScript with `--noEmit`; inspect TypeScript configuration for incremental outputs. |
| `pnpm run check` | Runs the Cloudflare guard, lint, typecheck, and every integration test. Integration tests use persisted local D1 state. |
| `pnpm run test:int -- tests/int/<spec>.int.spec.ts` | Writes through `.wrangler-test/state/v3`. Confirm the exact local fixture before running. |
| `pnpm run test:e2e -- tests/e2e/<spec>.spec.ts` | Loads `dotenv/config` through Playwright, starts `pnpm dev`, uses `.wrangler-test/e2e`, can push Payload schema and generated types, changes test data, and writes Playwright reports and results. |
| `pnpm run test` | Runs both integration and E2E suites and combines their database, server, secret-file, generated-file, and report effects. |
| `pnpm run dev` | Starts Next.js. Payload development can generate types and push schema changes to the bound D1 database. |
| `pnpm run devsafe` | Deletes `.next` and `.open-next`, then starts Next.js. |
| `pnpm run build` | Runs `next build`, writes build output, and uses `.wrangler-build/state/<pid>`. |
| `pnpm run generate:types` | Rewrites `cloudflare-env.d.ts` and `src/payload-types.ts`. |

The scripts select separate local persistence paths. Verify their bindings, fixture identity, and collision risk before any writing command. The original D1 and sidecars remain protected. `playwright.config.ts` imports `dotenv/config`, so Playwright may read `.env` indirectly. Never use a command that opens or alters a protected file, original database, or unowned output.

## Stop and deliver safely

Stop when scope, ownership, Host access, provenance, WIP, fixture identity, protected refs, or a command's effects are unclear. Report the exact missing fact and preserve the current state. Do not recover by using another checkout, Writer, permission profile, stash operation, cleanup, database migration, remote Cloudflare call, production action, or deployment.

If the task identity, repository match, or effective authorization is missing, report `REPOSITORY_AUTHORITY_MISMATCH / STOP`.

For a permitted PR, keep the diff within the Work Order. Read back the live PR and required check after each push. Require a new App15368 `check=PASS` on the exact immutable final HEAD, then a separate Reviewer with independently verified Host-enforced read-only access to that same HEAD. A `workspace-write` Reviewer is not read-only. Stop if the required Reviewer cannot run under enforced read-only access. The Founder alone merges protected branches.

After a Founder merge, release a checkout only under the exact preauthorization in the original Work Order and the Git Delivery Skill. Verify the merged SHA, origin, live protected ref, ownership, locks, all tracked and ignored WIP, and safe fast-forward path again. The former Writer does not retain ownership by default.
