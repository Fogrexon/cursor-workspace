import { describe, expect, it } from 'vitest';
import { splitFrontmatter } from './frontmatter';

describe('splitFrontmatter', () => {
  it('parses required report fields and body', () => {
    const md = `---
title: Demo
summary: One line
date: 2026-07-23
category: deep-research
tags:
  - llm
  - agent
status: final
audience: builders
---

# Demo

Body paragraph.
`;
    const { meta, body, hasFrontmatter } = splitFrontmatter(md);
    expect(hasFrontmatter).toBe(true);
    expect(meta).toMatchObject({
      title: 'Demo',
      summary: 'One line',
      date: '2026-07-23',
      category: 'deep-research',
      status: 'final',
      audience: 'builders',
    });
    expect(meta.tags).toEqual(['llm', 'agent']);
    expect(body.startsWith('# Demo')).toBe(true);
  });

  it('supports inline tag arrays', () => {
    const md = `---
title: X
tags: [a, b]
---

body
`;
    expect(splitFrontmatter(md).meta.tags).toEqual(['a', 'b']);
  });

  it('returns original markdown when frontmatter missing', () => {
    const md = '# No meta\n';
    const split = splitFrontmatter(md);
    expect(split.hasFrontmatter).toBe(false);
    expect(split.body).toBe(md);
  });
});
