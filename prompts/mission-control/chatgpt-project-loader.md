# ChatGPT Project Loader V2

Use this shared bootstrap on fresh entry, reentry, a new objective, a durable result, STOP recovery, or a cross-role handoff. Read the selected Project Instructions for `PROJECT_ROLE`, `REPO_FULL_NAME`, `MC_ISSUE_URL`, and the GitHub Connector.

- Stop with `PROJECT_ROLE_REQUIRED / STOP` if `PROJECT_ROLE` is missing or is not `Dispatcher` or `Architect`. Stop with `PROJECT_BINDING_REQUIRED / STOP` if either repository binding is missing or still a placeholder.
- Use the Connector to verify that the canonical MC Issue belongs to `REPO_FULL_NAME`. Read the live Issue and applicable repository protection to identify the effective merged protected instruction ref. Resolve that ref to one commit SHA. Do not assume a branch name or use another repository's Issue, approvals, protection, or `upstream` as authority.
- At that repository and SHA, fetch and verify this Loader, root `AGENTS.md`, and only the selected Guide. For `Dispatcher`, use `docs/mission-control/dispatcher-guide.md`. For `Architect`, use `docs/mission-control/architect-guide.md`.
- Stop with `REPOSITORY_AUTHORITY_MISMATCH / STOP` if the Issue, protection, SHA, repository identity, Loader, root `AGENTS.md`, or selected Guide is missing or inconsistent. State the failed check. Never fall back to the Starter, a parent repository, cached text, or an unmerged candidate. Never load the other role's Guide as a substitute.

Follow only the selected Guide for role behavior. Load other Issues and evidence when that Guide's current task requires them. A GitHub comment records a handoff; it does not launch a ChatGPT or Codex session.
