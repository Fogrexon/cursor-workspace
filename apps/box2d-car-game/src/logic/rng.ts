/**
 * 決定的な擬似乱数生成器 (mulberry32)。
 * 同じシードからは必ず同じ数列を返すため、地形の再現性とテストに使える。
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** min 以上 max 未満の乱数を返す */
export function randomRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}
