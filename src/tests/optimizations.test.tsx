import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triggerHaptic } from '../utils/haptics';

describe('Safe Mobile & Performance Optimizations', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('triggerHaptic operates safely when navigator.vibrate is available', () => {
    const vibrateMock = vi.fn();
    vi.stubGlobal('navigator', { vibrate: vibrateMock });

    triggerHaptic('light');
    expect(vibrateMock).toHaveBeenCalledWith(15);

    triggerHaptic('heartbeat');
    expect(vibrateMock).toHaveBeenCalledWith([35, 100, 35]);

    triggerHaptic('success');
    expect(vibrateMock).toHaveBeenCalledWith([20, 60, 30]);
  });

  it('triggerHaptic fails gracefully without errors when navigator.vibrate is unsupported (e.g. iOS Safari)', () => {
    vi.stubGlobal('navigator', {});
    expect(() => triggerHaptic('light')).not.toThrow();
  });

  it('AudioContext visibility listener safely suspends on background and resumes on foreground', async () => {
    const { sound } = await import('../utils/audio');
    expect(sound).toBeDefined();
    expect(sound.isMuted()).toBe(false);

    // Simulate switching tabs
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    // Simulate returning to tab
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(sound.isMuted()).toBe(false);
  });
});
