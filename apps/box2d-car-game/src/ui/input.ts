import type { DriveInput } from '../types';

/**
 * キーボードとタッチ/クリックの操作をまとめて DriveInput として提供する。
 * 右(→ / D / アクセルボタン)= 前進、左(← / A / ブレーキボタン)= 後退。
 */
export class InputController {
  private throttle = false;
  private brake = false;
  private readonly cleanups: Array<() => void> = [];

  constructor(throttleBtn: HTMLElement, brakeBtn: HTMLElement) {
    this.bindKeyboard();
    this.bindButton(throttleBtn, (v) => (this.throttle = v));
    this.bindButton(brakeBtn, (v) => (this.brake = v));
  }

  get state(): DriveInput {
    return { throttle: this.throttle, brake: this.brake };
  }

  private bindKeyboard(): void {
    const setFromKey = (key: string, pressed: boolean): void => {
      if (key === 'ArrowRight' || key === 'd' || key === 'D') this.throttle = pressed;
      if (key === 'ArrowLeft' || key === 'a' || key === 'A') this.brake = pressed;
    };
    const down = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
      setFromKey(e.key, true);
    };
    const up = (e: KeyboardEvent) => setFromKey(e.key, false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    this.cleanups.push(() => window.removeEventListener('keydown', down));
    this.cleanups.push(() => window.removeEventListener('keyup', up));
  }

  private bindButton(el: HTMLElement, set: (v: boolean) => void): void {
    const press = (e: Event) => {
      e.preventDefault();
      set(true);
    };
    const release = () => set(false);
    el.addEventListener('pointerdown', press);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointerleave', release);
    el.addEventListener('pointercancel', release);
    this.cleanups.push(() => {
      el.removeEventListener('pointerdown', press);
      el.removeEventListener('pointerup', release);
      el.removeEventListener('pointerleave', release);
      el.removeEventListener('pointercancel', release);
    });
  }

  dispose(): void {
    for (const fn of this.cleanups) fn();
    this.cleanups.length = 0;
  }
}
