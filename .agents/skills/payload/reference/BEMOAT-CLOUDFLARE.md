# Bemoat Payload and Cloudflare notes

This short local overlay records the starter's current integration points. The upstream Payload Skill files beside this page remain unchanged.

- `src/payload.config.ts` configures Payload's SQLite D1 adapter with `cloudflare.env.D1` and the R2 storage plugin for the `media` collection with `cloudflare.env.R2`.
- `src/collections/Media.ts` defines the local Media collection. The starter currently configures collections, not Payload Globals.
- For server-side Local API access, `src/app/(frontend)/page.tsx` awaits the config and calls `getPayload({ config })`; `src/app/my-route/route.ts` shows the same API in a route handler. Admin and Payload API route integration lives under `src/app/(payload)/`.
- The frontend layout and homepage use `src/lib/seo.ts` for metadata and structured-data helpers. See `tests/int/seo-foundation.int.spec.ts` and `tests/e2e/seo-foundation.spec.ts` for existing SEO behavior coverage.
- Follow [Cloudflare safety](../../cloudflare-safety/SKILL.md) for local binding and environment checks. It prohibits remote Cloudflare access, migrations, deployments, and production operations in this workflow.

These are observations of the current starter, not a claim that remote resources are provisioned or safe to operate.
