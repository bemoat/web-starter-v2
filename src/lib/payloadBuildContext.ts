type BuildContextEnv = Record<string, string | undefined>

export function isPayloadBuildContext(
  env: BuildContextEnv = process.env,
  argv: string[] = process.argv,
): boolean {
  const lifecycleEvent = env.npm_lifecycle_event ?? ''

  return (
    lifecycleEvent === 'build' ||
    env.BEMOAT_BUILD_CONTEXT === 'opennext-next-build' ||
    env.NEXT_PHASE === 'phase-production-build' ||
    argv.some((value) => /build$/.test(value))
  )
}

/** Remote bindings require an explicit migration/deployment authorization marker. */
export function isRemoteBindingsAuthorized(env: BuildContextEnv = process.env): boolean {
  return env.PAYLOAD_MIGRATE_REMOTE === 'true' && env.CLOUDFLARE_ENV === 'dev'
}
