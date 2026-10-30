import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { lstatSync, readdirSync, realpathSync } from 'node:fs'
import { join, resolve } from 'node:path'

export type GitFlowAction = 'start' | 'publish'
export type GitFlowKind = 'feature' | 'release' | 'hotfix'

export type GitFlowAdmissionState = {
  origin: string
  pushOrigins: string[]
  branch: string
  head: string
  upstream: { remote: string; ref: string } | null
  remoteBranchHead: string | null
  status: string
  workspace: string
  cwd: string
  worktrees: string[]
  gitLocks: string[]
  rootEnvSafe?: boolean
}

const expectedOrigin = 'https://github.com/bemoat/web-starter-v2.git'
const preservedUntrackedWip = new Set(['AGENTS.md', 'CLAUDE.md'])
const preservedIgnoredWip = new Set([
  '.next',
  '.open-next',
  '.wrangler',
  '.wrangler-build',
  '.wrangler-test',
  'node_modules',
  'next-env.d.ts',
  'playwright-report',
  'test-results',
  'tsconfig.tsbuildinfo',
])

const runGit = (cwd: string, args: string[]) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

const readGitConfig = (cwd: string, key: string) => {
  try {
    return runGit(cwd, ['config', '--get-all', key]).trim()
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 1) return ''
    throw error
  }
}

const readRef = (cwd: string, ref: string) => {
  try {
    return runGit(cwd, ['rev-parse', '--verify', ref]).trim()
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 128) return null
    throw error
  }
}

const readWorktrees = (cwd: string) =>
  runGit(cwd, ['worktree', 'list', '--porcelain'])
    .split('\n')
    .filter((line) => line.startsWith('worktree '))
    .map((line) => realpathSync(line.slice('worktree '.length)))

const readGitLocks = (cwd: string) => {
  const gitDirs = [
    runGit(cwd, ['rev-parse', '--git-dir']).trim(),
    runGit(cwd, ['rev-parse', '--git-common-dir']).trim(),
  ].map((path) => resolve(cwd, path))
  const visited = new Set<string>()
  const locks = new Set<string>()

  const scan = (directory: string, recursive: boolean) => {
    if (visited.has(directory)) return
    visited.add(directory)

    let entries
    try {
      entries = readdirSync(directory, { withFileTypes: true })
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return
      throw error
    }

    for (const entry of entries) {
      const path = join(directory, entry.name)
      if (entry.isFile() && entry.name.endsWith('.lock')) locks.add(path)
      else if (recursive && entry.isDirectory()) scan(path, true)
    }
  }

  for (const gitDir of new Set(gitDirs)) {
    scan(gitDir, false)
    scan(join(gitDir, 'refs'), true)
    scan(join(gitDir, 'worktrees'), true)
  }

  return [...locks]
}

const hasSafeRootEnvMetadata = (workspace: string, cwd: string): boolean => {
  if (workspace !== cwd || typeof process.getuid !== 'function') return false

  try {
    const envPath = join(workspace, '.env')
    const ownerUid = BigInt(process.getuid())
    const first = lstatSync(envPath, { bigint: true })

    if (
      !first.isFile() ||
      first.isSymbolicLink() ||
      first.uid !== ownerUid ||
      first.nlink !== 1n ||
      (first.mode & 0o022n) !== 0n
    ) {
      return false
    }

    if (realpathSync(workspace) !== workspace || realpathSync(envPath) !== envPath) {
      return false
    }

    const second = lstatSync(envPath, { bigint: true })
    return (
      first.dev === second.dev &&
      first.ino === second.ino &&
      first.size === second.size &&
      first.mtimeNs === second.mtimeNs &&
      first.ctimeNs === second.ctimeNs &&
      first.uid === second.uid &&
      first.gid === second.gid &&
      first.nlink === second.nlink &&
      first.mode === second.mode
    )
  } catch {
    return false
  }
}

export const readGitFlowAdmissionState = (cwd: string): GitFlowAdmissionState => {
  const origin = readGitConfig(cwd, 'remote.origin.url')
  const configuredPushOrigins = readGitConfig(cwd, 'remote.origin.pushurl')
  const branch = runGit(cwd, ['branch', '--show-current']).trim()
  const upstreamRemote = readGitConfig(cwd, `branch.${branch}.remote`)
  const upstreamRef = readGitConfig(cwd, `branch.${branch}.merge`)
  const pushOrigins = (configuredPushOrigins || origin)
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)

  const head = runGit(cwd, ['rev-parse', 'HEAD']).trim()
  const status = runGit(cwd, ['status', '--porcelain', '--untracked-files=all', '--ignored'])
  const workspace = realpathSync(runGit(cwd, ['rev-parse', '--show-toplevel']).trim())
  const resolvedCwd = realpathSync(resolve(cwd))
  const rootEnvSafe = status.split('\n').includes('!! .env')
    ? hasSafeRootEnvMetadata(workspace, resolvedCwd)
    : false

  return {
    origin,
    pushOrigins,
    branch,
    head,
    upstream:
      upstreamRemote || upstreamRef ? { remote: upstreamRemote, ref: upstreamRef } : null,
    remoteBranchHead: branch ? readRef(cwd, `refs/remotes/origin/${branch}`) : null,
    status,
    workspace,
    cwd: resolvedCwd,
    rootEnvSafe,
    worktrees: readWorktrees(cwd),
    gitLocks: readGitLocks(cwd),
  }
}

export const gitFlowAdmissionViolations = (
  action: GitFlowAction,
  kind: GitFlowKind,
  state: GitFlowAdmissionState,
): string[] => {
  const violations: string[] = []

  if (state.origin !== expectedOrigin) violations.push('origin is not canonical')
  if (state.pushOrigins.length === 0 || state.pushOrigins.some((url) => url !== expectedOrigin)) {
    violations.push('origin push URL is not canonical')
  }
  if (state.workspace !== state.cwd) violations.push('cwd is not the repository root')
  const unownedWip = state.status
    .split('\n')
    .filter(Boolean)
    .filter((line) => {
      const path = line.slice(3).replace(/^"(.*)"$/, '$1')
      const root = path.split('/')[0]
      const preserved = line.startsWith('?? ')
        ? preservedUntrackedWip.has(path)
        : line.startsWith('!! ') &&
          (preservedIgnoredWip.has(root) || (line === '!! .env' && state.rootEnvSafe === true))
      return !preserved
    })
  if (unownedWip.length > 0) violations.push('tracked or unowned WIP is present')
  if (state.worktrees.length !== 1 || state.worktrees[0] !== state.workspace) {
    violations.push('exactly one canonical worktree is required')
  }
  if (state.gitLocks.length > 0) violations.push('Git lock files are present')
  if (action === 'start') {
    const requiredBase = kind === 'hotfix' ? 'main' : 'dev'
    if (state.branch !== requiredBase) {
      violations.push(`${kind} start requires ${requiredBase}`)
    } else {
      if (
        state.upstream?.remote !== 'origin' ||
        state.upstream.ref !== `refs/heads/${requiredBase}`
      ) {
        violations.push(`${kind} start requires origin/${requiredBase} upstream`)
      }
      if (state.remoteBranchHead === null || state.head !== state.remoteBranchHead) {
        violations.push(`${kind} start requires local ${requiredBase} to match origin/${requiredBase}`)
      }
    }
  }
  if (action === 'publish' && !new RegExp(`^${kind}\\/[^/]+$`).test(state.branch)) {
    violations.push(`${kind} publish requires a ${kind} branch`)
  }
  if (
    action === 'publish' &&
    state.upstream !== null &&
    (state.upstream.remote !== 'origin' || state.upstream.ref !== `refs/heads/${state.branch}`)
  ) {
    violations.push(`publish upstream must be origin/${state.branch}`)
  }

  return violations
}

export const assertGitFlowAdmission = (
  action: GitFlowAction,
  kind: GitFlowKind,
  cwd: string,
): GitFlowAdmissionState => {
  const state = readGitFlowAdmissionState(cwd)
  const violations = gitFlowAdmissionViolations(action, kind, state)

  if (violations.length > 0) throw new Error(violations.join('; '))
  return state
}

const isEntrypoint =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isEntrypoint) {
  const action = process.argv[2]
  const kind = process.argv[3]

  if (
    (action !== 'start' && action !== 'publish') ||
    (kind !== 'feature' && kind !== 'release' && kind !== 'hotfix')
  ) {
    console.error('usage: admission.ts <start|publish> <feature|release|hotfix>')
    process.exitCode = 2
  } else {
    try {
      assertGitFlowAdmission(action, kind, process.cwd())
      console.log(`Git Flow ${kind} ${action} admission passed.`)
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  }
}
