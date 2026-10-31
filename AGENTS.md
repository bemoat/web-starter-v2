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

Choose focused checks only when their effects are authorized. Read the [executor guide](docs/engineering/executor-guide.md) before Child admission or any Source, test, Git, or database mutation.

## Root Chat is CONTROLLER-ONLY

Root never writes Source, tests, generated files, or Git state, commits, or publishes PRs. Use one physical checkout and one exclusive native Child Writer. Admit the Child only after task authority, Host, ownership, WIP, and PStack gates pass. Stop if no eligible Child can run.

Current protected policy requires a separate native Child Reviewer with Host-enforced read-only access to the same immutable final PR HEAD. `workspace-write` does not qualify. Do not self-review or allow Reviewer Source or ref mutation. Keep the currently governing protected review contract in force until a proposed alternative method is lawfully adopted. A PR that proposes an alternative review method cannot use its own unmerged amendment to satisfy its final-review requirement. Admit an optional read-only Solver only when the Work Order permits.

The executor guide may describe a future `BEHAVIORAL_READ_ONLY` lane for Founder-authorized LOW/MEDIUM work. It remains a proposal until lawful adoption and cannot satisfy the currently governing protected Reviewer requirement.
Independent review requires a Reviewer Child instance distinct from the Writer Child. They may share the same Root session and GitHub account.

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

Read GitHub back after each Issue, PR, ref, CI, or review change. Require App15368 `check=PASS` on the immutable final PR HEAD, then an independent Host-enforced read-only review of that HEAD. The Founder alone merges protected branches. Follow the approved conditional checkout-release clause only after verified Founder merge.
