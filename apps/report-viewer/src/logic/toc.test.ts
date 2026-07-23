import { describe, expect, it } from 'vitest';
import { extractToc } from './toc';

describe('extractToc', () => {
  it('collects h1–h3 with stable ids', () => {
    const md = `# A

## B

### C

#### Skip

## B
`;
    expect(extractToc(md)).toEqual([
      { id: 'a', text: 'A', level: 1 },
      { id: 'b', text: 'B', level: 2 },
      { id: 'c', text: 'C', level: 3 },
      { id: 'b-2', text: 'B', level: 2 },
    ]);
  });

  it('ignores headings inside fenced code', () => {
    const md = '```md\n# Not a heading\n```\n\n# Real\n';
    expect(extractToc(md)).toEqual([{ id: 'real', text: 'Real', level: 1 }]);
  });
});
