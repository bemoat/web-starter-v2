# Bemoat project model sheet

This file records model and effort preferences for work in this repository. The Parent must read it explicitly before an admitted task or reentry. It is declarative guidance, not a router, auto-loader, permission control, spending cap, or guarantee of runtime model selection.

## Authority and evidence

Apply the active Founder-approved Issue and work order first, then root `AGENTS.md`, then the selected Host's real model and permission limits. This sheet supplies preferences after those controls. PStack Skills are generic HOW and do not create task authority.

Record each routing step separately:

- `REQUESTED` is the literal model and effort sent to the native spawn API.
- `HOST_UI_REPORTED` is the model and effort displayed on the identified Child's task card; record `NOT_OBSERVABLE` when it is unavailable. A task card reports a selection, not which model ran.
- `HOST_ACCEPTED` requires Host-returned acceptance evidence for the identified Child. Otherwise record `NOT_OBSERVABLE`; a successful spawn or task-card label alone does not prove acceptance.
- `ROUTING_ASSUMED=PARTIAL` is a bounded admission assumption that permits qualifying work to proceed under fallback rule #1. It is not exact routing acceptance `PARTIAL` and does not prove the served model.
- `RUNTIME_VERIFIED` requires evidence of the effective served model and effort attributable to that Child. A request or task-card label alone is insufficient.
- `NOT_OBSERVABLE` means the Host does not expose the required evidence. Never infer accepted routing or a runtime model from this sheet, role frontmatter, a request, a task card, or the Parent's model.

The current Cursor documentation describes project agents in `.cursor/agents/` and the `model` and `readonly` frontmatter fields. That documentation does not prove an account can select a candidate model or that a task used it. [Cursor subagents documentation](https://cursor.com/docs/subagents).

## Codex preferences

These are preferences for native Codex requests. Request a model or effort only when the current Host advertises it, then record acceptance from Host-returned evidence. The Parent chooses its own model; the `controller` row does not spawn an agent.

| PStack role | Preferred model | Preferred effort | Use |
| --- | --- | --- | --- |
| `controller` | `gpt-6-luna` | `xhigh` | Parent selection only. It grants no Source permission. |
| `feature, refactoring` | `gpt-6-luna` | `high` | One native Child Writer for an admitted scope. |
| `bug-fix` | `gpt-6-luna` | `high` | The same authorized Writer, not another agent. |
| `judgment and prose` | `gpt-6.1-sol` | `medium` | Optional bounded read-only Solver. |
| `strongest judgment` | `gpt-6.1-sol` | `high` | Optional bounded read-only Solver when the work order allows it. |
| `reviewer` | `gpt-6.1-sol` | `medium` | One separate read-only final-HEAD Reviewer when required. |

`default effort: session` means do not set an effort override for a role without a listed preference. `session hook: off` is documentary; no hook is installed or enabled by this sheet.

## Cursor preferences

These model IDs are candidates from the design spec, not evidence of availability, entitlement, or actual routing in a Cursor account. Cursor role files use `model: inherit` to avoid a second source of model truth. At invocation, the Parent may request a preferred model or effort only when the active Cursor Host advertises that override, then records whether the Host accepts it.

| PStack role | Preferred model candidate | Preferred effort | Use |
| --- | --- | --- | --- |
| `controller` | `composer-2.5` | `session` | Parent picker candidate only. |
| `feature, refactoring` | `composer-2.5` | `session` | One native Child Writer for an admitted scope. |
| `bug-fix` | `composer-2.5` | `session` | The same authorized Writer, not another agent. |
| `judgment and prose` | `gpt-5.6-sol` | `session` | Optional bounded read-only Solver if offered. |
| `strongest judgment` | `gpt-5.6-sol` | `session` | Optional bounded read-only Solver if offered. |
| `reviewer` | `gpt-5.6-sol` | `session` | One separate read-only final-HEAD Reviewer if offered. |

`default effort: session` means do not set an effort override. `session hook: off` is documentary; no hook is installed or enabled by this sheet. Until a real Cursor Host confirms its project instructions, role discovery, model selection, and permissions, report `CURSOR_PENDING` and do not claim runtime acceptance.

## Closed fallback rules

1. For a Founder-authorized ordinary LOW/MEDIUM-risk, non-model-critical task where exact model and effort are preferences, request one Host-advertised supported model and effort. A previously Founder-approved work envelope must authorize the task, but it need not separately opt in to partial routing visibility for this ordinary spawn. If one identifiable native Child spawn succeeds with no explicit rejection, substitution, unsupported effort, capacity issue, or contradictory task-card evidence, proceed with `ROUTING_ASSUMED=PARTIAL` even when `HOST_ACCEPTED=NOT_OBSERVABLE` and `RUNTIME_VERIFIED=NOT_OBSERVABLE`. Record any task-card label as `HOST_UI_REPORTED`; absent card data is not by itself a STOP. Do not require another spawn, probe, or task-specific Founder approval solely because acceptance or runtime metadata is unavailable. For high-risk, model/effort-critical, or hard-cost-control work, require adequate acceptance/control evidence or a separately explicit task-specific Founder risk disposition; otherwise STOP. If the Host substitutes a model or effort that violates the active work order, report `HOST_SUBSTITUTION_VIOLATES_WORK_ORDER / STOP`. STOP on any observed violation of the authorized model, effort, cost, or review requirements.
2. If effort is unavailable but the model is available, omit the effort only when the task envelope permits the Host's session default. Do not silently select a more expensive model or effort.
3. If the required Writer model is unavailable, use an inherited Parent model only when that model is explicitly selected, approved for the Writer scope and budget, and the native child identity is confirmed. Otherwise report `REQUIRED_WRITER_MODEL_UNAVAILABLE / STOP`. Root must not write as fallback.
4. If the preferred Reviewer model is unavailable, use an inherited Parent model only when the model is explicitly selected and observable, the review contract allows it, and the Reviewer remains a separate read-only context. Otherwise report `INDEPENDENT_REVIEW_UNAVAILABLE / STOP`.
5. `auto` is not deterministic routing. It is not a fallback for a required Writer or Reviewer. Skip an optional Solver when its preferred route is unavailable.
6. After the first native capacity rejection, stop dispatch. Do not add another Writer, worktree, controller, or global multi-agent setting.

## Shared role limits

| Limit | Value |
| --- | --- |
| Active Source Writers | 1 |
| Physical checkouts | 1 |
| Default advisory fanout | 0 |
| Optional Solver | 0 or 1, only when the work order permits |

These values are caps, not launches. No model row creates an agent or grants implicit fanout. Invoke only the roles permitted by the active work order.

Codex and Cursor are alternative launch Hosts, never simultaneous Writers on one checkout. Before a Host handoff, verify the previous Writer stopped, the checkout is released, and the current ref and WIP are read back.

The repository-local PStack package is generic HOW. Its recorded upstream pin is [`michael-denyer/pstack-claude@356c6e0f978df729eb16f227d795f34d221c5aad`](https://github.com/michael-denyer/pstack-claude/tree/356c6e0f978df729eb16f227d795f34d221c5aad). Read the local skill text and Codex mapping at `plugins/pstack/skills/poteto-mode/SKILL.md` and `plugins/pstack/skills/poteto-mode/references/codex-tools.md`. Do not run `/setup-pstack`, write global settings, or enable hooks. The Codex marketplace does not establish Cursor plugin discovery.
