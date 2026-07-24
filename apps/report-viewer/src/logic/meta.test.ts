import { describe, expect, it } from 'vitest';
import {
  extractDate,
  extractSummary,
  extractTitle,
  reportIdFromPath,
  researchPathFromModuleKey,
} from './meta';

describe('researchPathFromModuleKey', () => {
  it('extracts path after /research/', () => {
    expect(
      researchPathFromModuleKey('/workspace/research/2026-07-23-foo.md'),
    ).toBe('2026-07-23-foo.md');
  });

  it('returns null when marker missing', () => {
    expect(researchPathFromModuleKey('/workspace/knowledge/foo.md')).toBeNull();
  });
});

describe('extractTitle', () => {
  it('uses first ATX heading', () => {
    expect(extractTitle('# Hello\n\nbody', 'x')).toBe('Hello');
  });

  it('falls back to id leaf', () => {
    expect(extractTitle('no heading', 'my-report')).toBe('my report');
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
    expect(extractDate('', '2026-07-18-note.md')).toBe('2026-07-18');
  });
});

describe('reportIdFromPath', () => {
  it('strips .md', () => {
    expect(reportIdFromPath('2026-07-23-a.md')).toBe('2026-07-23-a');
  });
});
