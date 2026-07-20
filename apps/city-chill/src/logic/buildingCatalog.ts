import type { Tile, TileKind } from '../types';

/** 事前生成する建物モデルの定義（形のバリエーション単位） */
export interface BuildingModelDef {
  id: string;
  kind: TileKind;
  /** 生成時の基準高さ（ランタイムで tier に応じて Y スケール） */
  baseHeight: number;
  /** フットプリント辺長 1 or 2 */
  footprint: 1 | 2;
  /** 説明（生成スクリプト用） */
  shape: string;
}

/**
 * 種類ごとに複数の「形」を用意する。
 * 色違いはテクスチャ／マテリアルで出し、ここはシルエットの差を担当する。
 */
export const BUILDING_MODEL_DEFS: BuildingModelDef[] = [
  // --- residential ---
  { id: 'res_box_t1', kind: 'residential', baseHeight: 0.7, footprint: 1, shape: 'box' },
  { id: 'res_lwing_t1', kind: 'residential', baseHeight: 0.7, footprint: 1, shape: 'lwing' },
  { id: 'res_hip_t1', kind: 'residential', baseHeight: 0.75, footprint: 1, shape: 'hip' },
  { id: 'res_tall_t3', kind: 'residential', baseHeight: 1.2, footprint: 1, shape: 'tall' },
  // --- commercial ---
  { id: 'com_shop', kind: 'commercial', baseHeight: 0.85, footprint: 1, shape: 'shop' },
  { id: 'com_awning', kind: 'commercial', baseHeight: 0.9, footprint: 1, shape: 'awning' },
  { id: 'com_block', kind: 'commercial', baseHeight: 1.15, footprint: 1, shape: 'block' },
  // --- industrial ---
  { id: 'ind_shed', kind: 'industrial', baseHeight: 0.8, footprint: 1, shape: 'shed' },
  { id: 'ind_sawtooth', kind: 'industrial', baseHeight: 0.95, footprint: 1, shape: 'sawtooth' },
  { id: 'ind_chimney', kind: 'industrial', baseHeight: 1.1, footprint: 1, shape: 'chimney' },
  // --- civic ---
  { id: 'school_main', kind: 'school', baseHeight: 0.95, footprint: 1, shape: 'school' },
  { id: 'hospital_cross', kind: 'hospital', baseHeight: 1.0, footprint: 1, shape: 'hospital' },
  { id: 'station_canopy', kind: 'station', baseHeight: 0.65, footprint: 1, shape: 'station' },
  // --- tower 1x1 ---
  { id: 'tower_plain', kind: 'tower', baseHeight: 2.0, footprint: 1, shape: 'plain' },
  { id: 'tower_setback', kind: 'tower', baseHeight: 2.2, footprint: 1, shape: 'setback' },
  { id: 'tower_podium', kind: 'tower', baseHeight: 2.3, footprint: 1, shape: 'podium' },
  { id: 'tower_step', kind: 'tower', baseHeight: 2.4, footprint: 1, shape: 'step' },
  // --- tower 2x2 ---
  { id: 'tower2_plain', kind: 'tower', baseHeight: 2.7, footprint: 2, shape: 'plain' },
  { id: 'tower2_setback', kind: 'tower', baseHeight: 2.9, footprint: 2, shape: 'setback' },
  // --- skyscraper 1x1 ---
  { id: 'sky_plain', kind: 'skyscraper', baseHeight: 4.0, footprint: 1, shape: 'plain' },
  { id: 'sky_setback', kind: 'skyscraper', baseHeight: 4.4, footprint: 1, shape: 'setback' },
  { id: 'sky_podium', kind: 'skyscraper', baseHeight: 4.6, footprint: 1, shape: 'podium' },
  { id: 'sky_step', kind: 'skyscraper', baseHeight: 4.8, footprint: 1, shape: 'step' },
  // --- skyscraper 2x2 ---
  { id: 'sky2_plain', kind: 'skyscraper', baseHeight: 5.4, footprint: 2, shape: 'plain' },
  { id: 'sky2_setback', kind: 'skyscraper', baseHeight: 5.8, footprint: 2, shape: 'setback' },
];

export interface BuildingManifest {
  version: 1;
  models: Array<{
    id: string;
    kind: TileKind;
    baseHeight: number;
    footprint: 1 | 2;
    glb: string;
    texture: string;
  }>;
}

const byKind = new Map<TileKind, BuildingModelDef[]>();
for (const def of BUILDING_MODEL_DEFS) {
  const list = byKind.get(def.kind) ?? [];
  list.push(def);
  byKind.set(def.kind, list);
}

/**
 * タイルから使う事前モデル ID を選ぶ。
 * footprint / tier / variant で形を振り分け、色だけの差にしない。
 */
export function pickBuildingModelId(tile: Tile): string | null {
  if (tile.construction > 0) return null;
  if (tile.kind === 'pad' || tile.footprint === 0) return null;

  const fp: 1 | 2 = tile.footprint >= 2 ? 2 : 1;
  const pool = (byKind.get(tile.kind) ?? []).filter((d) => d.footprint === fp);
  if (pool.length === 0) return null;

  // tier で高さ帯、variant で形
  if (tile.kind === 'residential') {
    if (tile.tier >= 3) {
      const tall = pool.find((d) => d.shape === 'tall');
      if (tall) return tall.id;
    }
    const shapes = pool.filter((d) => d.shape !== 'tall');
    return shapes[tile.variant % shapes.length]!.id;
  }

  if (tile.kind === 'tower' || tile.kind === 'skyscraper') {
    return pool[tile.variant % pool.length]!.id;
  }

  return pool[tile.variant % pool.length]!.id;
}

export function getModelDef(id: string): BuildingModelDef | undefined {
  return BUILDING_MODEL_DEFS.find((d) => d.id === id);
}
