/** 文字種別ベースのテキスト幅概算（canvas が使えない環境のフォールバック） */
export const DEFAULT_UI_FONT =
  '"Segoe UI", "Hiragino Sans", "Yu Gothic UI", "Meiryo", "Noto Sans JP", sans-serif';

let measureCtx: CanvasRenderingContext2D | null | undefined;

function getMeasureContext(): CanvasRenderingContext2D | null {
  if (measureCtx === undefined) {
    try {
      measureCtx =
        typeof document !== 'undefined'
          ? document.createElement('canvas').getContext('2d')
          : null;
    } catch {
      measureCtx = null;
    }
  }
  return measureCtx;
}

/** emoji / 記号はレイアウトで幅を大きめに取る */
export function isEmojiChar(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (
    (code >= 0x1f300 && code <= 0x1faff) ||
    (code >= 0x2600 && code <= 0x27bf) ||
    ch === '🎉' ||
    ch === '💥' ||
    ch === '🐦' ||
    ch === '▶'
  );
}

/** 1文字が全角相当かどうか（CJK・全角記号） */
export function isWideChar(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return code > 0x2e80 || isEmojiChar(ch);
}

function approximateTextWidth(text: string, fontSize: number): number {
  let width = 0;
  for (const ch of text) {
    if (ch === ' ') width += fontSize * 0.35;
    else if (isEmojiChar(ch)) width += fontSize * 1.2;
    else if (isWideChar(ch)) width += fontSize * 0.92;
    else width += fontSize * 0.55;
  }
  return Math.max(width, fontSize);
}

/** テキスト幅計測。ブラウザでは canvas measureText で実測 */
export function estimateTextWidth(
  text: string,
  fontSize: number,
  fontFamily: string = DEFAULT_UI_FONT,
): number {
  if (text.length === 0) return fontSize;
  const ctx = getMeasureContext();
  if (ctx) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    const w = ctx.measureText(text).width;
    if (w > 0) return w;
  }
  return approximateTextWidth(text, fontSize);
}

export function estimateTextHeight(fontSize: number): number {
  return fontSize * 1.15;
}
