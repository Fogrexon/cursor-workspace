import type { Unit } from '../types';
import { convert, roundForDisplay } from '../logic/convert';

const UNIT_LABEL: Record<Unit, string> = {
  c: '摂氏 (℃)',
  f: '華氏 (℉)',
  k: 'ケルビン (K)',
};

function unitOptions(selected: Unit): string {
  return (Object.keys(UNIT_LABEL) as Unit[])
    .map(
      (u) =>
        `<option value="${u}" ${u === selected ? 'selected' : ''}>${UNIT_LABEL[u]}</option>`,
    )
    .join('');
}

export function mountApp(root: HTMLElement): void {
  root.innerHTML = `
    <main>
      <header>
        <a class="back" href="../">← ポータルへ戻る</a>
        <h1>温度変換</h1>
        <p>摂氏・華氏・ケルビンを相互に変換します。</p>
      </header>
      <section class="panel">
        <div class="field">
          <label for="value">値</label>
          <input id="value" type="number" value="25" step="any" />
        </div>
        <div class="units">
          <div class="field">
            <label for="from">変換元</label>
            <select id="from">${unitOptions('c')}</select>
          </div>
          <div class="field">
            <label for="to">変換先</label>
            <select id="to">${unitOptions('f')}</select>
          </div>
        </div>
        <output id="result" class="result">—</output>
      </section>
    </main>
  `;

  const valueEl = root.querySelector<HTMLInputElement>('#value')!;
  const fromEl = root.querySelector<HTMLSelectElement>('#from')!;
  const toEl = root.querySelector<HTMLSelectElement>('#to')!;
  const resultEl = root.querySelector<HTMLOutputElement>('#result')!;

  function render(): void {
    try {
      const out = convert(valueEl.valueAsNumber, fromEl.value as Unit, toEl.value as Unit);
      resultEl.textContent = `${roundForDisplay(out)} ${UNIT_LABEL[toEl.value as Unit]}`;
      resultEl.classList.remove('error');
    } catch (err) {
      resultEl.textContent = err instanceof Error ? err.message : String(err);
      resultEl.classList.add('error');
    }
  }

  [valueEl, fromEl, toEl].forEach((el) => el.addEventListener('input', render));
  render();
}
