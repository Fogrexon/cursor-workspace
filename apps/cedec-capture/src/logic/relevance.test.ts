import { describe, expect, it } from 'vitest';
import { playgroundRelevance } from './relevance';
import { businessSession, sampleSession } from './fixtures';

describe('playgroundRelevance', () => {
  it('scores graphics talks highly', () => {
    const { score, reasons } = playgroundRelevance(sampleSession);
    expect(score).toBeGreaterThanOrEqual(6);
    expect(reasons).toContain('レンダリング');
    expect(reasons).toContain('ニューラル');
  });

  it('keeps unrelated business talks near zero', () => {
    const { score } = playgroundRelevance(businessSession);
    expect(score).toBeLessThan(3);
  });
});
