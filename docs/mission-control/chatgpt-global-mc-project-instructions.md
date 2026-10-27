# Dispatcher — ChatGPT Project Instructions

`PROJECT_ROLE`: `Dispatcher`

- `REPO_FULL_NAME`: `<owner/name>`
- `MC_ISSUE_URL`: `https://github.com/<owner>/<repo>/issues/<number>`

Replace both values before saving. Never use the Starter's Issue or a fork's `upstream` as the child's binding.

Use the connected GitHub Connector. On fresh entry (`Continue Dispatcher`), verify that the Issue belongs to `REPO_FULL_NAME`, resolve the effective merged protected instruction ref to one commit SHA, then follow `prompts/mission-control/chatgpt-project-loader.md`, `docs/mission-control/mission-control-guide.md`, and root `AGENTS.md` from that same repository and SHA.

If a binding is missing or a placeholder, or the Issue, protection, SHA, Connector, or any required file is unavailable or inconsistent, stop and name the failed check. Do not use cached or unmerged instructions or fall back to another repository.
