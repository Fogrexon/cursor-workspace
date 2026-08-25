import type { Session } from '../types';

/** この playground の実装関心（シェーダ / 3D / UI / シミュレーション）に寄せる語。 */
export const PLAYGROUND_KEYWORDS = [
  'レンダリング',
  'モデル学習',
  'UX',
  'アニメーション（3D）',
  'LLM/VLM',
] as const;

const TITLE_TERMS = [
  'シェーダ',
  'シェーダー',
  'ニューラル',
  'webgpu',
  'glsl',
  'npr',
  'アニメ調',
  '流体',
  'クロス',
  '布',
  '都市',
  'オープンワールド',
  'pbr',
  'ライティング',
  'シミュレーション',
  'ノード',
  '物理',
  'マテリアル',
  '描画',
] as const;

/**
 * playground 実装との近さ。キーワード一致を主、タイトル/要旨の語を副とする。
 */
export function playgroundRelevance(session: Session): {
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  for (const kw of session.keywords) {
    if ((PLAYGROUND_KEYWORDS as readonly string[]).includes(kw)) {
      score += 3;
      reasons.push(kw);
    }
  }

  const blob = `${session.title}\n${session.abstract}\n${session.takeaway}`;
  const hay = blob.toLowerCase();
  for (const term of TITLE_TERMS) {
    if (hay.includes(term.toLowerCase())) {
      score += 1;
      reasons.push(term);
    }
  }
  if (/(?:^|[\s「『/])UI(?:[\s」』のをにで]|$)/.test(blob)) {
    score += 2;
    reasons.push('UI');
  }

  return { score, reasons: unique(reasons) };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function isPlaygroundRelevant(session: Session, minScore = 3): boolean {
  return playgroundRelevance(session).score >= minScore;
}
