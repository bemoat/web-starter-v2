import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type Binding = {
  database_id?: string
  bucket_name?: string
  preview_bucket_name?: string
}

type WranglerConfig = {
  d1_databases?: Binding[]
  r2_buckets?: Binding[]
  env?: Record<string, WranglerConfig>
}

export type GuardViolation = {
  rule: string
  message: string
}

export const PRODUCTION_ENV_ERROR =
  'CLOUDFLARE_ENV=production is forbidden; production uses the top-level configuration.'

export function stripJsoncComments(content: string): string {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/,\s*([}\]])/g, '$1')
}

export function parseWranglerJsonc(content: string): WranglerConfig {
  return JSON.parse(stripJsoncComments(content)) as WranglerConfig
}

export function isWranglerPlaceholderId(value: string | undefined): boolean {
  if (!value) return true
  const normalized = value.trim()
  return /^(?:DEV_)?DATABASE_ID$/i.test(normalized) || /^<[^>]+>$/.test(normalized)
}

function d1Ids(bindings: Binding[] = []): string[] {
  return bindings.flatMap((binding) => (binding.database_id ? [binding.database_id] : []))
}

function r2Names(bindings: Binding[] = []): string[] {
  return bindings.flatMap((binding) =>
    [binding.bucket_name, binding.preview_bucket_name].filter(
      (name): name is string => Boolean(name),
    ),
  )
}

function scanR2PreviewPairs(bindings: Binding[] = [], scope: string): GuardViolation[] {
  return bindings.flatMap((binding) =>
    binding.bucket_name && binding.preview_bucket_name && binding.bucket_name === binding.preview_bucket_name
      ? [{
          rule: 'r2-preview-isolated',
          message: `${scope} R2 bucket_name and preview_bucket_name must differ.`,
        }]
      : [],
  )
}

export function scanWranglerEnvironmentIsolation(
  content: string,
  options: { cloudflareEnv?: string; remoteRequested?: boolean } = {},
): GuardViolation[] {
  const violations: GuardViolation[] = []
  const cloudflareEnv = Object.prototype.hasOwnProperty.call(options, 'cloudflareEnv')
    ? options.cloudflareEnv
    : process.env.CLOUDFLARE_ENV
  const remoteRequested = Object.prototype.hasOwnProperty.call(options, 'remoteRequested')
    ? options.remoteRequested === true
    : process.env.PAYLOAD_MIGRATE_REMOTE === 'true'

  if (cloudflareEnv === 'production') {
    violations.push({ rule: 'no-production-env', message: PRODUCTION_ENV_ERROR })
  }

  let config: WranglerConfig
  try {
    config = parseWranglerJsonc(content)
  } catch (error) {
    return [
      {
        rule: 'valid-wrangler-config',
        message: `Could not parse wrangler.jsonc: ${error instanceof Error ? error.message : String(error)}`,
      },
    ]
  }

  if (config.env?.production) {
    violations.push({
      rule: 'no-env-production',
      message: 'wrangler.jsonc must not define env.production.',
    })
  }

  const namedEnvironments = config.env ?? {}
  const hasNamedEnvironment = (name: string): boolean =>
    Object.prototype.hasOwnProperty.call(namedEnvironments, name)

  if (cloudflareEnv && cloudflareEnv !== 'production' && !hasNamedEnvironment(cloudflareEnv)) {
    violations.push({
      rule: 'known-cloudflare-env',
      message: `CLOUDFLARE_ENV=${cloudflareEnv} is not configured.`,
    })
  }

  const productionD1 = new Set(d1Ids(config.d1_databases).filter((id) => !isWranglerPlaceholderId(id)))
  const productionR2 = new Set(r2Names(config.r2_buckets))

  violations.push(...scanR2PreviewPairs(config.r2_buckets, 'top-level'))

  for (const [environmentName, environmentConfig] of Object.entries(namedEnvironments)) {
    if (environmentName === 'production') continue

    const environmentD1 = d1Ids(environmentConfig.d1_databases)
    const environmentR2 = r2Names(environmentConfig.r2_buckets)
    const d1Rule = environmentName === 'dev' ? 'dev-d1-isolated' : 'named-env-d1-isolated'
    const r2Rule = environmentName === 'dev' ? 'dev-r2-isolated' : 'named-env-r2-isolated'

    violations.push(...scanR2PreviewPairs(environmentConfig.r2_buckets, `env.${environmentName}`))

    for (const id of environmentD1) {
      if (!isWranglerPlaceholderId(id) && productionD1.has(id)) {
        violations.push({
          rule: d1Rule,
          message: `env.${environmentName} D1 database_id matches the top-level target (${id}).`,
        })
      }
    }

    for (const name of environmentR2) {
      if (productionR2.has(name)) {
        violations.push({
          rule: r2Rule,
          message: `env.${environmentName} R2 bucket matches the top-level target (${name}).`,
        })
      }
    }
  }

  if (remoteRequested &&
      (!cloudflareEnv || cloudflareEnv === 'production' || !hasNamedEnvironment(cloudflareEnv))) {
    violations.push({
      rule: 'explicit-remote-environment',
      message: 'Remote migration/deploy requires an explicit configured nonproduction environment.',
    })
  }

  if (remoteRequested && cloudflareEnv && cloudflareEnv !== 'production' && hasNamedEnvironment(cloudflareEnv)) {
    const selectedEnvironment = namedEnvironments[cloudflareEnv]
    const selectedD1 = d1Ids(selectedEnvironment.d1_databases)
    const selectedR2 = r2Names(selectedEnvironment.r2_buckets)

    if (selectedD1.length === 0 || selectedD1.some(isWranglerPlaceholderId)) {
      violations.push({
        rule: 'remote-d1-provisioned',
        message: `Remote ${cloudflareEnv} operations require a separately provisioned D1 database_id.`,
      })
    }

    if (selectedR2.length === 0) {
      violations.push({
        rule: 'remote-r2-provisioned',
        message: `Remote ${cloudflareEnv} operations require distinct R2 bucket targets.`,
      })
    }
  }

  return violations
}

export function runCloudflareEnvGuard({
  root = process.cwd(),
  cloudflareEnv = process.env.CLOUDFLARE_ENV,
  remoteRequested = process.env.PAYLOAD_MIGRATE_REMOTE === 'true',
}: {
  root?: string
  cloudflareEnv?: string
  remoteRequested?: boolean
} = {}): GuardViolation[] {
  return scanWranglerEnvironmentIsolation(
    readFileSync(resolve(root, 'wrangler.jsonc'), 'utf8'),
    { cloudflareEnv, remoteRequested },
  )
}

if (process.argv[1]?.endsWith('guard-cloudflare-env.ts')) {
  const violations = runCloudflareEnvGuard()
  if (violations.length > 0) {
    console.error('Cloudflare environment guard failed:')
    for (const violation of violations) console.error(`- [${violation.rule}] ${violation.message}`)
    process.exitCode = 1
  } else {
    console.log('Cloudflare environment guard passed.')
  }
}
