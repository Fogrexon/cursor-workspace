export class GameLoop {
  private lastTime: number | null = null;
  private accumulator = 0;
  private fixedCallbacks: Array<(dt: number) => void> = [];
  private frameCallbacks: Array<(dt: number) => void> = [];
  private renderCallbacks: Array<() => void> = [];

  constructor(
    private readonly options: { fixedDt: number; maxFrameTime: number },
  ) {}

  onFixedUpdate(cb: (dt: number) => void): void {
    this.fixedCallbacks.push(cb);
  }

  /** 可変フレーム dt（シーン update・Input フェーズ向け） */
  onFrameUpdate(cb: (dt: number) => void): void {
    this.frameCallbacks.push(cb);
  }

  onRender(cb: () => void): void {
    this.renderCallbacks.push(cb);
  }

  tick(now: number): void {
    if (this.lastTime === null) {
      this.lastTime = now;
      for (const cb of this.frameCallbacks) cb(0);
      for (const cb of this.renderCallbacks) cb();
      return;
    }
    const elapsed = Math.min(this.options.maxFrameTime, now - this.lastTime);
    this.lastTime = now;
    this.accumulator += elapsed;
    while (this.accumulator >= this.options.fixedDt) {
      for (const cb of this.fixedCallbacks) cb(this.options.fixedDt);
      this.accumulator -= this.options.fixedDt;
    }
    for (const cb of this.frameCallbacks) cb(elapsed);
    for (const cb of this.renderCallbacks) cb();
  }
}
