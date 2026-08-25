/** HTML テキストへ埋め込む前にエスケープする。 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 改行を保持したプレーンテキストを HTML 化する。 */
export function formatMultiline(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return escapeHtml(trimmed).replace(/\n/g, '<br />');
}
