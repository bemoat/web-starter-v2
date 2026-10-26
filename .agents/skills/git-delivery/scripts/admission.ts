import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { realpathSync } from 'node:fs'
import { resolve } from 'node:path'

export type GitFlowAction = 'start' | 'publish'

export type GitFlowAdmissionState = {
  origin: string
  pushOrigin: string
  branch: string
  status: string
  workspace: string
  cwd: string
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

export const readGitFlowAdmissionState = (cwd: string): GitFlowAdmissionState => ({
  origin: runGit(cwd, ['remote', 'get-url', 'origin']).trim(),
  pushOrigin: runGit(cwd, ['remote', 'get-url', '--push', 'origin']).trim(),
  branch: runGit(cwd, ['branch', '--show-current']).trim(),
  status: runGit(cwd, ['status', '--porcelain', '--untracked-files=all', '--ignored']),
  workspace: realpathSync(runGit(cwd, ['rev-parse', '--show-toplevel']).trim()),
  cwd: realpathSync(resolve(cwd)),
})

export const gitFlowAdmissionViolations = (
  action: GitFlowAction,
  state: GitFlowAdmissionState,
): string[] => {
  const violations: string[] = []

  if (state.origin !== expectedOrigin) violations.push('origin is not canonical')
  if (state.pushOrigin !== expectedOrigin) violations.push('origin push URL is not canonical')
  if (state.workspace !== state.cwd) violations.push('cwd is not the repository root')
  const unownedWip = state.status
    .split('\n')
    .filter(Boolean)
    .filter((line) => {
      const path = line.slice(3).replace(/^"(.*)"$/, '$1')
      const root = path.split('/')[0]
      const preserved = line.startsWith('?? ')
        ? preservedUntrackedWip.has(path)
        : line.startsWith('!! ') && preservedIgnoredWip.has(root)
      return !preserved
    })
  if (unownedWip.length > 0) violations.push('tracked or unowned WIP is present')
  if (action === 'start' && state.branch !== 'dev') violations.push('feature start requires dev')
  if (action === 'publish' && !/^feature\/[^/]+$/.test(state.branch)) {
    violations.push('feature publish requires a feature branch')
  }

  return violations
}

export const assertGitFlowAdmission = (
  action: GitFlowAction,
  cwd: string,
): GitFlowAdmissionState => {
  const state = readGitFlowAdmissionState(cwd)
  const violations = gitFlowAdmissionViolations(action, state)

  if (violations.length > 0) throw new Error(violations.join('; '))
  return state
}

const isEntrypoint =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isEntrypoint) {
  const action = process.argv[2]

  if (action !== 'start' && action !== 'publish') {
    console.error('usage: admission.ts <start|publish>')
    process.exitCode = 2
  } else {
    try {
      assertGitFlowAdmission(action, process.cwd())
      console.log(`Git Flow ${action} admission passed.`)
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  }
}
