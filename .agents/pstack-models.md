# Bemoat project model sheet

This file records model and effort preferences for work in this repository. The Parent must read it explicitly before an admitted task or reentry. It is declarative guidance, not a router, auto-loader, permission control, spending cap, or guarantee of runtime model selection.

## Authority and evidence

Apply the active Founder-approved Issue and work order first, then root `AGENTS.md`, then the selected Host's real model and permission limits. This sheet supplies preferences after those controls. PStack Skills are generic HOW and do not create task authority.

Record each routing step separately:

- `REQUESTED` is the literal model and effort sent to the native spawn API.
- `CHILD_SPAWN=PASS` means the Host created one distinct, identifiable, runnable native Child. When exact model and effort are preferences, this satisfies operational model-preference admission; it does not prove model acceptance or runtime identity.
- `HOST_UI_REPORTED` is the model and effort displayed on the identified Child's task card; record `NOT_OBSERVABLE` when it is unavailable. A task card reports a selection, not which model ran.
- `HOST_ACCEPTED` requires Host-returned acceptance evidence for the identified Child. Otherwise record `NOT_OBSERVABLE`; a successful spawn or task-card label alone does not prove acceptance.
- `ROUTING_ASSUMED=PARTIAL` records that a task proceeds with partial routing visibility. It is not exact routing acceptance `PARTIAL`, is not required when `CHILD_SPAWN=PASS`, and does not prove the served model.
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

1. For a Founder-authorized task where exact model and effort are preferences, `CHILD_SPAWN=PASS` satisfies operational model-preference admission. This applies at every risk label, including high-risk work, unless the active Work Order makes exact model, effort, or budget a hard constraint. Record `REQUESTED` exactly as sent. Record `HOST_UI_REPORTED`, `HOST_ACCEPTED`, and `RUNTIME_VERIFIED` only from attributable evidence; otherwise record `NOT_OBSERVABLE`. A successful spawn or task-card label does not prove model acceptance or runtime identity. Missing optional telemetry alone does not STOP or require another spawn, probe, or task-specific approval. A Host-reported substitution is a STOP only when it violates an explicit hard Work Order constraint. Report `HOST_SUBSTITUTION_VIOLATES_WORK_ORDER / STOP` for that violation. Stop on an explicit spawn rejection, no runnable Child, or an observed violation of a hard model, effort, or budget constraint. This rule does not waive Host permission, ownership, role, PStack, or independent Reviewer requirements.
2. If effort is unavailable but the model is available, omit the effort only when the Work Order permits the Host's session default. If effort is a hard constraint, require evidence that the Host accepted it. Do not silently select a more expensive model or effort.
3. If a Work Order requires an exact Writer model and the Host does not offer it, use an inherited Parent model only when that model is explicitly selected and approved for the Writer scope and budget, and the native Child identity is confirmed. Otherwise report `REQUIRED_WRITER_MODEL_UNAVAILABLE / STOP`. Root must not write as fallback. When the exact Writer model is only a preference, rule #1 applies.
4. A distinct native Reviewer remains required when the review contract requires one. Missing optional Reviewer routing telemetry does not waive the separate Reviewer identity, no-mutation task, or final-HEAD inspection. If a Work Order requires an exact Reviewer model and the Host does not offer it, use an inherited Parent model only when the model is explicitly selected and observable, the review contract allows it, and the Reviewer remains separate. Otherwise report `INDEPENDENT_REVIEW_UNAVAILABLE / STOP`. When the exact Reviewer model is only a preference, rule #1 applies.
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
