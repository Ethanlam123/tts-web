// Preferences Manager - Centralized localStorage handling for user preferences

import { STORAGE_KEYS as COMMON_STORAGE_KEYS, LIMITS } from '@/lib/constants';
import { validateVoiceId } from '@/lib/validators';

const STORAGE_KEYS = {
  VOICE_ID: COMMON_STORAGE_KEYS.VOICE_ID,
  SPEED: COMMON_STORAGE_KEYS.SPEED,
} as const;

const DEFAULT_VALUES = {
  speed: 1.0,
} as const;

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Validate voice ID format using centralized validator
 */
function isValidVoiceId(voiceId: string): boolean {
  const validation = validateVoiceId(voiceId);
  return validation.isValid;
}

/**
 * Load user preferences from localStorage
 */
export function loadPreferences(): { voiceId: string | null; speed: number } {
  if (!isBrowser()) {
    return { voiceId: null, speed: DEFAULT_VALUES.speed };
  }

  try {
    let voiceId = localStorage.getItem(STORAGE_KEYS.VOICE_ID);
    const speedStr = localStorage.getItem(STORAGE_KEYS.SPEED);

    // Clear invalid cached voice ID
    if (voiceId && !isValidVoiceId(voiceId)) {
      localStorage.removeItem(STORAGE_KEYS.VOICE_ID);
      voiceId = null;
    }

    const speed = speedStr ? parseFloat(speedStr) : DEFAULT_VALUES.speed;

    return {
      voiceId,
      speed: isNaN(speed) ? DEFAULT_VALUES.speed : speed,
    };
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return { voiceId: null, speed: DEFAULT_VALUES.speed };
  }
}

/**
 * Save voice ID preference
 */
export function saveVoiceId(voiceId: string): void {
  if (!isBrowser()) return;

  try {
    if (voiceId && isValidVoiceId(voiceId)) {
      localStorage.setItem(STORAGE_KEYS.VOICE_ID, voiceId);
    }
  } catch (error) {
    console.error('Failed to save voice ID:', error);
  }
}

/**
 * Save speed preference
 */
export function saveSpeed(speed: number): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.SPEED, speed.toString());
  } catch (error) {
    console.error('Failed to save speed:', error);
  }
}

/**
 * Clear all preferences
 */
export function clearPreferences(): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(STORAGE_KEYS.VOICE_ID);
    localStorage.removeItem(STORAGE_KEYS.SPEED);
  } catch (error) {
    console.error('Failed to clear preferences:', error);
  }
}

/**
 * Get stored voice ID
 */
export function getStoredVoiceId(): string | null {
  if (!isBrowser()) return null;

  try {
    const voiceId = localStorage.getItem(STORAGE_KEYS.VOICE_ID);
    return voiceId && isValidVoiceId(voiceId) ? voiceId : null;
  } catch (error) {
    console.error('Failed to get voice ID:', error);
    return null;
  }
}

/**
 * Get stored speed
 */
export function getStoredSpeed(): number {
  if (!isBrowser()) return DEFAULT_VALUES.speed;

  try {
    const speedStr = localStorage.getItem(STORAGE_KEYS.SPEED);
    const speed = speedStr ? parseFloat(speedStr) : DEFAULT_VALUES.speed;
    return isNaN(speed) ? DEFAULT_VALUES.speed : speed;
  } catch (error) {
    console.error('Failed to get speed:', error);
    return DEFAULT_VALUES.speed;
  }
}
