import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { assertGitFlowAdmission } from '../../.agents/skills/git-delivery/scripts/admission'

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

const createFixture = (initializeGitFlow: boolean) => {
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
  if (initializeGitFlow) {
    runGit(work, [
      'flow',
      'init',
      '--local',
      '--main=main',
      '--develop=dev',
      '--no-create-branches',
      '-d',
    ])
  }

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

  it('rejects unsafe admission before invoking native Git Flow', () => {
    const { fixtureRoot, work } = createFixture(false)

    try {
      runGit(work, ['remote', 'set-url', 'origin', join(fixtureRoot, 'wrong-origin.git')])
      expect(() => assertGitFlowAdmission('start', work)).toThrow('origin is not canonical')

      runGit(work, ['remote', 'set-url', 'origin', 'https://github.com/bemoat/web-starter-v2.git'])
      runGit(work, ['config', 'remote.origin.pushurl', join(fixtureRoot, 'wrong-push-origin.git')])
      expect(() => assertGitFlowAdmission('start', work)).toThrow(
        'origin push URL is not canonical',
      )

      runGit(work, ['config', '--unset-all', 'remote.origin.pushurl'])
      runGit(work, [
        'config',
        '--add',
        'remote.origin.pushurl',
        'https://github.com/bemoat/web-starter-v2.git',
      ])
      runGit(work, [
        'config',
        '--add',
        'remote.origin.pushurl',
        join(fixtureRoot, 'second-wrong-push-origin.git'),
      ])
      expect(() => assertGitFlowAdmission('start', work)).toThrow(
        'origin push URL is not canonical',
      )

      runGit(work, ['config', '--unset-all', 'remote.origin.pushurl'])
      writeFileSync(join(work, 'unowned-wip.txt'), 'preserve this WIP\n')
      expect(() => assertGitFlowAdmission('start', work)).toThrow(
        'tracked or unowned WIP is present',
      )

      rmSync(join(work, 'unowned-wip.txt'))
      writeFileSync(join(work, '.git', 'info', 'exclude'), 'ignored-wip.txt\n', { flag: 'a' })
      writeFileSync(join(work, 'ignored-wip.txt'), 'preserve this ignored WIP\n')
      expect(() => assertGitFlowAdmission('start', work)).toThrow(
        'tracked or unowned WIP is present',
      )

      rmSync(join(work, 'ignored-wip.txt'))
      runGit(work, ['switch', '-c', 'feature/4-git-flow-fixture'])
      expect(() => assertGitFlowAdmission('start', work)).toThrow('feature start requires dev')
      expect(() => assertGitFlowAdmission('publish', work)).not.toThrow()
      runGit(work, ['switch', 'dev'])
      expect(() => assertGitFlowAdmission('publish', work)).toThrow(
        'feature publish requires a feature branch',
      )

      mkdirSync(join(work, 'nested'))
      expect(() => assertGitFlowAdmission('start', join(work, 'nested'))).toThrow(
        'cwd is not the repository root',
      )
      expect(runGit(work, ['branch', '--list', 'feature/4-wrong-ref']).trim()).toBe('')
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true })
    }
  })

  describe.skipIf(!hasPinnedNativeGitFlow)('with git-flow-next 2.1.0', () => {
    it('starts and publishes a feature from dev in a disposable repository', () => {
      const { fixtureRoot, remote, work } = createFixture(true)

      try {
        runGit(work, [
          'remote',
          'set-url',
          'origin',
          'https://github.com/bemoat/web-starter-v2.git',
        ])
        runGit(work, [
          'config',
          `url.${remote}.insteadOf`,
          'https://github.com/bemoat/web-starter-v2.git',
        ])
        expect(() => assertGitFlowAdmission('start', work)).not.toThrow()
        runGit(work, ['flow', 'feature', 'start', '4-git-flow-fixture', '--no-fetch'])
        expect(runGit(work, ['branch', '--show-current']).trim()).toBe('feature/4-git-flow-fixture')
        expect(() => assertGitFlowAdmission('publish', work)).not.toThrow()
        runGit(work, ['commit', '--allow-empty', '-m', 'fixture feature'])
        runGit(work, ['flow', 'feature', 'publish', '4-git-flow-fixture'])

        expect(
          runGit(work, ['ls-remote', '--heads', remote, 'refs/heads/feature/4-git-flow-fixture']),
        ).toContain('refs/heads/feature/4-git-flow-fixture')
      } finally {
        rmSync(fixtureRoot, { recursive: true, force: true })
      }
    })
  })
})
