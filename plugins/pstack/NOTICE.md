# PStack source notice

This directory vendors the complete `pstack/` subtree from [`cursor/plugins`](https://github.com/cursor/plugins/tree/ab69380dd50ee47d426b35cb8369cffdddafc218/pstack) at commit `ab69380dd50ee47d426b35cb8369cffdddafc218` (Git tree `880564357e051d7c7802da1cb5d8df1d0b008299`). The upstream subtree contains 200 files and 58 root Skills.

Upstream files are preserved unchanged, including the official `plugin.json`, `.cursor-plugin/` manifest, Skills, references, playbooks, scripts, agents, automations, documentation, assets, and MIT `LICENSE`.

Codex uses the official source through this repository's `.agents/plugins/marketplace.json` and `.codex/config.toml`. The minimal `.codex-plugin/plugin.json` declares `./skills/` because the official root manifest does not declare a Skills path. This compatibility manifest adds no runtime, hooks, or model routing. No upstream Skill is rewritten. The repository's root `AGENTS.md` contains the Codex and project safety boundaries. Cursor-only setup rules, model defaults, automations, and hooks are not activated.
