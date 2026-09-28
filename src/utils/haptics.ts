// Safe Web Haptics Utility for tactile mobile feedback

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'heartbeat';

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 15,
  medium: 30,
  heavy: 50,
  success: [20, 60, 30],
  heartbeat: [35, 100, 35],
};

export const triggerHaptic = (type: HapticType = 'light'): void => {
  if (typeof window === 'undefined') return;
  try {
    if ('navigator' in window && typeof navigator.vibrate === 'function') {
      const pattern = HAPTIC_PATTERNS[type];
      navigator.vibrate(pattern);
    }
  } catch {
    // Graceful fallback on devices that don't support vibration or restrict it (e.g. iOS Safari)
  }
};
