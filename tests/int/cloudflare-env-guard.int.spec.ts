import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  isWranglerPlaceholderId,
  scanWranglerEnvironmentIsolation,
} from '../../.agents/skills/cloudflare-safety/scripts/guard-cloudflare-env'
import { isRemoteBindingsAuthorized } from '../../src/lib/payloadBuildContext'

const currentWrangler = readFileSync('wrangler.jsonc', 'utf8')
const skillGuardPath = resolve('.agents/skills/cloudflare-safety/scripts/guard-cloudflare-env.ts')
const rootGuardPath = resolve('scripts/guard-cloudflare-env.ts')

describe('Cloudflare environment safety', () => {
  it('keeps one authoritative guard in the project Skill path', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts?: { 'guard:cloudflare-env'?: string }
    }

    expect(existsSync(skillGuardPath)).toBe(true)
    expect(existsSync(rootGuardPath)).toBe(false)
    expect(packageJson.scripts?.['guard:cloudflare-env']).toContain(
      '.agents/skills/cloudflare-safety/scripts/guard-cloudflare-env.ts',
    )
  })

  it('uses local bindings unless remote authorization is explicit', () => {
    expect(isRemoteBindingsAuthorized({ NODE_ENV: 'production' })).toBe(false)
    expect(isRemoteBindingsAuthorized({ NODE_ENV: 'production', PAYLOAD_MIGRATE_REMOTE: 'true' })).toBe(false)
    expect(
      isRemoteBindingsAuthorized({
        CLOUDFLARE_ENV: 'dev',
        NODE_ENV: 'production',
        PAYLOAD_MIGRATE_REMOTE: 'true',
      }),
    ).toBe(true)
  })

  it('recognizes the intentionally unprovisioned dev D1 placeholder', () => {
    expect(isWranglerPlaceholderId('DEV_DATABASE_ID')).toBe(true)
  })

  it('passes the current dev configuration for local-only use', () => {
    expect(
      scanWranglerEnvironmentIsolation(currentWrangler, {
        cloudflareEnv: 'dev',
        remoteRequested: false,
      }),
    ).toEqual([])
  })

  it('blocks remote operations without an explicit environment', () => {
    const violations = scanWranglerEnvironmentIsolation(currentWrangler, {
      cloudflareEnv: undefined,
      remoteRequested: true,
    })

    expect(violations.some((violation) => violation.rule === 'explicit-remote-environment')).toBe(true)
  })

  it('blocks remote dev operations until D1 is provisioned', () => {
    const violations = scanWranglerEnvironmentIsolation(currentWrangler, {
      cloudflareEnv: 'dev',
      remoteRequested: true,
    })

    expect(violations.some((violation) => violation.rule === 'remote-d1-provisioned')).toBe(true)
  })

  it('blocks production and unknown environments', () => {
    expect(
      scanWranglerEnvironmentIsolation(currentWrangler, { cloudflareEnv: 'production' }),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ rule: 'no-production-env' })]))

    expect(
      scanWranglerEnvironmentIsolation(currentWrangler, { cloudflareEnv: 'staging' }),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ rule: 'known-cloudflare-env' })]))

    expect(
      scanWranglerEnvironmentIsolation(currentWrangler, {
        cloudflareEnv: 'toString',
        remoteRequested: true,
      }),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ rule: 'explicit-remote-environment' })]))
  })

  it('detects D1 and R2 collisions between top-level and dev targets', () => {
    const config = `{
      "d1_databases": [{ "database_id": "same-id" }],
      "r2_buckets": [{ "bucket_name": "same-bucket", "preview_bucket_name": "same-preview" }],
      "env": {
        "dev": {
          "d1_databases": [{ "database_id": "same-id" }],
          "r2_buckets": [{ "bucket_name": "same-bucket", "preview_bucket_name": "same-preview" }]
        }
      }
    }`

    const violations = scanWranglerEnvironmentIsolation(config, { cloudflareEnv: 'dev' })

    expect(violations.some((violation) => violation.rule === 'dev-d1-isolated')).toBe(true)
    expect(violations.some((violation) => violation.rule === 'dev-r2-isolated')).toBe(true)
  })

  it('detects identical R2 primary and preview targets', () => {
    const violations = scanWranglerEnvironmentIsolation(`{
      "r2_buckets": [{ "bucket_name": "same-bucket", "preview_bucket_name": "same-bucket" }]
    }`)

    expect(violations.some((violation) => violation.rule === 'r2-preview-isolated')).toBe(true)
  })
})
