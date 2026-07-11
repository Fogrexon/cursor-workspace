import { defineUi } from '@playground/bubble-engine';

const accent = { r: 0.42, g: 0.49, b: 1, a: 1 };
const muted = { r: 0.65, g: 0.67, b: 0.78, a: 1 };
const white = { r: 0.95, g: 0.95, b: 0.98, a: 1 };

export const hudDef = defineUi('hud', {
  anchor: { edge: 'top-left', margin: { x: 16, y: 12 } },
  layout: { mode: 'column', gap: 6, align: 'start' },
  children: [
    { name: 'score', text: { bind: 'score', fontSize: 20, color: white } },
    { name: 'birds', text: { bind: 'birds', fontSize: 16, color: muted } },
    { name: 'pigs', text: { bind: 'pigs', fontSize: 16, color: muted } },
  ],
});

export const menuDef = defineUi('menu', {
  anchor: { edge: 'center' },
  layout: { mode: 'column', gap: 18, align: 'center' },
  children: [
    {
      name: 'title',
      text: { text: 'Angry Bubble', fontSize: 40, color: { r: 1, g: 0.85, b: 0.35, a: 1 } },
    },
    {
      name: 'subtitle',
      text: { text: '引っ張って離せ！', fontSize: 18, color: muted },
    },
    {
      name: 'playBtn',
      effects: { preset: 'pulse' },
      button: {
        action: 'play',
        label: 'PLAY',
        width: 220,
        height: 52,
        fontSize: 22,
        color: white,
        background: accent,
        cornerRadius: 10,
      },
    },
    {
      name: 'help',
      text: { text: 'ブロックを崩して豚を倒そう', fontSize: 14, color: muted },
    },
  ],
});

export const resultDef = defineUi('result', {
  anchor: { edge: 'center' },
  panel: { width: 320, height: 260, background: { r: 0.12, g: 0.12, b: 0.18, a: 0.92 }, cornerRadius: 12 },
  layout: { mode: 'column', gap: 14, padding: 20, align: 'center', justify: 'center' },
  children: [
    {
      name: 'headline',
      // パネル内幅いっぱいにして中央寄せ（絵文字幅の誤差で右寄りになるのを防ぐ）
      layoutChild: { minWidth: 280 },
      text: { bind: 'headline', fontSize: 28, color: { r: 1, g: 0.85, b: 0.35, a: 1 } },
    },
    {
      name: 'subline',
      layoutChild: { minWidth: 280 },
      text: { bind: 'subline', fontSize: 16, color: muted },
    },
    {
      name: 'retryBtn',
      button: {
        action: 'retry',
        label: 'リトライ',
        width: 160,
        height: 44,
        fontSize: 18,
        color: white,
        background: accent,
        cornerRadius: 8,
      },
    },
    {
      name: 'menuBtn',
      button: {
        action: 'menu',
        label: 'メニュー',
        width: 160,
        height: 44,
        fontSize: 18,
        color: white,
        background: { r: 0.28, g: 0.3, b: 0.4, a: 1 },
        cornerRadius: 8,
      },
    },
  ],
});

export const pauseHintDef = defineUi('pause-hint', {
  anchor: { edge: 'bottom-center', margin: { x: 0, y: 24 } },
  children: [
    {
      name: 'hint',
      text: { text: 'ドラッグして狙い、離して発射', fontSize: 14, color: { r: 1, g: 1, b: 1, a: 0.55 } },
    },
  ],
});
