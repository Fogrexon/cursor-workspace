import { describe, expect, it, vi } from 'vitest';
import { defineEvent } from './events.ts';
import { EventBus } from './events.ts';

const Ping = defineEvent<{ value: number }>('Ping');

describe('EventBus', () => {
  it('on / emit / off', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const off = bus.on(Ping, handler);
    bus.emit(Ping, { value: 42 });
    expect(handler).toHaveBeenCalledWith({ value: 42 });
    off();
    bus.emit(Ping, { value: 99 });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
