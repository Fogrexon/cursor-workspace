import type { RgbaColor } from '../math/types.ts';
import type { UiNodeDef } from './UiDefinition.ts';

/** defineUi 用ボタン一括定義（panel + label + action を展開） */
export interface UiButtonDef {
  action: string;
  label: string;
  width: number;
  height: number;
  fontSize?: number;
  color?: RgbaColor;
  background?: RgbaColor;
  cornerRadius?: number;
}

const defaultBtnBg: RgbaColor = { r: 0.42, g: 0.49, b: 1, a: 1 };
const defaultBtnColor: RgbaColor = { r: 0.95, g: 0.95, b: 0.98, a: 1 };

/** button フィールドを panel / layout / action / label 子に展開 */
export function expandUiNode(node: UiNodeDef): UiNodeDef {
  if (!node.button) return node;
  const b = node.button;
  const labelChild: UiNodeDef = {
    name: node.name ? `${node.name}Label` : undefined,
    text: {
      text: b.label,
      fontSize: b.fontSize ?? 18,
      color: b.color ?? defaultBtnColor,
    },
  };
  return {
    ...node,
    button: undefined,
    action: b.action,
    panel: {
      width: b.width,
      height: b.height,
      background: b.background ?? defaultBtnBg,
      cornerRadius: b.cornerRadius ?? 8,
    },
    layout: { mode: 'row', align: 'center', justify: 'center' },
    children: [...(node.children ?? []), labelChild],
  };
}
