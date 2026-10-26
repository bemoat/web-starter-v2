# Nonproduction Verification

Use this playbook for bounded local evidence only. It does not authorize Cloudflare access or remote operations.

## Checks

From the repository root:

```sh
pnpm run guard:cloudflare-env
pnpm exec vitest run --environment node --config ./vitest.config.mts tests/int/cloudflare-env-guard.int.spec.ts
test ! -e scripts/guard-cloudflare-env.ts
test -f .agents/skills/cloudflare-safety/scripts/guard-cloudflare-env.ts
```

The focused regression must confirm local-only configuration, explicit remote authorization, production/unknown environment rejection, D1/R2 collision protection, R2 preview isolation, and the single Skill-owned implementation.

## Evidence

Record the exact branch and HEAD, the guard output, focused test result, `git diff --check`, the package-script path, and the CI result. Confirm `.github/workflows/ci.yml` remains native and reaches the guard through `pnpm run check`; Skill loading is optional and must not affect CI enforcement.

## STOP conditions

Stop without remote access or mutation if:

- `CLOUDFLARE_ENV` is missing, production, inherited, or unknown for a remote request;
- D1/R2 targets collide with production or R2 primary and preview are identical;
- a remote D1/R2 target is a placeholder or its separate provisioning is not authenticated;
- the root guard exists, more than one implementation exists, or the package/CI chain bypasses the Skill-owned guard;
- credentials, migrations, deployments, provisioning, settings, or Cloudflare API access would be required.
