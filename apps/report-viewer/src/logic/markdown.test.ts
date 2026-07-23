import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
  it('renders headings with ids and gfm tables', () => {
    const html = renderMarkdown('# Title\n\n| a | b |\n|---|---|\n| 1 | 2 |\n');
    expect(html).toContain('id="title"');
    expect(html).toContain('<table>');
    expect(html).toContain('<td>1</td>');
  });

  it('strips script tags', () => {
    const html = renderMarkdown('Hello<script>alert(1)</script>');
    expect(html).not.toContain('<script');
    expect(html).toContain('Hello');
  });
});
