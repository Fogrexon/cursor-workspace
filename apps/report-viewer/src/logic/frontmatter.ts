export type ReportFrontmatter = {
  title?: string;
  summary?: string;
  date?: string;
  category?: string;
  tags?: string[];
  status?: string;
  audience?: string;
  lang?: string;
};

export type SplitMarkdown = {
  meta: ReportFrontmatter;
  body: string;
  /** frontmatter ブロックが存在したか */
  hasFrontmatter: boolean;
};

/**
 * Markdown 先頭の YAML frontmatter を分離する。
 * 厳密な YAML パーサは使わず、レポート用の単純キーのみ解釈する。
 */
export function splitFrontmatter(markdown: string): SplitMarkdown {
  const normalized = markdown.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---\n') && !normalized.startsWith('---\r\n')) {
    return { meta: {}, body: markdown, hasFrontmatter: false };
  }

  const end = normalized.indexOf('\n---', 4);
  if (end === -1) {
    return { meta: {}, body: markdown, hasFrontmatter: false };
  }

  const raw = normalized.slice(4, end).replace(/^\r/, '');
  // `\n---` の直後から本文。先頭の空行は落として見出し検出を安定させる。
  const body = normalized.slice(end + 4).replace(/^(?:\r?\n)+/, '');

  return {
    meta: parseSimpleYaml(raw),
    body,
    hasFrontmatter: true,
  };
}

function parseSimpleYaml(raw: string): ReportFrontmatter {
  const meta: ReportFrontmatter = {};
  const lines = raw.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim() || line.trimStart().startsWith('#')) {
      i += 1;
      continue;
    }

    const m = /^([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!m) {
      i += 1;
      continue;
    }
    const key = m[1]!;
    const value = m[2]!.trim();

    if (key === 'tags') {
      if (value === '' || value === '|' || value === '>') {
        const tags: string[] = [];
        i += 1;
        while (i < lines.length) {
          const item = /^\s*-\s+(.+)$/.exec(lines[i]!);
          if (!item) break;
          tags.push(unwrap(item[1]!.trim()));
          i += 1;
        }
        meta.tags = tags;
        continue;
      }
      if (value.startsWith('[') && value.endsWith(']')) {
        meta.tags = value
          .slice(1, -1)
          .split(',')
          .map((s) => unwrap(s.trim()))
          .filter(Boolean);
        i += 1;
        continue;
      }
    }

    const scalar = unwrap(value);
    if (key === 'title') meta.title = scalar;
    else if (key === 'summary') meta.summary = scalar;
    else if (key === 'date') meta.date = scalar;
    else if (key === 'category') meta.category = scalar;
    else if (key === 'status') meta.status = scalar;
    else if (key === 'audience') meta.audience = scalar;
    else if (key === 'lang') meta.lang = scalar;

    i += 1;
  }

  return meta;
}

function unwrap(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
