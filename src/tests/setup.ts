import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock window.AudioContext
class AudioContextMock {
  state = 'running';
  currentTime = 0;
  resume = vi.fn();
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }
  destination = {};
}

Object.defineProperty(window, 'AudioContext', {
  value: AudioContextMock,
});
