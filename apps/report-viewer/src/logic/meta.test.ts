import { describe, expect, it } from 'vitest';
import {
  categoryFromPath,
  extractDate,
  extractSummary,
  extractTitle,
  isViewableReportPath,
  reportIdFromPath,
  reportsPathFromModuleKey,
} from './meta';

describe('reportsPathFromModuleKey', () => {
  it('extracts path after /reports/', () => {
    expect(
      reportsPathFromModuleKey(
        '/workspace/reports/deep-research/foo.md',
      ),
    ).toBe('deep-research/foo.md');
  });

  it('returns null when marker missing', () => {
    expect(reportsPathFromModuleKey('/workspace/knowledge/x.md')).toBeNull();
  });
});

describe('isViewableReportPath', () => {
  it('accepts report markdown and rejects README', () => {
    expect(isViewableReportPath('deep-research/a.md')).toBe(true);
    expect(isViewableReportPath('README.md')).toBe(false);
    expect(isViewableReportPath('deep-research/readme.md')).toBe(false);
  });
});

describe('categoryFromPath', () => {
  it('uses first path segment', () => {
    expect(categoryFromPath('deep-research/a.md')).toBe('deep-research');
  });
});

describe('extractTitle / extractSummary / extractDate', () => {
  const md = `---
title: Front Title
summary: Front summary
date: 2026-01-02
---

# Body Title

| 調査日 | 2026-07-23 |

Body summary paragraph.
`;

  it('prefers heading in body for title fallback helper', () => {
    expect(extractTitle('# Only\n', 'x/y')).toBe('Only');
    expect(extractTitle('no heading', 'deep-research/my-report')).toBe(
      'my report',
    );
  });

  it('skips frontmatter when extracting summary from body', () => {
    expect(extractSummary(md)).toContain('Body summary paragraph');
  });

  it('prefers frontmatter date', () => {
    expect(extractDate(md, 'deep-research/x.md')).toBe('2026-01-02');
  });

  it('falls back to path date', () => {
    expect(extractDate('# Hi\n', 'deep-research/2026-07-18-note.md')).toBe(
      '2026-07-18',
    );
  });
});

describe('reportIdFromPath', () => {
  it('strips .md', () => {
    expect(reportIdFromPath('deep-research/a.md')).toBe('deep-research/a');
  });
});
