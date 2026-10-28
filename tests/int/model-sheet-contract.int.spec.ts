import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(resolve(path), 'utf8')

const parseAgentFrontmatter = (path: string) => {
  const source = read(path)
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)

  if (!match) throw new Error(`${path} is missing YAML frontmatter`)

  const fields: Record<string, string | boolean> = {}

  for (const line of match[1].split(/\r?\n/)) {
    const entry = line.match(/^([a-z][a-z0-9-]*): ([^\r\n]+)$/)

    if (!entry || fields[entry[1]] !== undefined) {
      throw new Error(`${path} has invalid or duplicate frontmatter fields`)
    }

    fields[entry[1]] = entry[2] === 'true' ? true : entry[2] === 'false' ? false : entry[2]
  }

  return { fields, body: source.slice(match[0].length) }
}

const expectedProfiles = {
  Codex: [
    { role: 'controller', model: 'gpt-6-luna', effort: 'xhigh' },
    { role: 'feature, refactoring', model: 'gpt-6-luna', effort: 'medium' },
    { role: 'bug-fix', model: 'gpt-6-luna', effort: 'medium' },
    { role: 'judgment and prose', model: 'gpt-6.1-sol', effort: 'medium' },
    { role: 'strongest judgment', model: 'gpt-6.1-sol', effort: 'high' },
    { role: 'reviewer', model: 'gpt-6.1-sol', effort: 'medium' },
  ],
  Cursor: [
    { role: 'controller', model: 'composer-2.5', effort: 'session' },
    { role: 'feature, refactoring', model: 'composer-2.5', effort: 'session' },
    { role: 'bug-fix', model: 'composer-2.5', effort: 'session' },
    { role: 'judgment and prose', model: 'gpt-5.6-sol', effort: 'session' },
    { role: 'strongest judgment', model: 'gpt-5.6-sol', effort: 'session' },
    { role: 'reviewer', model: 'gpt-5.6-sol', effort: 'session' },
  ],
} as const

type Host = keyof typeof expectedProfiles

const modelIdPattern = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/
const effortPattern = /^(low|medium|high|xhigh|max|session)$/

const validateProfile = (source: string, host: Host) => {
  const heading = `## ${host} preferences`
  const headings = source.match(new RegExp(`^${heading}$`, 'gm')) ?? []

  if (headings.length !== 1) throw new Error(`${host} profile must appear exactly once`)

  const start = source.indexOf(`${heading}\n`) + heading.length
  const nextHeading = source.indexOf('\n## ', start)
  const section = source.slice(start, nextHeading < 0 ? source.length : nextHeading)
  const hookOffCount = section.match(/`session hook: off`/g)?.length ?? 0

  if (hookOffCount !== 1 || /`session hook:\s*(on|enabled|true)`/.test(section)) {
    throw new Error(`${host} profile must keep its session hook off`)
  }
  if (!section.includes('`default effort: session`')) {
    throw new Error(`${host} profile must define the session effort fallback`)
  }

  const rows = [...section.matchAll(/^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|/gm)].map(
    ([, role, model, effort]) => ({ role, model, effort }),
  )
  const expected = expectedProfiles[host]

  if (rows.length !== expected.length) throw new Error(`${host} profile must define six role rows`)
  if (new Set(rows.map(({ role }) => role)).size !== expected.length) {
    throw new Error(`${host} profile roles must be unique`)
  }

  for (const { role, model, effort } of rows) {
    if (!modelIdPattern.test(model)) throw new Error(`${host} profile has invalid model syntax`)
    if (!effortPattern.test(effort)) throw new Error(`${host} profile has invalid effort syntax`)
    if (['feature, refactoring', 'bug-fix', 'reviewer'].includes(role) && model === 'auto') {
      throw new Error(`${host} required roles cannot use auto routing`)
    }
  }

  if (JSON.stringify(rows) !== JSON.stringify(expected)) {
    throw new Error(`${host} profile role rows do not match the approved preference contract`)
  }
}

const validateModelSheet = (source: string) => {
  const profiles = source.match(/^## (Codex|Cursor) preferences$/gm) ?? []

  if (profiles.length !== 2) throw new Error('Model sheet must contain exactly two Host profiles')

  validateProfile(source, 'Codex')
  validateProfile(source, 'Cursor')

  const limitsHeading = '## Shared role limits'
  const limitsStart = source.indexOf(`${limitsHeading}\n`)
  const nextHeading = source.indexOf('\n## ', limitsStart + limitsHeading.length)
  const limits = limitsStart < 0 ? '' : source.slice(
    limitsStart + limitsHeading.length,
    nextHeading < 0 ? source.length : nextHeading,
  )
  const rows = new Map(
    [...limits.matchAll(/^\|\s*(Active Source Writers|Physical checkouts|Default advisory fanout)\s*\|\s*(\d+)\s*\|/gm)].map(
      ([, name, value]) => [name, Number(value)],
    ),
  )

  if (
    rows.get('Active Source Writers') !== 1 ||
    rows.get('Physical checkouts') !== 1 ||
    rows.get('Default advisory fanout') !== 0
  ) {
    throw new Error('Model sheet must keep one Writer, one checkout, and zero implicit fanout')
  }
  if (!limits.includes('No model row creates an agent or grants implicit fanout')) {
    throw new Error('Model sheet must state that role rows do not launch agents')
  }
  if (!source.includes('`auto` is not deterministic routing')) {
    throw new Error('Model sheet must reject auto as deterministic routing')
  }
}

describe('project model sheet contract', () => {
  it('keeps the shared Parent read-only and points to the canonical sheet', () => {
    const agents = read('AGENTS.md')

    expect(agents).toContain('BEGIN:nextjs-agent-rules')
    expect(agents).toContain('END:nextjs-agent-rules')
    expect(agents).toContain('Root Chat is CONTROLLER-ONLY')
    expect(agents).toContain('.agents/pstack-models.md')
    expect(agents).toContain('one physical checkout')
    expect(agents).toContain('NOT_OBSERVABLE')
  })

  it('documents two preference profiles, provenance, and closed routing fallbacks', () => {
    const sheet = read('.agents/pstack-models.md')

    expect(() => validateModelSheet(sheet)).not.toThrow()
    expect(sheet).toContain('feature, refactoring')
    expect(sheet).toContain('gpt-6-luna')
    expect(sheet).toContain('gpt-6.1-sol')
    expect(sheet).toContain('composer-2.5')
    expect(sheet).toContain('gpt-5.6-sol')
    expect(sheet).toContain('REQUESTED')
    expect(sheet).toContain('HOST_ACCEPTED')
    expect(sheet).toContain('RUNTIME_VERIFIED')
    expect(sheet).toContain('NOT_OBSERVABLE')
    expect(sheet).toContain('REQUIRED_WRITER_MODEL_UNAVAILABLE / STOP')
    expect(sheet).toContain('INDEPENDENT_REVIEW_UNAVAILABLE / STOP')
    expect(sheet).toContain('Active Source Writers | 1')
    expect(sheet).toContain('Physical checkouts | 1')
    expect(sheet).toContain('CURSOR_PENDING')
    expect(sheet).toContain('previously Founder-approved work envelope')
    expect(sheet).toContain('exact routing acceptance `PARTIAL`')
    expect(sheet).toContain('HOST_SUBSTITUTION_VIOLATES_WORK_ORDER / STOP')
    expect(sheet).toContain('356c6e0f978df729eb16f227d795f34d221c5aad')
    expect(existsSync(resolve('plugins/pstack/skills/poteto-mode/SKILL.md'))).toBe(true)
    expect(existsSync(resolve('plugins/pstack/skills/poteto-mode/references/codex-tools.md'))).toBe(true)
  })

  it('rejects malformed Host profiles before they can guide a dispatch', () => {
    const sheet = read('.agents/pstack-models.md')
    const codexWriter = '| `feature, refactoring` | `gpt-6-luna` | `medium` |'
    const cursorWriter = '| `feature, refactoring` | `composer-2.5` | `session` |'
    const malformed = [
      sheet.replace('## Codex preferences', '## Codex preferences\n\n## Codex preferences'),
      sheet.replace(cursorWriter, ''),
      sheet.replace(codexWriter, '| `feature, refactoring` | `gpt-6-luna` | `impossible` |'),
      sheet.replace('`session hook: off`', '`session hook: on`'),
      sheet.replace(codexWriter, '| `feature, refactoring` | `auto` | `medium` |'),
    ]

    expect(malformed).toHaveLength(5)
    for (const fixture of malformed) expect(() => validateModelSheet(fixture)).toThrow()
  })

  it('declares exactly one writable Cursor role and two read-only roles', () => {
    const roles = [
      ['.cursor/agents/bemoat-writer.md', 'bemoat-writer', false],
      ['.cursor/agents/bemoat-reviewer.md', 'bemoat-reviewer', true],
      ['.cursor/agents/bemoat-solver.md', 'bemoat-solver', true],
    ] as const

    for (const [path, name, readonly] of roles) {
      expect(existsSync(resolve(path))).toBe(true)
      const { fields, body } = parseAgentFrontmatter(path)

      expect(Object.keys(fields).sort()).toEqual(['description', 'model', 'name', 'readonly'])
      expect(fields).toMatchObject({ name, model: 'inherit', readonly })
      expect(body).toContain('AGENTS.md')
      expect(body).toContain('.agents/pstack-models.md')
    }

    const writer = read('.cursor/agents/bemoat-writer.md')
    const reviewer = read('.cursor/agents/bemoat-reviewer.md')
    const solver = read('.cursor/agents/bemoat-solver.md')

    expect(writer).toContain('Do not create a nested Writer')
    expect(writer).toContain('existing checkout')
    expect(reviewer).toContain('exact final PR HEAD')
    expect(reviewer).toContain('NOT_VERIFIABLE')
    expect(solver).toContain('bounded read-only analysis')
    expect(solver).toContain('Do not edit files')
  })

  it('states that static contracts do not attest live Host routing', () => {
    const sheet = read('.agents/pstack-models.md')

    expect(sheet).toContain('not a router')
    expect(sheet).toContain('does not prove')
    expect(sheet).toContain('do not claim runtime acceptance')
  })
})
