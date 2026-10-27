---
name: cloudflare-safety
description: Use for local, read-only Cloudflare, D1/R2, bindings and deployment safety boundaries in web-starter-v2.
---

# Cloudflare Safety

This project-specific Skill documents the existing Cloudflare safety boundary for `bemoat/web-starter-v2`. It does not replace the repository's engineering workflow or CI.

## Mandatory guard

The authoritative implementation is:

`.agents/skills/cloudflare-safety/scripts/guard-cloudflare-env.ts`

Run it through the package script:

```sh
pnpm run guard:cloudflare-env
```

`package.json` and `.github/workflows/ci.yml` must keep this guard in the mandatory `pnpm run check` chain. CI must remain safe even when no Agent loads this Skill.

## Safety behavior

- Local, test, build, and preview paths use Wrangler local bindings by default and set `PAYLOAD_MIGRATE_REMOTE=false`.
- Remote bindings require both `PAYLOAD_MIGRATE_REMOTE=true` and an explicit configured nonproduction `CLOUDFLARE_ENV=dev`.
- Production uses the top-level Wrangler configuration; `CLOUDFLARE_ENV=production` is rejected.
- The guard rejects unknown or inherited environment names, production-target collisions, identical R2 primary/preview targets, and remote operations without a nonplaceholder D1 binding or any configured R2 target.
- The top-level production D1/R2 identities are preserved; configuration names and placeholders do not prove that disposable remote resources exist.
- The guard cannot authenticate remote provisioning or prove that a named R2 resource is disposable; that evidence remains an external acceptance requirement.

## Scope boundary

Use this Skill only for read-only local configuration checks and the repository's isolated tests. Do not access credentials, Cloudflare APIs, remote resources, migrations, deployments, provisioning, production targets, or settings/rulesets. Do not add a root guard framework, dispatcher, registry, generic PStack workflow, or duplicate implementation.

If the guard fails, the environment is ambiguous, or resource ownership is unverified, stop and report the exact violation. Do not infer safety from a placeholder or a bucket name.
