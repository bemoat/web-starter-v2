import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

import { getPlatformProxy } from 'wrangler'
import { describe, expect, it } from 'vitest'

import {
  isWranglerPlaceholderId,
  scanWranglerEnvironmentIsolation,
} from '../../.agents/skills/cloudflare-safety/scripts/guard-cloudflare-env'
import { isRemoteBindingsAuthorized } from '../../src/lib/payloadBuildContext'

const currentWrangler = readFileSync('wrangler.jsonc', 'utf8')
type LocalBindings = { D1: D1Database; R2: R2Bucket }
type LocalPlatform = Awaited<ReturnType<typeof getPlatformProxy<LocalBindings>>>

describe('local D1 and R2 bindings', () => {
  it('performs disposable local D1 INSERT/SELECT and R2 PUT/GET/DELETE operations', async () => {
    expect(process.env.CLOUDFLARE_ENV).toBe('dev')
    expect(process.env.PAYLOAD_MIGRATE_REMOTE).toBe('false')

    const persistPath = mkdtempSync(join(tmpdir(), 'web-starter-v2-local-d1-r2-'))
    const tableName = `codex_local_d1_${process.pid}_${Date.now().toString(36)}`
    const objectKey = `codex-local-r2/${process.pid}/${randomUUID()}.txt`
    const objectBody = `local-proof-${randomUUID()}`
    let platform: LocalPlatform | undefined
    let d1TableCreated = false
    let r2ObjectCreated = false

    try {
      platform = await getPlatformProxy<{
        D1: D1Database
        R2: R2Bucket
      }>({
        configPath: resolve('wrangler.jsonc'),
        environment: 'dev',
        envFiles: [],
        persist: { path: persistPath },
        remoteBindings: false,
      })

      const d1 = platform.env.D1
      const r2 = platform.env.R2

      await d1
        .prepare(`CREATE TABLE "${tableName}" (id INTEGER PRIMARY KEY, value TEXT NOT NULL)`)
        .run()
      d1TableCreated = true

      await d1
        .prepare(`INSERT INTO "${tableName}" (id, value) VALUES (?, ?)`)
        .bind(1, objectBody)
        .run()
      const row = await d1
        .prepare(`SELECT id, value FROM "${tableName}" WHERE id = ?`)
        .bind(1)
        .first<{ id: number; value: string }>()

      expect(row).toEqual({ id: 1, value: objectBody })

      await r2.put(objectKey, objectBody)
      r2ObjectCreated = true
      const storedObject = await r2.get(objectKey)

      expect(storedObject).not.toBeNull()
      await expect(storedObject?.text()).resolves.toBe(objectBody)

      await r2.delete(objectKey)
      expect(await r2.head(objectKey)).toBeNull()
      expect(await r2.get(objectKey)).toBeNull()
    } finally {
      if (platform) {
        if (r2ObjectCreated) await platform.env.R2.delete(objectKey)
        if (d1TableCreated) await platform.env.D1.prepare(`DROP TABLE "${tableName}"`).run()
        await platform.dispose()
      }
      rmSync(persistPath, { recursive: true, force: true })
    }
  })

  it('rejects production and implicit remote-binding fallbacks without remote requests', () => {
    expect(isRemoteBindingsAuthorized({ PAYLOAD_MIGRATE_REMOTE: 'true' })).toBe(false)
    expect(
      isRemoteBindingsAuthorized({
        CLOUDFLARE_ENV: 'production',
        PAYLOAD_MIGRATE_REMOTE: 'true',
      }),
    ).toBe(false)

    expect(isWranglerPlaceholderId('DEV_DATABASE_ID')).toBe(true)

    const productionViolations = scanWranglerEnvironmentIsolation(currentWrangler, {
      cloudflareEnv: 'production',
      remoteRequested: true,
    })
    expect(productionViolations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rule: 'no-production-env' }),
        expect.objectContaining({ rule: 'explicit-remote-environment' }),
      ]),
    )

    const collisionConfig = `{
      "d1_databases": [{ "database_id": "production-d1" }],
      "r2_buckets": [{ "bucket_name": "production-r2", "preview_bucket_name": "production-preview" }],
      "env": {
        "dev": {
          "d1_databases": [{ "database_id": "production-d1" }],
          "r2_buckets": [{ "bucket_name": "production-r2", "preview_bucket_name": "production-preview" }]
        }
      }
    }`
    const collisionViolations = scanWranglerEnvironmentIsolation(collisionConfig, {
      cloudflareEnv: 'dev',
      remoteRequested: false,
    })

    expect(collisionViolations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rule: 'dev-d1-isolated' }),
        expect.objectContaining({ rule: 'dev-r2-isolated' }),
      ]),
    )
  })
})
