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

Record `HOST_CAPABILITY` separately from `TASK_AUTHORIZED_WRITES`. `HOST_CAPABILITY` describes the effective sandbox, writable roots, and approval behavior. `TASK_AUTHORIZED_WRITES` lists the exact files and operations that the live Founder-approved Work Order permits. Instructions limit actions but do not enforce filesystem access.

A Founder-approved risk decision may accept a known ambient Host boundary for one named task. Disclose the writable roots and record that decision in the Work Order. Do not carry it into another task. It never authorizes writes beyond the Work Order or overrides a higher-priority prohibition. Stop and quote the conflict if one applies.

A reusable Trusted Workspace baseline is `NOT_ESTABLISHED` unless the Founder separately ratifies a named repository, its defined writable roots, and the effective Host profile and approval behavior. Future Work Orders may reference that baseline only after ratification. It records accepted ambient Host risk. It grants no task write authority. Each Work Order must still name permitted paths and operations. Recheck the baseline after a material Host, approval, risk, or environment change. Issue #38's one-off `/Users/boat/projects` risk acceptance is not reusable and grants no sibling-repository authority.

Check effective Host policy once for a materially unchanged Host session. Reuse a valid receipt while the profile and task scope remain unchanged. Recheck only when a material change or concrete conflict appears.

Record model routing separately:

- `REQUESTED` is the model and effort requested at dispatch.
- `HOST_UI_REPORTED` is the identified Child's task-card selection, or `NOT_OBSERVABLE` when unavailable.
- `HOST_ACCEPTED` requires Host-returned acceptance for that Child. A successful spawn alone is not acceptance.
- `RUNTIME_VERIFIED` requires evidence of the model and effort served to that Child.

Follow the model sheet's fallback for ordinary low or medium risk work. Record `ROUTING_ASSUMED=PARTIAL` only when that fallback applies. Never infer exact routing from a request or task label. Stop when a model or effort critical to the task is unsupported or the Host reports a conflicting substitution.

### Select a review lane

Record three separate facts: `REVIEWER_SPAWN`, `HOST_READ_ONLY_ENFORCEMENT`, and `MODEL_ROUTING_EVIDENCE`. A missing Reviewer spawn is not a model-routing failure. A missing model telemetry field alone does not stop ordinary review when the model sheet's fallback applies.

Use a separate native Reviewer only when the Host enforces read-only access to the exact immutable final PR HEAD. Do not spawn a Reviewer under known `workspace-write`. A prompt to avoid writes, a successful spawn, or `auto_review` does not prove read-only access. Do not repeat a known-negative Host capability check while the Host session is materially unchanged. If no compliant lane is available, record the blocker and stop review delivery.

An alternative review contract may be proposed for future policy. It cannot replace the current protected native read-only Reviewer rule until lawful protected-policy adoption. It cannot review the PR that proposes it.

#### Candidate behavioral review lane

`BEHAVIORAL_READ_ONLY` is a future candidate for Founder-authorized LOW or MEDIUM ordinary work. Admit it only after lawful policy adoption and when the Founder-approved Work Order explicitly permits behavioral review. Keep the current protected native read-only requirement for PR #40. This candidate cannot review the PR that proposes it.

Use a native Reviewer Child instance distinct from the Writer Child. The two Children may share the same Root session and GitHub account. Bind the review to the exact immutable base and head SHAs. Give the Reviewer review-only instructions and no mutation tools or actions. If the Host exposes a tool with write capability, prohibit its use. The Reviewer must not write Source, tests, builds, databases, secrets, configuration, Host settings, Git state, refs, or the PR. The Reviewer must not publish a GitHub mutation.

Record the actual Host profile and its enforcement truth. Under `workspace-write`, record `HOST_ENFORCEMENT=workspace-write/NOT_ENFORCED`; never describe behavioral controls as Host-enforced read-only. Capture read-only before and after snapshots of checkout identity, origin, branch, refs, HEAD, and tracked, untracked, ignored, and generated WIP inventories and integrity. Record metadata only for protected files. Never open, read, or hash root `.env` or SQLite, D1, WAL, or SHM files. Stop on any unexplained difference and do not repair it. Snapshots cannot detect transient or external writes and do not establish OS isolation.

The receipt records the Reviewer identity, risk basis and Work Order, immutable base and head SHAs, findings, before and after snapshots, actual permission profile, enforcement truth, and `REVIEW_MODE=BEHAVIORAL_READ_ONLY`. Use this lane only for Founder-authorized LOW or MEDIUM ordinary work. The Reviewer cannot lower the risk classification. HIGH-risk work, secrets or credentials, security, production, deployments, infrastructure, and any stronger review contract require Host-enforced read-only access.

Prefer `gpt-6.1-sol` at `medium` only when the Host advertises it. Otherwise follow the model sheet's existing fallback. Missing routing telemetry alone does not stop ordinary review when that fallback applies. Record `MODEL_ROUTING_EVIDENCE` separately from `HOST_READ_ONLY_ENFORCEMENT`.

A GitHub-only review lane is a future-policy candidate and remains `NOT_YET_ADMITTED` until lawful protected-policy approval and permission and independence proofs exist. The distinct Reviewer Child requirement above applies. Independence does not require a separate GitHub account or credential identity. Verify actual least-privilege `Contents:read` and `Pull requests:read` permissions for the credential. Prove that the credential cannot write Source or refs or mutate the PR. Separately prove that the review context cannot write a local checkout or `.git` directory. A shared account or credential qualifies only when its effective permissions satisfy this read-only gate. Give the Reviewer the exact immutable base and head SHAs, the complete target diff, and the relevant protected Safety Kernel. Bind the findings and verdict receipt to those SHAs. If review publication needs write access, use a separate authorized publisher and keep the Reviewer's findings immutable to that publisher. A GitHub Connector, review comment, or `/review` name does not prove these conditions. This candidate does not satisfy PR #40's current native read-only Reviewer gate.

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
