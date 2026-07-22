export type DisplayMode = 'row' | 'column' | 'none';
export type PositionMode = 'flow' | 'absolute';
export type JustifyMode = 'start' | 'center' | 'end' | 'space-between';
export type AlignMode = 'start' | 'center' | 'end' | 'stretch';
export type TextAlign = 'left' | 'center' | 'right';
export type PseudoState = 'hover' | 'active';

export type SourcePos = {
  line: number;
  column: number;
};

export type ParseDiagnostic = {
  message: string;
  line: number;
  column: number;
};

export type CssValue =
  | { kind: 'keyword'; value: string }
  | { kind: 'number'; value: number; unit?: string }
  | { kind: 'color'; value: string }
  | { kind: 'string'; value: string }
  | { kind: 'var'; name: string; fallback?: CssValue }
  | { kind: 'token'; name: string }
  | { kind: 'list'; items: CssValue[] };

export type Declaration = {
  property: string;
  value: CssValue;
  important: boolean;
  pos: SourcePos;
};

export type SimpleSelector = {
  type?: string;
  id?: string;
  classes: string[];
  pseudo?: PseudoState;
};

export type Rule = {
  selectors: SimpleSelector[];
  declarations: Declaration[];
  pos: SourcePos;
};

export type Stylesheet = {
  rules: Rule[];
  diagnostics: ParseDiagnostic[];
};

export type StyleMap = Record<string, CssValue>;

export type ResolvedStyle = {
  display: DisplayMode;
  position: PositionMode;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minWidth: number;
  minHeight: number;
  flex: number;
  gap: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  justify: JustifyMode;
  align: AlignMode;
  background: string;
  color: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  opacity: number;
  fontSize: number;
  fontWeight: number;
  textAlign: TextAlign;
  content: string;
  typeName: string;
  parentId?: string;
};

export type ElementNode = {
  id: string;
  typeName: string;
  classNames: string[];
  parentId?: string;
  children: ElementNode[];
};

export type LayoutBox = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  contentX: number;
  contentY: number;
  contentWidth: number;
  contentHeight: number;
  style: ResolvedStyle;
  children: LayoutBox[];
};

/** Semantic theme: token name → color string or number. */
export type Theme = Record<string, string | number>;

export type Scene = {
  roots: ElementNode[];
  byId: Map<string, ElementNode>;
  variables: Record<string, CssValue>;
  stylesheet: Stylesheet;
  /** Inline / patch styles merged after cascade (highest priority). */
  inlineStyles: Map<string, StyleMap>;
  /** Content overrides for game-loop updates without reparse. */
  contentOverrides: Map<string, string>;
  /** Semantic token table for `token('name')` style values. */
  theme: Theme;
  /** Runtime animation overlays (literals), applied after token resolve. */
  motionOverlays: Map<string, StyleMap>;
};
