import type { Unit } from '../types';

const ABSOLUTE_ZERO_C = -273.15;

function toCelsius(value: number, from: Unit): number {
  switch (from) {
    case 'c':
      return value;
    case 'f':
      return (value - 32) * (5 / 9);
    case 'k':
      return value - 273.15;
  }
}

function fromCelsius(celsius: number, to: Unit): number {
  switch (to) {
    case 'c':
      return celsius;
    case 'f':
      return celsius * (9 / 5) + 32;
    case 'k':
      return celsius + 273.15;
  }
}

/**
 * 温度を from 単位から to 単位へ変換する純粋関数。
 * 絶対零度(-273.15℃)を下回る入力は物理的に不正なため例外を投げる。
 */
export function convert(value: number, from: Unit, to: Unit): number {
  if (!Number.isFinite(value)) {
    throw new Error('数値を入力してください');
  }
  const celsius = toCelsius(value, from);
  if (celsius < ABSOLUTE_ZERO_C - 1e-9) {
    throw new Error('絶対零度を下回る温度は指定できません');
  }
  return fromCelsius(celsius, to);
}

/** 表示用に小数第2位で丸める。 */
export function roundForDisplay(value: number): number {
  return Math.round(value * 100) / 100;
}
