/**
 * 見出しテキストから安定した HTML id を作る。
 * 日本語を残しつつ、重複時は接尾辞を付ける。
 */
export function slugifyHeading(text: string, used: Map<string, number>): string {
  const base =
    text
      .trim()
      .toLowerCase()
      // 空白以外の制御・記号っぽい文字を除去（Unicode property は環境差があるため使わない）
      .replace(/[^\w\u00C0-\u024F\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section';

  const next = (used.get(base) ?? 0) + 1;
  used.set(base, next);
  return next === 1 ? base : `${base}-${next}`;
}
