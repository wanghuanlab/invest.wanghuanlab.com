function parseScalar(value: string): unknown {
  const v = value.trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1)
  }
  return v
}

function parseSimpleYaml(block: string): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  const lines = block.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith('#')) {
      i += 1
      continue
    }
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) {
      i += 1
      continue
    }
    const key = match[1]
    const rest = match[2]
    if (rest === '' || rest === '|' || rest === '>') {
      const items: string[] = []
      i += 1
      while (i < lines.length) {
        const item = lines[i].match(/^\s+-\s+(.*)$/)
        if (!item) break
        items.push(String(parseScalar(item[1])))
        i += 1
      }
      data[key] = items
      continue
    }
    data[key] = parseScalar(rest)
    i += 1
  }
  return data
}

export function parseFrontmatter(raw: string): {
  data: Record<string, unknown>
  content: string
} {
  const normalized = raw.replace(/^\uFEFF/, '')
  if (!normalized.startsWith('---')) {
    return { data: {}, content: normalized }
  }
  const end = normalized.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: normalized }
  }
  const block = normalized.slice(4, end).replace(/^\r?\n/, '')
  const content = normalized.slice(end + 4).replace(/^\r?\n/, '')
  return { data: parseSimpleYaml(block), content }
}
