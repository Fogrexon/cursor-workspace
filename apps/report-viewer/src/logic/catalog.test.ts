import { describe, expect, it } from 'vitest';
import { buildCatalog, filterReports, findReport } from './catalog';

const modules = {
  '/workspace/research/2026-07-23-demo.md': `# Demo Report

| 調査日 | 2026-07-23 |

本文の要約になります。
`,
  '/workspace/research/README.md': `# Research

案内です。
`,
  '/workspace/knowledge/domain/constraints.md': `# Constraints

制約の説明です。
`,
};

describe('buildCatalog', () => {
  it('builds only research reports and skips README / knowledge', () => {
    const docs = buildCatalog(modules);
    expect(docs).toHaveLength(1);
    expect(docs[0]!.id).toBe('2026-07-23-demo');
    expect(docs[0]!.path).toBe('2026-07-23-demo.md');
    expect(docs[0]!.date).toBe('2026-07-23');
  });
});

describe('filterReports', () => {
  const docs = buildCatalog(modules);

  it('filters by query', () => {
    expect(filterReports(docs, '')).toHaveLength(1);
    expect(filterReports(docs, 'Demo')).toHaveLength(1);
    expect(filterReports(docs, 'missing')).toHaveLength(0);
  });
});

describe('findReport', () => {
  it('finds by id', () => {
    const docs = buildCatalog(modules);
    expect(findReport(docs, '2026-07-23-demo')?.title).toBe('Demo Report');
    expect(findReport(docs, 'nope')).toBeUndefined();
  });
});
