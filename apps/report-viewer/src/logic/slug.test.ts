import { describe, expect, it } from 'vitest';
import { slugifyHeading } from './slug';

describe('slugifyHeading', () => {
  it('slugifies latin and japanese headings', () => {
    const used = new Map<string, number>();
    expect(slugifyHeading('Hello World', used)).toBe('hello-world');
    expect(slugifyHeading('実行基盤とは', used)).toBe('実行基盤とは');
  });

  it('deduplicates repeated slugs', () => {
    const used = new Map<string, number>();
    expect(slugifyHeading('Overview', used)).toBe('overview');
    expect(slugifyHeading('Overview', used)).toBe('overview-2');
  });

  it('falls back when text has no usable characters', () => {
    const used = new Map<string, number>();
    expect(slugifyHeading('!!!', used)).toBe('section');
  });
});
