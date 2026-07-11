import type { SceneScopeKind } from '../components/SceneScope.ts';
import type { ScreenAnchorData } from '../components/ui/ScreenAnchor.ts';
import type { UiLayoutChildData, UiLayoutData } from '../components/ui/UiLayout.ts';
import type { UiPanelData } from '../components/ui/UiPanel.ts';
import type { UiTextData } from '../components/ui/UiText.ts';
import type { UiButtonData } from '../components/ui/UiButton.ts';
import type { UiButtonDef } from './expandUiNode.ts';
import type { UiEffectsData } from '../components/ui/UiEffects.ts';

export type { UiButtonDef };

export interface UiNodeDef {
  readonly name?: string;
  readonly anchor?: ScreenAnchorData;
  readonly scope?: SceneScopeKind;
  readonly visible?: boolean;
  readonly layout?: UiLayoutData;
  readonly layoutChild?: UiLayoutChildData;
  readonly panel?: UiPanelData;
  readonly text?: UiTextData;
  /** 宣言的ボタン（panel + label + action に展開） */
  readonly button?: UiButtonDef;
  /** ECS UiButton（レガシー） */
  readonly uiButton?: UiButtonData;
  /** クリック時に UiActionClick で emit される ID */
  readonly action?: string;
  readonly effects?: UiEffectsData;
  readonly children?: readonly UiNodeDef[];
}
