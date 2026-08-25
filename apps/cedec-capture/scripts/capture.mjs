#!/usr/bin/env node
/**
 * Official CEDEC 2026 timetable JSON → slim catalog for the app.
 * Usage: node scripts/capture.mjs [--from /path/to/timetable.json]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/content/sessions.json');
const SOURCE =
  'https://cedec.cesa.or.jp/2026/session/timetable.json';
const DETAIL = 'https://cedec.cesa.or.jp/2026/timetable/detail';
const CEDIL = 'https://cedil.cesa.or.jp/';

const FIELDS = {
  1: { code: 'ENG', label: 'エンジニアリング' },
  2: { code: 'PRD', label: 'プロダクション' },
  3: { code: 'VA', label: 'ビジュアルアーツ' },
  4: { code: 'GD', label: 'ゲームデザイン' },
  5: { code: 'SND', label: 'サウンド' },
  6: { code: 'BP', label: 'ビジネス＆プロデュース' },
  7: { code: 'AC', label: '学術研究' },
  8: { code: 'INT', label: 'インタラクティブ' },
  9: { code: 'SP', label: 'ノン・ジャンル' },
  10: { code: 'AB', label: 'AB' },
  11: { code: 'BoF', label: 'BoF' },
  12: { code: 'HOST', label: '主催者企画' },
};

const FORMATS = {
  1: 'レギュラーセッション',
  2: 'パネルディスカッション',
  3: 'ラウンドテーブル',
  4: 'ショートセッション',
  5: 'インタラクティブセッション',
  6: 'ワークショップ',
  7: '基調講演',
  8: 'CEDEC CHALLENGE',
  9: '業界研究フェア',
  10: 'チュートリアル',
  20: '主催者挨拶',
  21: 'CEDEC AWARDS',
  22: 'ライトニングトーク',
};

const TYPES = {
  1: '公募',
  2: '招待',
  3: 'スポンサー',
  4: '協賛',
  5: '特別招待',
  6: '団体招待',
  7: '海外招待',
  8: '基調講演',
  9: '主催者',
};

const KEYWORDS = {
  1: 'ゲームAI',
  2: 'LLM/VLM',
  3: 'モデル学習',
  4: 'QA',
  5: 'TA',
  6: 'サーバー',
  7: 'レンダリング',
  8: 'アニメーション（3D）',
  9: 'UX',
  10: '自動テスト',
  11: 'CI/CD',
  12: 'GaaS',
  13: 'ストーリーテリング',
  14: 'コンバットデザイン',
  15: 'レベルデザイン',
  16: 'ゲームユーザーリサーチ',
  17: 'ローカライズ',
  18: 'アナログ/体験型',
  19: 'ハプティクス',
  20: 'アクセシビリティ',
};

const DIFFICULTY = {
  0: '学生含めどなたでも',
  1: 'この分野の初心者へ',
  2: 'ある程度の経験がある人へ',
  3: '知的刺激を求める人へ',
};

function clean(text) {
  return String(text ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .trim();
}

function parseStamp(value) {
  if (!value) return { day: '', time: '' };
  const m = String(value).match(
    /^(\d{4})\/(\d{2})\/(\d{2})(?:\s+(\d{2}):(\d{2}))?/,
  );
  if (!m) return { day: '', time: '' };
  return {
    day: `${m[1]}-${m[2]}-${m[3]}`,
    time: m[4] ? `${m[4]}:${m[5]}` : '',
  };
}

function fieldOf(id) {
  return FIELDS[id] ?? { code: '?', label: `分野${id}` };
}

function speakerOf(speakers, id) {
  const raw = speakers[String(id)];
  if (!raw) return { name: `講演者#${id}`, company: '', job: '' };
  return {
    name: clean(raw.name),
    company: clean(raw.company),
    job: clean(raw.job || raw.division),
  };
}

function flatten(posts) {
  const out = [];
  for (const post of posts) {
    out.push({ post, parentUuid: null });
    for (const child of post.children ?? []) {
      out.push({ post: child, parentUuid: post.uuid });
    }
  }
  return out;
}

function toSession(post, speakers, parentUuid) {
  const startSrc = post.held_at || post.held_at_as_child;
  const start = parseStamp(startSrc);
  const end = parseStamp(post.end_time);
  const field = fieldOf(post.category_id);
  const extraFields = (post.subcategory ?? [])
    .filter((id) => id && id !== 12 && id !== post.category_id)
    .map((id) => fieldOf(id).code)
    .filter(Boolean);
  const keywords = (post.keywordtag ?? [])
    .map((id) => KEYWORDS[id])
    .filter(Boolean);
  const uuid = post.uuid;
  return {
    id: post.id,
    uuid,
    parentUuid,
    title: clean(post.title),
    day: start.day,
    start: start.time,
    end: end.time,
    room: post.room || '',
    field: field.code,
    fieldLabel: field.label,
    extraFields,
    format: FORMATS[post.format_id] ?? `形式${post.format_id}`,
    type: TYPES[post.type_id] ?? '',
    difficulty: Number(post.difficulty ?? 0),
    difficultyLabel: DIFFICULTY[post.difficulty] ?? '',
    keywords,
    abstract: clean(post.quick_description),
    takeaway: clean(post.takeaway),
    expectedSkill: clean(post.expected_skill),
    speakers: (post.speakers ?? []).map((id) => speakerOf(speakers, id)),
    officialUrl: `${DETAIL}/${uuid}/`,
    cedilUrl: CEDIL,
    photoAllowed: Boolean(post.photo_allowed),
    snsAllowed: Boolean(post.sns_allowed),
    materialsAllowed: Number(post.materials_allowed) === 1,
  };
}

async function loadSource() {
  const fromIdx = process.argv.indexOf('--from');
  if (fromIdx >= 0 && process.argv[fromIdx + 1]) {
    const { readFile } = await import('node:fs/promises');
    return JSON.parse(await readFile(process.argv[fromIdx + 1], 'utf8'));
  }
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`fetch failed ${res.status} ${SOURCE}`);
  return res.json();
}

const data = await loadSource();
const sessions = flatten(data.posts).map(({ post, parentUuid }) =>
  toSession(post, data.speakers, parentUuid),
);
const catalog = {
  capturedAt: new Date().toISOString(),
  source: SOURCE,
  event: {
    name: 'CEDEC 2026',
    dates: ['2026-07-22', '2026-07-23', '2026-07-24'],
    venue: 'パシフィコ横浜ノース / オンライン',
    official: 'https://cedec.cesa.or.jp/2026/',
    cedil: CEDIL,
  },
  sessionCount: sessions.length,
  sessions,
};

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`wrote ${sessions.length} sessions → ${OUT}`);
