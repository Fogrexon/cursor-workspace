import { describe, expect, it } from 'vitest';
import { estimateTextWidth, isWideChar } from './textMeasure.ts';

describe('textMeasure', () => {
  it('CJK は幅広として計測', () => {
    expect(isWideChar('豚')).toBe(true);
    expect(estimateTextWidth('プレイ', 20)).toBeGreaterThan(estimateTextWidth('PLAY', 20));
  });

  it('日本語文の幅が length 比例より大きい', () => {
    const ja = estimateTextWidth('引っ張って離せ！', 18);
    const ascii = estimateTextWidth('Pull & Release!', 18);
    expect(ja).toBeGreaterThan(ascii * 0.8);
  });
});
