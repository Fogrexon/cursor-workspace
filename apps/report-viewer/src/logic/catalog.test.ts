import { describe, expect, it } from 'vitest';
import {
  buildCatalog,
  filterReports,
  findReport,
  listCategories,
} from './catalog';

const modules = {
  '/workspace/reports/deep-research/2026-07-23-demo.md': `---
title: Demo Report
summary: Front summary about harness
date: 2026-07-23
category: deep-research
tags:
  - harness
  - llm
status: final
audience: architects
---

# Ignored Title

Body text.
`,
  '/workspace/reports/README.md': `# Reports\n\nIgnore me.\n`,
  '/workspace/reports/notes/older.md': `---
title: Older
summary: Old note
date: 2026-01-01
category: notes
tags: [ops]
---

# Older
`,
  '/workspace/knowledge/domain/constraints.md': `# Should not load\n`,
};

describe('buildCatalog', () => {
  it('loads only viewable files under /reports/', () => {
    const docs = buildCatalog(modules);
    expect(docs.map((d) => d.id)).toEqual([
      'deep-research/2026-07-23-demo',
      'notes/older',
    ]);
    expect(docs[0]).toMatchObject({
      title: 'Demo Report',
      summary: 'Front summary about harness',
      category: 'deep-research',
      tags: ['harness', 'llm'],
      status: 'final',
      audience: 'architects',
    });
    expect(docs[0]!.markdown.startsWith('# Ignored Title')).toBe(true);
  });
});

describe('filterReports / listCategories', () => {
  const docs = buildCatalog(modules);

  it('filters by category, free text, and tag:', () => {
    expect(filterReports(docs, '', 'deep-research')).toHaveLength(1);
    expect(filterReports(docs, 'harness', 'all')).toHaveLength(1);
    expect(filterReports(docs, 'tag:ops', 'all')).toHaveLength(1);
    expect(filterReports(docs, 'tag:missing', 'all')).toHaveLength(0);
  });

  it('lists categories', () => {
    expect(listCategories(docs)).toEqual(['deep-research', 'notes']);
  });
});

describe('findReport', () => {
  it('finds by id', () => {
    const docs = buildCatalog(modules);
    expect(findReport(docs, 'notes/older')?.title).toBe('Older');
  });
});
