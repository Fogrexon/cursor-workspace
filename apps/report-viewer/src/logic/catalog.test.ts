import { describe, expect, it } from 'vitest';
import { buildCatalog, filterReports, findReport } from './catalog';

const modules = {
  '/workspace/knowledge/research/2026-07-23-demo.md': `# Demo Report

| 調査日 | 2026-07-23 |

本文の要約になります。
`,
  '/workspace/knowledge/domain/constraints.md': `# Constraints

制約の説明です。
`,
};

describe('buildCatalog', () => {
  it('builds sorted metas from module map', () => {
    const docs = buildCatalog(modules);
    expect(docs).toHaveLength(2);
    expect(docs[0]!.id).toBe('research/2026-07-23-demo');
    expect(docs[0]!.category).toBe('research');
    expect(docs[0]!.date).toBe('2026-07-23');
    expect(docs[1]!.id).toBe('domain/constraints');
  });
});

describe('filterReports', () => {
  const docs = buildCatalog(modules);

  it('filters by category and query', () => {
    expect(filterReports(docs, '', 'research')).toHaveLength(1);
    expect(filterReports(docs, '制約', 'all')).toHaveLength(1);
    expect(filterReports(docs, 'missing', 'all')).toHaveLength(0);
  });
});

describe('findReport', () => {
  it('finds by id', () => {
    const docs = buildCatalog(modules);
    expect(findReport(docs, 'domain/constraints')?.title).toBe('Constraints');
    expect(findReport(docs, 'nope')).toBeUndefined();
  });
});
