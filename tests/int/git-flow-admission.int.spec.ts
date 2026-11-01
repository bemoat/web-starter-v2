import { execFileSync } from 'node:child_process'
import {
  chmodSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { assertGitFlowAdmission } from '../../.agents/skills/git-delivery/scripts/admission'

const skillPath = resolve('.agents/skills/git-delivery/SKILL.md')
const workflowPath = resolve('.github/workflows/ci.yml')

const nativeGitFlowPath = process.env.GIT_FLOW_BIN?.trim()
const nativeGitFlowVersion = nativeGitFlowPath
  ? execFileSync(nativeGitFlowPath, ['version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  : ''

const runGit = (cwd: string, args: string[]) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

const runGitFlow = (cwd: string, args: string[]) => {
  if (!nativeGitFlowPath) throw new Error('GIT_FLOW_BIN must point to the pinned git-flow-next binary')
  return execFileSync(nativeGitFlowPath, args, {
    cwd,
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

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
  writeFileSync(join(seed, 'tracked.txt'), 'fixture tracked content\n')
  runGit(seed, ['add', 'tracked.txt'])
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
    runGitFlow(work, [
      'init',
      '--local',
      '--main=main',
      '--develop=dev',
      '--no-create-branches',
      '--defaults',
    ])
  }

  return { fixtureRoot, remote, work }
}

const hasPinnedNativeGitFlow = nativeGitFlowVersion.trim() === '2.1.0 (git-flow-next)'

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
    expect(skill).toContain('Do not run a Git Flow finish command')
    expect(skill).toContain('required `check`')
    expect(skill).toContain('GIT_FLOW_BIN')
    expect(skill).toContain('release/*')
    expect(skill).toContain('hotfix/*')
    expect(skill).toContain('ordinary non-force push')
  })

  it('makes native CLI execution or its skip reason visible', () => {
    if (nativeGitFlowPath) {
      expect(nativeGitFlowVersion.trim()).toBe('2.1.0 (git-flow-next)')
    } else {
      expect(nativeGitFlowVersion).toBe('')
    }
  })

  it('rejects unsafe admission before invoking native Git Flow', () => {
    const { fixtureRoot, work } = createFixture(false)

    try {
      runGit(work, ['remote', 'set-url', 'origin', join(fixtureRoot, 'wrong-origin.git')])
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow('origin is not canonical')

      runGit(work, ['remote', 'set-url', 'origin', 'https://github.com/bemoat/web-starter-v2.git'])
      runGit(work, ['config', 'remote.origin.pushurl', join(fixtureRoot, 'wrong-push-origin.git')])
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
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
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'origin push URL is not canonical',
      )

      runGit(work, ['config', '--unset-all', 'remote.origin.pushurl'])
      writeFileSync(join(work, '.git', 'info', 'exclude'), '.next/\n.open-next/\n.wrangler/\n', {
        flag: 'a',
      })
      mkdirSync(join(work, '.next'))
      mkdirSync(join(work, '.open-next'))
      mkdirSync(join(work, '.wrangler'))
      writeFileSync(join(work, '.next', 'generated.txt'), 'preserved generated WIP\n')
      writeFileSync(join(work, '.open-next', 'generated.txt'), 'preserved generated WIP\n')
      writeFileSync(join(work, '.wrangler', 'generated.txt'), 'preserved generated WIP\n')
      expect(() => assertGitFlowAdmission('start', 'feature', work)).not.toThrow()

      writeFileSync(join(work, 'tracked.txt'), 'modified tracked content\n')
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'tracked or unowned WIP is present',
      )
      writeFileSync(join(work, 'tracked.txt'), 'fixture tracked content\n')

      writeFileSync(join(work, 'unowned-wip.txt'), 'preserve this WIP\n')
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'tracked or unowned WIP is present',
      )

      rmSync(join(work, 'unowned-wip.txt'))
      writeFileSync(join(work, '.git', 'info', 'exclude'), 'ignored-wip.txt\n', { flag: 'a' })
      writeFileSync(join(work, 'ignored-wip.txt'), 'preserve this ignored WIP\n')
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'tracked or unowned WIP is present',
      )

      rmSync(join(work, 'ignored-wip.txt'))
      runGit(work, ['switch', '-c', 'feature/4-git-flow-fixture'])
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow('feature start requires dev')
      expect(() => assertGitFlowAdmission('start', 'release', work)).toThrow('release start requires dev')
      expect(() => assertGitFlowAdmission('start', 'hotfix', work)).toThrow('hotfix start requires main')
      expect(() => assertGitFlowAdmission('publish', 'feature', work)).not.toThrow()
      expect(() => assertGitFlowAdmission('publish', 'release', work)).toThrow(
        'release publish requires a release branch',
      )
      runGit(work, ['config', 'branch.feature/4-git-flow-fixture.remote', 'other'])
      runGit(work, [
        'config',
        'branch.feature/4-git-flow-fixture.merge',
        'refs/heads/feature/4-git-flow-fixture',
      ])
      expect(() => assertGitFlowAdmission('publish', 'feature', work)).toThrow(
        'publish upstream must be origin/feature/4-git-flow-fixture',
      )
      runGit(work, ['config', '--unset-all', 'branch.feature/4-git-flow-fixture.remote'])
      runGit(work, ['config', '--unset-all', 'branch.feature/4-git-flow-fixture.merge'])
      expect(() => assertGitFlowAdmission('publish', 'feature', work)).not.toThrow()
      runGit(work, ['switch', 'dev'])
      expect(() => assertGitFlowAdmission('start', 'release', work)).not.toThrow()
      expect(() => assertGitFlowAdmission('start', 'hotfix', work)).toThrow('hotfix start requires main')
      expect(() => assertGitFlowAdmission('publish', 'feature', work)).toThrow(
        'feature publish requires a feature branch',
      )
      runGit(work, ['switch', 'main'])
      expect(() => assertGitFlowAdmission('start', 'hotfix', work)).not.toThrow()
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow('feature start requires dev')
      expect(() => assertGitFlowAdmission('start', 'release', work)).toThrow('release start requires dev')
      runGit(work, ['switch', 'dev'])

      writeFileSync(join(work, '.git', 'refs', 'heads', 'dev.lock'), '')
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow('Git lock files are present')
      rmSync(join(work, '.git', 'refs', 'heads', 'dev.lock'))

      const otherWorktree = join(fixtureRoot, 'other-worktree')
      runGit(work, ['worktree', 'add', '--detach', otherWorktree, 'main'])
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'exactly one canonical worktree is required',
      )
      runGit(work, ['worktree', 'remove', otherWorktree])

      mkdirSync(join(work, 'nested'))
      expect(() => assertGitFlowAdmission('start', 'feature', join(work, 'nested'))).toThrow(
        'cwd is not the repository root',
      )
      symlinkSync(work, join(fixtureRoot, 'repository-link'), 'dir')
      expect(() =>
        assertGitFlowAdmission('start', 'feature', join(fixtureRoot, 'repository-link')),
      ).not.toThrow()
      symlinkSync(join(work, 'nested'), join(fixtureRoot, 'nested-link'), 'dir')
      expect(() => assertGitFlowAdmission('start', 'feature', join(fixtureRoot, 'nested-link'))).toThrow(
        'cwd is not the repository root',
      )
      expect(runGit(work, ['branch', '--list', 'feature/4-wrong-ref']).trim()).toBe('')
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true })
    }
  })

  it('admits a safe exact root .env by metadata without a Founder flag', () => {
    const { fixtureRoot, work } = createFixture(false)

    try {
      runGit(work, ['remote', 'set-url', 'origin', 'https://github.com/bemoat/web-starter-v2.git'])
      writeFileSync(join(work, '.git', 'info', 'exclude'), '\n.env\n.env.*\n', { flag: 'a' })
      writeFileSync(join(work, '.env'), 'synthetic fixture value\n', { mode: 0o600 })

      expect(() => assertGitFlowAdmission('start', 'feature', work)).not.toThrow()
      runGit(work, ['switch', '-c', 'feature/git-flow-env-fixture'])
      expect(() => assertGitFlowAdmission('publish', 'feature', work)).not.toThrow()
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true })
    }
  })

  it('rejects unsafe root .env metadata and env variants', () => {
    const { fixtureRoot, work } = createFixture(false)

    try {
      runGit(work, ['remote', 'set-url', 'origin', 'https://github.com/bemoat/web-starter-v2.git'])
      writeFileSync(join(work, '.git', 'info', 'exclude'), '\n.env\n.env.*\n', { flag: 'a' })
      writeFileSync(join(work, '.env'), 'synthetic fixture value\n', { mode: 0o600 })
      expect(() => assertGitFlowAdmission('start', 'feature', work)).not.toThrow()

      chmodSync(join(work, '.env'), 0o666)
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'tracked or unowned WIP is present',
      )
      chmodSync(join(work, '.env'), 0o600)

      const hardLink = join(fixtureRoot, 'env-hard-link')
      linkSync(join(work, '.env'), hardLink)
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'tracked or unowned WIP is present',
      )
      rmSync(hardLink)

      rmSync(join(work, '.env'))
      const symlinkTarget = join(fixtureRoot, 'env-symlink-target')
      writeFileSync(symlinkTarget, 'synthetic fixture value\n', { mode: 0o600 })
      symlinkSync(symlinkTarget, join(work, '.env'))
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'tracked or unowned WIP is present',
      )

      rmSync(join(work, '.env'))
      writeFileSync(join(work, '.env.local'), 'synthetic fixture value\n', { mode: 0o600 })
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'tracked or unowned WIP is present',
      )

      rmSync(join(work, '.env.local'))
      mkdirSync(join(work, '.env'))
      writeFileSync(join(work, '.env', 'nested.local'), 'synthetic path fixture\n')
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'tracked or unowned WIP is present',
      )
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true })
    }
  })

  it('requires a protected base upstream and an exact local remote-tracking ref', () => {
    const { fixtureRoot, work } = createFixture(false)

    try {
      runGit(work, ['remote', 'set-url', 'origin', 'https://github.com/bemoat/web-starter-v2.git'])
      expect(() => assertGitFlowAdmission('start', 'release', work)).not.toThrow()

      runGit(work, ['config', 'branch.dev.remote', 'other'])
      expect(() => assertGitFlowAdmission('start', 'release', work)).toThrow(
        'release start requires origin/dev upstream',
      )
      runGit(work, ['config', 'branch.dev.remote', 'origin'])

      runGit(work, ['commit', '--allow-empty', '-m', 'fixture local dev ahead'])
      expect(() => assertGitFlowAdmission('start', 'feature', work)).toThrow(
        'feature start requires local dev to match origin/dev',
      )
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true })
    }
  })

  describe.skipIf(!hasPinnedNativeGitFlow)(
    hasPinnedNativeGitFlow
      ? 'with git-flow-next 2.1.0'
      : 'SKIPPED native CLI fixtures: set GIT_FLOW_BIN to pinned git-flow-next 2.1.0',
    () => {
      const startAndPublish = (kind: 'feature' | 'release' | 'hotfix', base: 'dev' | 'main') => {
        const { fixtureRoot, remote, work } = createFixture(true)

        try {
          runGit(work, ['remote', 'set-url', 'origin', 'https://github.com/bemoat/web-starter-v2.git'])
          runGit(work, [
            'config',
            `url.${remote}.insteadOf`,
            'https://github.com/bemoat/web-starter-v2.git',
          ])
          if (base === 'main') runGit(work, ['switch', 'main'])
          const baseSha = runGit(work, ['rev-parse', base]).trim()

          expect(() => assertGitFlowAdmission('start', kind, work)).not.toThrow()
          runGitFlow(work, [kind, 'start', '4-git-flow-fixture', '--no-fetch', '--no-worktree'])
          const branch = `${kind}/4-git-flow-fixture`
          expect(runGit(work, ['branch', '--show-current']).trim()).toBe(branch)
          expect(runGit(work, ['rev-parse', 'HEAD']).trim()).toBe(baseSha)
          runGit(work, ['commit', '--allow-empty', '-m', `fixture ${kind}`])
          expect(() => assertGitFlowAdmission('publish', kind, work)).not.toThrow()
          runGitFlow(work, [kind, 'publish'])

          expect(runGit(work, ['ls-remote', '--heads', remote, `refs/heads/${branch}`])).toContain(
            `refs/heads/${branch}`,
          )
          expect(runGit(work, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']).trim()).toBe(
            `origin/${branch}`,
          )
        } finally {
          rmSync(fixtureRoot, { recursive: true, force: true })
        }
      }

      it('starts and publishes feature from dev in a disposable repository', () => {
        startAndPublish('feature', 'dev')
      })

      it('starts and publishes release from dev in a disposable repository', () => {
        startAndPublish('release', 'dev')
      })

      it('starts and publishes hotfix from main in a disposable repository', () => {
        startAndPublish('hotfix', 'main')
      })
    },
  )
})
