# Harness — ChatGPT Onboarding

This manual explains how to set up and use the repository's Architect and Dispatcher ChatGPT Projects. It is for people configuring the Projects; it is not another role Guide and must not be copied into Project Instructions.

## What the Harness does

The Harness uses versioned repository instructions and GitHub evidence to keep ChatGPT work tied to the correct repository and protected instruction source. The shared [Project Loader](../../prompts/mission-control/chatgpt-project-loader.md) verifies those bindings and loads the selected role's instructions from one commit. The role Guides define the workflows.

| Role                | Responsibility                                                                                                                            | Boundary                                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Architect**       | Advise the Founder on architecture, priorities, tradeoffs, and critical paths.                                                            | Advice does not authorize Source changes, dispatch Codex, or approve a merge. See the [Architect Guide](architect-guide.md).             |
| **Dispatcher**      | Admit a selected objective, verify its task-specific authorization, owner, scope, and next action, then coordinate delivery and evidence. | Does not implement Source, perform the independent review, or merge protected branches. See the [Dispatcher Guide](dispatcher-guide.md). |
| **Codex Execution** | The existing authorized Codex writer implements Source in the one admitted checkout and prepares the reviewed PR.                         | Preserves all WIP; does not merge protected branches or deploy. Repository rules are in [AGENTS.md](../../AGENTS.md).                    |

The Founder chooses the objective, grants reserved approvals, and personally merges protected branches. A GitHub comment is a durable record; it does not start a ChatGPT or Codex session. The protected instruction branch supplies policy text, not a Working Issue or Source authorization.

## Set up the two Projects

Complete the merge and Source readback steps at the end of this manual before creating either Project or changing Project Settings. GitHub does not synchronize these instructions into ChatGPT automatically.

1. Create or open two separate ChatGPT Projects: one **Dispatcher** Project and one **Architect** Project.
2. Copy the complete text from the matching short template:
   - [Dispatcher Project Instructions](chatgpt-dispatcher-project-instructions.md)
   - [Architect Project Instructions](chatgpt-architect-project-instructions.md)
3. Keep each template's role value: `PROJECT_ROLE=Dispatcher` for the Dispatcher Project and `PROJECT_ROLE=Architect` for the Architect Project. Set `REPO_FULL_NAME=bemoat/web-starter-v2` for both Projects. Set `INSTRUCTION_REF=dev` while you have verified that `dev` remains protected in this repository. For a different repository, use its exact `owner/name` and a branch whose effective protection you have verified.
4. Paste the resulting template into that Project's Project Instructions and save it. Do not paste this manual or the other role's Guide there. The shared Loader fetches the Loader, root `AGENTS.md`, and only that Project's selected Guide from the same verified commit.

`INSTRUCTION_REF` is a protected instruction-source branch, not an Issue, task, authorization, or commit SHA. A new objective or Epic does not require changing Project Settings when the repository and protected instruction branch stay the same.

## Start a conversation and choose its context

Start a fresh conversation in the intended Project with `Continue Architect` or `Continue Dispatcher`. The command bootstraps the role and verifies the repository and instruction source. It does not select or resume a task by itself.

- **With an Issue number or URL:** include it in your request. The role verifies that it belongs to the configured repository and uses that requested context. Authorization from another Issue is not inherited.
- **With a topic but no Issue:** state the topic. The role searches relevant existing Issues only in the configured repository. It uses a single clear match and explains the match; if several Issues plausibly match, it asks one focused question so you can choose.
- **With neither a topic nor an Issue:** `Continue Architect` or `Continue Dispatcher` alone should prompt the role to ask what you want to discuss or which Issue to inspect. It must not guess from previous chats, recent Issues, an old PR, WIP, or a roadmap.
- **With no matching Issue:** the role tells you that no match was found. It does not create an Issue automatically. You can continue discussing the topic or decide whether a new Issue is needed.

For example, you can ask, “Continue Architect; I want to compare options for [topic],” or “Continue Dispatcher; please inspect [Issue URL] and tell me the authorized next step.” Replace the bracketed examples with your actual topic or URL. Finding an Issue identifies context; it does not itself authorize Source changes or GitHub mutations.

## Move work between Architect and Dispatcher

Use an explicit handoff when you want to move work between Projects. The role records a bounded comment on the relevant existing Issue only when writing is authorized, reads back the exact comment URL, and gives you a complete destination-specific prompt in the same response. You copy that prompt into the other Project or conversation yourself; the comment does not launch it.

- **Architect → Dispatcher:** for a Founder-requested handoff or a material architecture decision that changes the next lawful action, Architect posts an `ADVISORY / NOT AUTHORIZATION` record and returns a copy-ready Dispatcher prompt. Dispatcher rechecks live task authorization, scope, WIP, and status before acting.
- **Dispatcher → Architect:** when you request consultation or a material architecture tradeoff changes the next lawful action, Dispatcher posts a `DECISION REQUEST / NOT AUTHORIZATION` record and returns a copy-ready Architect prompt. Architect advises; the Founder retains reserved approval decisions.
- **If writing is unavailable or unauthorized:** the role labels the draft `UNPOSTED`, states that no durable comment exists, and gives you an honest manual-transfer prompt.

Routine, already-authorized Dispatcher work does not require Architect consultation. Neither role creates a new Issue or starts Codex merely because a handoff or topic search occurred.

## Configure a child or forked repository

Create separate child-repository Projects and set their own `REPO_FULL_NAME` and `INSTRUCTION_REF`. Verify that the named branch exists in the child repository and that an active, enforceable protection rule applies to that exact branch. A branch named `main` or `dev` is not proof of protection.

Do not use the Starter's repository, Issues, approvals, protection rules, Project Settings, or Cloudflare resources as authority for a child. Do not fall back to the parent or `upstream`. The Loader fetches every required instruction from the explicitly selected repository at its verified protected commit. If the child has no verifiably protected instruction branch, stop and ask its repository owner to establish or identify one.

## Troubleshooting

| Message or situation                                                                      | What to check                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PROJECT_ROLE_REQUIRED / STOP`                                                            | Set the role to exactly `Architect` or `Dispatcher` in the matching template.                                                                                                                                                     |
| `PROJECT_BINDING_REQUIRED / STOP`                                                         | Replace the repository or instruction-branch placeholder; do not enter an Issue URL as `INSTRUCTION_REF`.                                                                                                                         |
| `INSTRUCTION_PROTECTION_REQUIRED / STOP`                                                  | Confirm the named branch exists and has active, enforceable protection in that same repository. If the Connector cannot verify protection, stop rather than guessing.                                                             |
| `REPOSITORY_AUTHORITY_MISMATCH / STOP`                                                    | Check the repository full name, selected branch, resolved commit SHA, and required files. Restart from one consistent SHA after correcting the mismatch.                                                                          |
| The Loader, root `AGENTS.md`, or selected Guide is missing, stale, or from another commit | Stop with `REPOSITORY_AUTHORITY_MISMATCH / STOP`; name the failed check and retry only after resolving all required files from one verified commit. Do not substitute cached, parent-repository, other-role, or unmerged content. |
| Topic search is ambiguous or has no match                                                 | Choose among the matching Issues when asked, or provide a clearer topic. No match does not create an Issue automatically.                                                                                                         |
| A `Continue …` conversation has no selected task                                          | This is expected. State the topic or provide an Issue URL or number; the role will not infer the last task.                                                                                                                       |

## After the approved onboarding change merges: verify Source, then update Settings manually

Before either Project is created or updated, the Founder must personally merge the reviewed onboarding change into the protected instruction branch. Then:

1. Read back the merged commit SHA and verify the required post-merge GitHub `check` is successful at that exact SHA.
2. At that same SHA, verify the eight PR paths: `README.md`, `AGENTS.md`, the shared Loader, both role Guides, both short Project Instructions, and this manual. Confirm that the README link resolves to this manual.
3. Only after those checks, manually create or replace each Project's Instructions with its matching template from that verified SHA, using the correct repository and protected instruction branch. Confirm both Projects contain the intended text.
4. Start genuinely fresh conversations in both Projects and check that binding failures stop, empty entry asks for intent, supplied Issues are checked in-repository, topic searches stay in-repository, ambiguous results ask one question, and no match is reported without auto-creation. Exercise real Architect ↔ Dispatcher handoffs separately.

Pre-merge formatting, link checks, static simulations, CI, and review validate the Source candidate; they do not prove fresh ChatGPT Project behavior. No automatic Settings update occurs. Do not treat this README link, a green CI run, an Issue comment, or an instruction branch as authorization to edit Source, change Cloudflare resources, deploy, mutate production, or merge.
