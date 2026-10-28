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
    const profiles = sheet.match(/^## (Codex|Cursor) preferences$/gm) ?? []

    expect(profiles).toHaveLength(2)
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
    expect(sheet).toContain('356c6e0f978df729eb16f227d795f34d221c5aad')
    expect(existsSync(resolve('plugins/pstack/skills/poteto-mode/SKILL.md'))).toBe(true)
    expect(existsSync(resolve('plugins/pstack/skills/poteto-mode/references/codex-tools.md'))).toBe(true)
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
