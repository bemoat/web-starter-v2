import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const skillPath = resolve('.agents/skills/git-delivery/SKILL.md')
const workflowPath = resolve('.github/workflows/ci.yml')

const nativeGitFlowVersion = (() => {
  try {
    return execFileSync('git', ['flow', 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return ''
  }
})()

const runGit = (cwd: string, args: string[]) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

const configureIdentity = (cwd: string) => {
  runGit(cwd, ['config', 'user.name', 'Git Flow fixture'])
  runGit(cwd, ['config', 'user.email', 'git-flow-fixture@example.invalid'])
}

const createFixture = () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'web-starter-v2-git-flow-'))
  const remote = join(fixtureRoot, 'remote.git')
  const seed = join(fixtureRoot, 'seed')
  const work = join(fixtureRoot, 'work')

  runGit(fixtureRoot, ['init', '--bare', remote])
  runGit(fixtureRoot, ['init', '--initial-branch=main', seed])
  configureIdentity(seed)
  runGit(seed, ['commit', '--allow-empty', '-m', 'fixture main'])
  runGit(seed, ['remote', 'add', 'origin', remote])
  runGit(seed, ['push', 'origin', 'main'])
  runGit(seed, ['switch', '-c', 'dev'])
  runGit(seed, ['commit', '--allow-empty', '-m', 'fixture dev'])
  runGit(seed, ['push', '--set-upstream', 'origin', 'dev'])
  runGit(fixtureRoot, ['clone', remote, work])
  configureIdentity(work)
  runGit(work, ['switch', 'dev'])
  runGit(work, [
    'flow',
    'init',
    '--local',
    '--main=main',
    '--develop=dev',
    '--no-create-branches',
    '-d',
  ])

  return { fixtureRoot, remote, work }
}

const hasPinnedNativeGitFlow = nativeGitFlowVersion.includes('2.1.0 (git-flow-next)')

describe('Git Flow delivery admission', () => {
  it('keeps the required check on both protected branch paths', () => {
    const workflow = readFileSync(workflowPath, 'utf8')
    const devFilters = workflow.match(/^\s+- dev$/gm) ?? []

    expect(workflow).toMatch(/jobs:\s+check:/)
    expect(devFilters).toHaveLength(2)
    expect(workflow).toContain('pnpm install --frozen-lockfile')
    expect(workflow).toContain('pnpm run check')
  })

  it('documents fail-closed admission and PR-controlled finish', () => {
    const skill = readFileSync(skillPath, 'utf8')

    expect(skill).toContain('wrong ref, wrong origin, dirty unowned WIP')
    expect(skill).toContain('Do not run `git flow finish`')
    expect(skill).toContain('required `check`')
  })

  describe.skipIf(!hasPinnedNativeGitFlow)('with git-flow-next 2.1.0', () => {
    it('starts and publishes a feature from dev in a disposable repository', () => {
      const { fixtureRoot, remote, work } = createFixture()

      try {
        runGit(work, ['flow', 'feature', 'start', '4-git-flow-fixture', '--no-fetch'])
        expect(runGit(work, ['branch', '--show-current']).trim()).toBe('feature/4-git-flow-fixture')
        runGit(work, ['commit', '--allow-empty', '-m', 'fixture feature'])
        runGit(work, ['flow', 'feature', 'publish', '4-git-flow-fixture'])

        expect(
          runGit(work, ['ls-remote', '--heads', remote, 'refs/heads/feature/4-git-flow-fixture']),
        ).toContain('refs/heads/feature/4-git-flow-fixture')
      } finally {
        rmSync(fixtureRoot, { recursive: true, force: true })
      }
    })

    it('stops before native start when origin, WIP, or ref admission is unsafe', () => {
      const { fixtureRoot, remote, work } = createFixture()

      try {
        const expectedOrigin = 'https://github.com/bemoat/web-starter-v2.git'
        runGit(work, ['remote', 'set-url', 'origin', join(fixtureRoot, 'wrong-origin.git')])
        const actualOrigin = runGit(work, ['remote', 'get-url', 'origin']).trim()
        expect(actualOrigin).not.toBe(expectedOrigin)
        expect(runGit(work, ['branch', '--list', 'feature/4-wrong-origin']).trim()).toBe('')

        runGit(work, ['remote', 'set-url', 'origin', remote])
        writeFileSync(join(work, 'unowned-wip.txt'), 'preserve this WIP\n')
        expect(runGit(work, ['status', '--porcelain'])).toContain('?? unowned-wip.txt')
        expect(runGit(work, ['branch', '--show-current']).trim()).toBe('dev')

        rmSync(join(work, 'unowned-wip.txt'))
        runGit(work, ['flow', 'feature', 'start', '4-git-flow-fixture', '--no-fetch'])
        const currentRef = runGit(work, ['branch', '--show-current']).trim()
        expect(currentRef).toBe('feature/4-git-flow-fixture')
        expect(currentRef).not.toBe('dev')
        expect(runGit(work, ['branch', '--list', 'feature/4-wrong-ref']).trim()).toBe('')
      } finally {
        rmSync(fixtureRoot, { recursive: true, force: true })
      }
    })
  })
})
