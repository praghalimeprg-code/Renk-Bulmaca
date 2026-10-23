/**
 * Mobile Haptic feedback controller using Web Vibration API
 */
export const haptics = {
  tap: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignore
      }
    }
  },
  combo: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(28);
      } catch {
        // Ignore
      }
    }
  },
  explosion: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 30]);
      } catch {
        // Ignore
      }
    }
  },
  victory: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 50, 40, 50, 90]);
      } catch {
        // Ignore
      }
    }
  },
};
