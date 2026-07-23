import { describe, expect, it } from 'vitest';
import {
  categoryFromPath,
  extractDate,
  extractSummary,
  extractTitle,
  knowledgePathFromModuleKey,
  reportIdFromPath,
} from './meta';

describe('knowledgePathFromModuleKey', () => {
  it('extracts path after /knowledge/', () => {
    expect(
      knowledgePathFromModuleKey(
        '/workspace/knowledge/research/foo.md',
      ),
    ).toBe('research/foo.md');
  });

  it('returns null when marker missing', () => {
    expect(knowledgePathFromModuleKey('/tmp/foo.md')).toBeNull();
  });
});

describe('categoryFromPath', () => {
  it('maps known segments', () => {
    expect(categoryFromPath('research/a.md')).toBe('research');
    expect(categoryFromPath('incidents/inbox/x.md')).toBe('incidents');
  });

  it('falls back to other', () => {
    expect(categoryFromPath('misc/a.md')).toBe('other');
  });
});

describe('extractTitle', () => {
  it('uses first ATX heading', () => {
    expect(extractTitle('# Hello\n\nbody', 'x')).toBe('Hello');
  });

  it('falls back to id leaf', () => {
    expect(extractTitle('no heading', 'research/my-report')).toBe('my report');
  });
});

describe('extractSummary', () => {
  it('skips headings and tables then takes paragraph', () => {
    const md = `# Title

| a | b |
|---|---|
| 1 | 2 |

これは要約になる段落です。

次の段落は使わない。
`;
    expect(extractSummary(md)).toContain('これは要約になる段落です');
  });

  it('returns empty for heading-only docs', () => {
    expect(extractSummary('# Only')).toBe('');
  });
});

describe('extractDate', () => {
  it('reads 調査日 table cell', () => {
    const md = '| 調査日 | 2026-07-23 |';
    expect(extractDate(md, 'x.md')).toBe('2026-07-23');
  });

  it('falls back to path date', () => {
    expect(extractDate('', 'research/2026-07-18-note.md')).toBe('2026-07-18');
  });
});

describe('reportIdFromPath', () => {
  it('strips .md', () => {
    expect(reportIdFromPath('research/a.md')).toBe('research/a');
  });
});
