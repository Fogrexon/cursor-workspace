import { describe, expect, it } from 'vitest';
import { convert, roundForDisplay } from './convert';

describe('convert', () => {
  it('同一単位はそのまま返す', () => {
    expect(convert(25, 'c', 'c')).toBe(25);
  });

  it('摂氏から華氏へ変換する', () => {
    expect(convert(100, 'c', 'f')).toBeCloseTo(212);
    expect(convert(0, 'c', 'f')).toBeCloseTo(32);
  });

  it('華氏から摂氏へ変換する', () => {
    expect(convert(32, 'f', 'c')).toBeCloseTo(0);
  });

  it('摂氏からケルビンへ変換する', () => {
    expect(convert(0, 'c', 'k')).toBeCloseTo(273.15);
  });

  it('境界値: 絶対零度ちょうどは変換できる', () => {
    expect(convert(-273.15, 'c', 'k')).toBeCloseTo(0);
  });

  it('絶対零度を下回る入力は例外を投げる', () => {
    expect(() => convert(-300, 'c', 'k')).toThrow();
  });

  it('数値でない入力(NaN)は例外を投げる', () => {
    expect(() => convert(Number.NaN, 'c', 'f')).toThrow();
  });
});

describe('roundForDisplay', () => {
  it('小数第2位で丸める', () => {
    expect(roundForDisplay(98.7654)).toBe(98.77);
  });

  it('境界値: 0 はそのまま', () => {
    expect(roundForDisplay(0)).toBe(0);
  });
});
