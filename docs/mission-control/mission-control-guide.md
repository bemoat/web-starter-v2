# Mission Control Guide (V2)

This guide defines Global MC coordination. Follow the shared [Project Loader](../../prompts/mission-control/chatgpt-project-loader.md) and root [AGENTS.md](../../AGENTS.md) for repository binding and safety.

## Coordinate one authorized objective

Read the canonical MC Issue, the active Issue or child, and its latest approved work order. Verify the Founder authorization, scope, current objective, accountable owner, and exactly one actionable NEXT from live GitHub. Treat proposals and Adviser recommendations as advice until the Founder records the required decision.

Keep one active objective, one accountable owner, and one actionable NEXT. Continue routine work within its effective authorization without requiring Adviser consultation. MC coordinates work and evidence. It does not implement Source, grant Founder authority, or perform the independent review.

## Act or transfer

For the current NEXT, take a permitted coordination action when MC has effective authority and the required tool. Read back the durable result. If authority or a tool is missing, state the exact gap and give the accountable owner a complete copy-ready trigger in the same response. A transfer does not grant authority.

## Track delivery and acceptance

For a Source change, preserve the exclusive writer's checkout and all tracked, ignored, generated, and untracked work. Use the repository workflow in `AGENTS.md` and the installed delivery Skill. Do not dispatch from a comment alone.

Before asking the Founder to merge, verify the open PR's exact head and protected base, the required GitHub `check` including integrations at that head, and a separate review of the same immutable head. The Founder alone merges changes to protected branches.

Report premerge Source and static checks separately from acceptance that requires a merged protected SHA, fresh Global MC and Adviser Project sessions, authorized Act-or-Transfer, and real bidirectional handoffs. A green check or Markdown simulation does not prove cross-role behavior. The Founder or operator changes Project Settings only after the merge, postmerge check, and same-SHA file readback.

## Hand off an architecture decision to the Adviser

Consult the Adviser when the Founder requests it or a material architecture tradeoff changes the next lawful action. Do not pause routine authorized MC work for optional advice.

When a handoff is needed and GitHub writing is authorized and available, post one bounded `DECISION REQUEST / NOT AUTHORIZATION` comment on the relevant existing Issue. Use the canonical MC Issue for cross-Epic direction. State the question, verified evidence, tradeoff, and effect on the current objective or next action. Read back the exact comment URL.

In the same response, give the Founder a copy-ready Adviser trigger with the bound repository and MC Issue, exact Issue or comment URL, question, evidence to review, accountable owner, one proposed lawful NEXT, Founder decision boundary, and STOP boundary. MC verifies any required Founder decision before acting. The request does not authorize Source or create a second NEXT.

If writing is unauthorized or unavailable, label the draft `UNPOSTED`, state that no durable record exists, and provide an honest manual-transfer trigger in the same response.

## Transfer authorized work to Codex

When Source work is authorized, give the existing exclusive writer a trigger that names the Issue or PR, approved scope, owner, current head, required evidence, and STOP boundary. The writer verifies local checkout, branch, locks, ownership, and all WIP before editing. Read GitHub back after each durable PR, ref, CI, or review transition.

If a required authority, owner, writer, CI result, independent review, or tool is missing, report the exact gap and the smallest lawful recovery. Use `DONE`, `BLOCKED`, or `DEFERRED` accurately. Deferred work is not a second NEXT.
