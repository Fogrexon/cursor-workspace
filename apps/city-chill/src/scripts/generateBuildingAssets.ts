/**
 * 建物 GLB / ファサード PNG を事前生成する。
 * 使い方: npm run generate:buildings
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  BUILDING_MODEL_DEFS,
  type BuildingManifest,
  type BuildingModelDef,
} from '../logic/buildingCatalog.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../public/models/buildings');

const KIND_COLOR: Record<string, number> = {
  residential: 0xc4a882,
  commercial: 0x7a9ec4,
  industrial: 0x8a8a70,
  school: 0xe8d080,
  hospital: 0xe8e8f0,
  station: 0x9090a0,
  tower: 0x90b0d0,
  skyscraper: 0xa8c0e0,
};

function footprintWH(def: BuildingModelDef): { w: number; d: number } {
  if (def.footprint >= 2) {
    if (def.kind === 'skyscraper') return { w: 1.65, d: 1.65 };
    if (def.kind === 'tower') return { w: 1.45, d: 1.4 };
    return { w: 1.5, d: 1.5 };
  }
  if (def.kind === 'skyscraper') return { w: 0.72, d: 0.72 };
  if (def.kind === 'tower') return { w: 0.55, d: 0.58 };
  if (def.kind === 'industrial') return { w: 0.68, d: 0.62 };
  if (def.kind === 'commercial') return { w: 0.64, d: 0.58 };
  if (def.kind === 'station') return { w: 0.7, d: 0.55 };
  return { w: 0.62, d: 0.58 };
}

function boxGeo(w: number, h: number, d: number, y: number): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(0, y, 0);
  return g;
}

/** 形バリエーションごとのジオメトリ配列を組み立てる */
function buildGeometries(def: BuildingModelDef): THREE.BufferGeometry[] {
  const h = def.baseHeight;
  const { w, d } = footprintWH(def);
  const geos: THREE.BufferGeometry[] = [];

  switch (def.shape) {
    case 'lwing': {
      geos.push(boxGeo(w, h, d * 0.55, h / 2));
      const wing = boxGeo(w * 0.45, h * 0.9, d, (h * 0.9) / 2);
      wing.translate(w * 0.28, 0, 0);
      geos.push(wing);
      // 簡易屋根
      geos.push(boxGeo(w * 1.05, 0.06, d * 0.6, h + 0.03));
      break;
    }
    case 'hip': {
      geos.push(boxGeo(w, h * 0.85, d, (h * 0.85) / 2));
      geos.push(boxGeo(w * 1.05, 0.04, d * 1.05, h * 0.85 + 0.02));
      geos.push(boxGeo(w * 0.55, 0.1, d * 0.55, h * 0.85 + 0.12));
      break;
    }
    case 'tall': {
      geos.push(boxGeo(w * 0.95, h, d * 0.9, h / 2));
      geos.push(boxGeo(w * 1.0, 0.05, d * 0.95, h + 0.025));
      break;
    }
    case 'shop': {
      geos.push(boxGeo(w, h, d, h / 2));
      // 看板庇
      const awning = boxGeo(w * 0.95, 0.05, 0.14, h * 0.4);
      awning.translate(0, 0, d / 2 + 0.06);
      geos.push(awning);
      break;
    }
    case 'awning': {
      geos.push(boxGeo(w, h, d, h / 2));
      const awning = boxGeo(w * 1.0, 0.06, 0.18, h * 0.45);
      awning.translate(0, 0, d / 2 + 0.08);
      geos.push(awning);
      const sign = boxGeo(0.3, 0.12, 0.04, h * 0.65);
      sign.translate(0, 0, d / 2 + 0.04);
      geos.push(sign);
      break;
    }
    case 'block': {
      geos.push(boxGeo(w * 1.05, h, d, h / 2));
      geos.push(boxGeo(w * 1.08, 0.05, d * 1.02, h + 0.025));
      break;
    }
    case 'shed': {
      geos.push(boxGeo(w * 1.1, h * 0.85, d * 0.95, (h * 0.85) / 2));
      geos.push(boxGeo(w * 1.15, 0.08, d, h * 0.85 + 0.04));
      break;
    }
    case 'sawtooth': {
      geos.push(boxGeo(w * 1.1, h * 0.8, d * 0.95, (h * 0.8) / 2));
      for (let i = 0; i < 2; i++) {
        const tooth = boxGeo(w * 0.35, 0.14, d * 0.9, h * 0.8 + 0.07);
        tooth.translate((i - 0.5) * w * 0.4, 0, 0);
        geos.push(tooth);
      }
      break;
    }
    case 'chimney': {
      geos.push(boxGeo(w * 1.05, h * 0.85, d, (h * 0.85) / 2));
      const chim = boxGeo(0.14, h + 0.2, 0.14, (h + 0.2) / 2);
      chim.translate(0.2, 0, -0.1);
      geos.push(chim);
      geos.push(boxGeo(w * 1.08, 0.05, d * 1.02, h * 0.85 + 0.025));
      break;
    }
    case 'school': {
      geos.push(boxGeo(w * 1.1, h, d, h / 2));
      const flag = boxGeo(0.2, 0.1, 0.03, h + 0.12);
      geos.push(flag);
      const pole = boxGeo(0.03, 0.28, 0.03, h + 0.05);
      pole.translate(-0.12, 0, 0);
      geos.push(pole);
      break;
    }
    case 'hospital': {
      geos.push(boxGeo(w, h, d, h / 2));
      const v = boxGeo(0.08, 0.28, 0.04, h * 0.7);
      v.translate(0, 0, d / 2 + 0.02);
      const hz = boxGeo(0.22, 0.08, 0.04, h * 0.7);
      hz.translate(0, 0, d / 2 + 0.02);
      geos.push(v, hz);
      break;
    }
    case 'station': {
      geos.push(boxGeo(w, h * 0.7, d, (h * 0.7) / 2));
      geos.push(boxGeo(0.95, 0.08, 0.38, h * 0.7 + 0.06));
      const postL = boxGeo(0.05, h * 0.5, 0.05, h * 0.25);
      postL.translate(-0.35, 0, 0.12);
      const postR = boxGeo(0.05, h * 0.5, 0.05, h * 0.25);
      postR.translate(0.35, 0, 0.12);
      geos.push(postL, postR);
      break;
    }
    case 'setback': {
      const h1 = h * 0.62;
      const h2 = h * 0.38;
      geos.push(boxGeo(w, h1, d, h1 / 2));
      geos.push(boxGeo(w * 0.72, h2, d * 0.72, h1 + h2 / 2));
      break;
    }
    case 'podium': {
      const baseH = h * 0.22;
      const shaftH = h - baseH;
      geos.push(boxGeo(w * 1.08, baseH, d * 1.08, baseH / 2));
      geos.push(boxGeo(w * 0.78, shaftH, d * 0.78, baseH + shaftH / 2));
      break;
    }
    case 'step': {
      const s1 = h * 0.4;
      const s2 = h * 0.35;
      const s3 = h * 0.25;
      geos.push(boxGeo(w, s1, d, s1 / 2));
      geos.push(boxGeo(w * 0.82, s2, d * 0.82, s1 + s2 / 2));
      geos.push(boxGeo(w * 0.58, s3, d * 0.58, s1 + s2 + s3 / 2));
      break;
    }
    case 'plain':
    case 'box':
    default: {
      geos.push(boxGeo(w, h, d, h / 2));
      if (def.kind === 'residential') {
        geos.push(boxGeo(w * 1.02, 0.05, d * 1.02, h + 0.025));
      } else if (def.kind === 'tower' || def.kind === 'skyscraper') {
        const antH = def.footprint >= 2 ? 0.45 : 0.3;
        geos.push(boxGeo(0.04, antH, 0.04, h + antH / 2));
      }
      break;
    }
  }

  return geos;
}

function makeFacadeRGBA(def: BuildingModelDef): { data: Uint8Array; w: number; h: number } {
  const tw = 64;
  const th = 128;
  const data = new Uint8Array(tw * th * 4);
  const base = new THREE.Color(KIND_COLOR[def.kind] ?? 0xcccccc);

  const rows = def.kind === 'skyscraper' || def.kind === 'tower' ? 10 : 6;
  const cols = def.kind === 'skyscraper' || def.kind === 'tower' ? 5 : 4;
  const padX = 6;
  const padY = 8;
  const gapX = 3;
  const gapY = 4;
  const cellW = (tw - padX * 2 - gapX * (cols - 1)) / cols;
  const cellH = (th - padY * 2 - gapY * (rows - 1)) / rows;

  const setPx = (x: number, y: number, r: number, g: number, b: number) => {
    if (x < 0 || y < 0 || x >= tw || y >= th) return;
    const i = (y * tw + x) * 4;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  };

  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      setPx(x, y, (base.r * 255) | 0, (base.g * 255) | 0, (base.b * 255) | 0);
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lit = ((def.id.length * 7 + row * 3 + col * 5) % 10) > 4;
      let r: number, g: number, b: number;
      if (def.kind === 'skyscraper' || def.kind === 'tower') {
        [r, g, b] = lit ? [60, 100, 140] : [25, 35, 50];
      } else if (def.kind === 'industrial') {
        [r, g, b] = lit ? [70, 70, 55] : [40, 40, 35];
      } else {
        [r, g, b] = lit ? [255, 220, 140] : [30, 40, 50];
      }
      const x0 = Math.round(padX + col * (cellW + gapX));
      const y0 = Math.round(padY + row * (cellH + gapY));
      for (let yy = 0; yy < Math.round(cellH); yy++) {
        for (let xx = 0; xx < Math.round(cellW); xx++) {
          setPx(x0 + xx, y0 + yy, r, g, b);
        }
      }
    }
  }

  return { data, w: tw, h: th };
}

/** 無依存の PNG エンコーダ（RGBA8） */
function encodePng(rgba: Uint8Array, width: number, height: number): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
    return table;
  })();

  const crc32 = (buf: Buffer) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]!) & 0xff]! ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };

  const chunk = (type: string, data: Buffer) => {
    const typeBuf = Buffer.from(type, 'ascii');
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const crcBuf = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcBuf), 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(
      raw,
      y * (stride + 1) + 1,
    );
  }
  const compressed = zlib.deflateSync(raw);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Node でも動く最小 GLB 書き出し（単一メッシュ・頂点色なし・外部テクスチャ前提）。
 */
function writeGlb(geometry: THREE.BufferGeometry, colorHex: number, name: string): Buffer {
  geometry.computeVertexNormals();
  const pos = geometry.getAttribute('position');
  const nrm = geometry.getAttribute('normal');
  const uv = geometry.getAttribute('uv');
  const idx = geometry.index;
  if (!pos || !nrm || !idx) throw new Error(`incomplete geometry: ${name}`);

  const align4 = (n: number) => (n + 3) & ~3;

  const posArr = new Float32Array(pos.array as ArrayLike<number>);
  const nrmArr = new Float32Array(nrm.array as ArrayLike<number>);
  const uvArr = uv
    ? new Float32Array(uv.array as ArrayLike<number>)
    : new Float32Array((pos.count * 2)).fill(0);
  const idxArr =
    idx.array instanceof Uint16Array || (idx.array as Uint32Array).BYTES_PER_ELEMENT === 2
      ? new Uint16Array(idx.array as ArrayLike<number>)
      : idx.array instanceof Uint32Array
        ? new Uint32Array(idx.array)
        : new Uint16Array(idx.array as ArrayLike<number>);

  // バッファを 4byte 整列で連結
  const parts: { data: Uint8Array; byteOffset: number }[] = [];
  let cursor = 0;
  const pushBuf = (arr: ArrayBufferView) => {
    const bytes = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    const padded = new Uint8Array(align4(bytes.length));
    padded.set(bytes);
    parts.push({ data: padded, byteOffset: cursor });
    cursor += padded.length;
  };

  const posInfo = { offset: cursor, length: 0 };
  pushBuf(posArr);
  posInfo.length = posArr.byteLength;

  const nrmInfo = { offset: cursor, length: 0 };
  pushBuf(nrmArr);
  nrmInfo.length = nrmArr.byteLength;

  const uvInfo = { offset: cursor, length: 0 };
  pushBuf(uvArr);
  uvInfo.length = uvArr.byteLength;

  const idxInfo = { offset: cursor, length: 0 };
  pushBuf(idxArr);
  idxInfo.length = idxArr.byteLength;

  const bin = new Uint8Array(cursor);
  for (const p of parts) bin.set(p.data, p.byteOffset);

  const c = new THREE.Color(colorHex);
  const componentType = idxArr.BYTES_PER_ELEMENT === 2 ? 5123 : 5125;

  const json = {
    asset: { version: '2.0', generator: 'city-chill-building-gen' },
    scenes: [{ nodes: [0] }],
    scene: 0,
    nodes: [{ mesh: 0, name }],
    meshes: [
      {
        name,
        primitives: [
          {
            attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 },
            indices: 3,
            material: 0,
          },
        ],
      },
    ],
    materials: [
      {
        name: `${name}-mat`,
        pbrMetallicRoughness: {
          baseColorFactor: [c.r, c.g, c.b, 1],
          metallicFactor: 0.1,
          roughnessFactor: 0.75,
        },
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: pos.count,
        type: 'VEC3',
        max: [
          Math.max(...Array.from({ length: pos.count }, (_, i) => pos.getX(i))),
          Math.max(...Array.from({ length: pos.count }, (_, i) => pos.getY(i))),
          Math.max(...Array.from({ length: pos.count }, (_, i) => pos.getZ(i))),
        ],
        min: [
          Math.min(...Array.from({ length: pos.count }, (_, i) => pos.getX(i))),
          Math.min(...Array.from({ length: pos.count }, (_, i) => pos.getY(i))),
          Math.min(...Array.from({ length: pos.count }, (_, i) => pos.getZ(i))),
        ],
      },
      { bufferView: 1, componentType: 5126, count: nrm.count, type: 'VEC3' },
      { bufferView: 2, componentType: 5126, count: pos.count, type: 'VEC2' },
      { bufferView: 3, componentType, count: idx.count, type: 'SCALAR' },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: posInfo.offset, byteLength: posInfo.length, target: 34962 },
      { buffer: 0, byteOffset: nrmInfo.offset, byteLength: nrmInfo.length, target: 34962 },
      { buffer: 0, byteOffset: uvInfo.offset, byteLength: uvInfo.length, target: 34962 },
      { buffer: 0, byteOffset: idxInfo.offset, byteLength: idxInfo.length, target: 34963 },
    ],
    buffers: [{ byteLength: bin.byteLength }],
  };

  // min/max を効率的に計算し直す
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity,
    maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }
  json.accessors[0]!.min = [minX, minY, minZ];
  json.accessors[0]!.max = [maxX, maxY, maxZ];

  let jsonText = JSON.stringify(json);
  while (jsonText.length % 4 !== 0) jsonText += ' ';
  const jsonBuf = Buffer.from(jsonText, 'utf8');

  const totalLength = 12 + 8 + jsonBuf.length + 8 + bin.byteLength;
  const out = Buffer.alloc(totalLength);
  out.writeUInt32LE(0x46546c67, 0); // glTF
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(totalLength, 8);

  let o = 12;
  out.writeUInt32LE(jsonBuf.length, o);
  out.writeUInt32LE(0x4e4f534a, o + 4); // JSON
  jsonBuf.copy(out, o + 8);
  o += 8 + jsonBuf.length;

  out.writeUInt32LE(bin.byteLength, o);
  out.writeUInt32LE(0x004e4942, o + 4); // BIN\0
  Buffer.from(bin.buffer, bin.byteOffset, bin.byteLength).copy(out, o + 8);

  return out;
}

async function generateOne(def: BuildingModelDef): Promise<BuildingManifest['models'][number]> {
  const geos = buildGeometries(def);
  const merged = mergeGeometries(geos, false);
  if (!merged) throw new Error(`merge failed: ${def.id}`);
  for (const g of geos) g.dispose();

  const { data, w, h } = makeFacadeRGBA(def);
  const pngBuf = encodePng(data, w, h);
  const texName = `${def.id}.png`;
  fs.writeFileSync(path.join(OUT_DIR, texName), pngBuf);

  const glbName = `${def.id}.glb`;
  const glb = writeGlb(merged, KIND_COLOR[def.kind] ?? 0xcccccc, def.id);
  fs.writeFileSync(path.join(OUT_DIR, glbName), glb);

  merged.dispose();

  console.log(`  ✓ ${def.id}`);
  return {
    id: def.id,
    kind: def.kind,
    baseHeight: def.baseHeight,
    footprint: def.footprint,
    glb: glbName,
    texture: texName,
  };
}

async function main(): Promise<void> {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  // 古い生成物を消す（manifest 以外の掃除は id ベース）
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.endsWith('.glb') || f.endsWith('.png') || f === 'manifest.json') {
      fs.unlinkSync(path.join(OUT_DIR, f));
    }
  }

  console.log(`Generating ${BUILDING_MODEL_DEFS.length} building models → ${OUT_DIR}`);
  const models: BuildingManifest['models'] = [];
  for (const def of BUILDING_MODEL_DEFS) {
    models.push(await generateOne(def));
  }

  const manifest: BuildingManifest = { version: 1, models };
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Wrote manifest.json (${models.length} models)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
