/**
 * Validation Utilities
 * Centralized validation logic for the application
 */

import { API_CONFIG, LIMITS, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  field?: string;
}

/**
 * Validate ElevenLabs API key format
 */
export function validateApiKeyFormat(apiKey: string | null | undefined): ValidationResult {
  if (!apiKey || typeof apiKey !== 'string') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.API_KEY_INVALID_FORMAT,
      field: 'apiKey',
    };
  }

  const trimmedKey = apiKey.trim();

  if (trimmedKey.length < API_CONFIG.MIN_KEY_LENGTH) {
    return {
      isValid: false,
      error: `API key must be at least ${API_CONFIG.MIN_KEY_LENGTH} characters`,
      field: 'apiKey',
    };
  }

  if (!API_CONFIG.ELEVENLABS_KEY_PATTERN.test(trimmedKey)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.API_KEY_INVALID_FORMAT,
      field: 'apiKey',
    };
  }

  return { isValid: true };
}

/**
 * Validate voice ID format
 */
export function validateVoiceId(voiceId: string | null | undefined): ValidationResult {
  if (!voiceId || typeof voiceId !== 'string') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.VOICE_ID_REQUIRED,
      field: 'voiceId',
    };
  }

  const trimmedId = voiceId.trim();

  if (trimmedId.length === 0) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.VOICE_ID_REQUIRED,
      field: 'voiceId',
    };
  }

  if (trimmedId.length > API_CONFIG.MAX_VOICE_ID_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.VOICE_ID_INVALID,
      field: 'voiceId',
    };
  }

  // Check for invalid characters
  if (trimmedId.includes('(') || trimmedId.includes('-')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.VOICE_ID_INVALID,
      field: 'voiceId',
    };
  }

  return { isValid: true };
}

/**
 * Validate text content
 */
export function validateText(text: string | null | undefined): ValidationResult {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.TEXT_REQUIRED,
      field: 'text',
    };
  }

  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.TEXT_REQUIRED,
      field: 'text',
    };
  }

  if (trimmedText.length > LIMITS.MAX_TEXT_LENGTH) {
    return {
      isValid: false,
      error: `Text exceeds maximum length of ${LIMITS.MAX_TEXT_LENGTH} characters`,
      field: 'text',
    };
  }

  return { isValid: true };
}

/**
 * Validate speed value
 */
export function validateSpeed(speed: number): ValidationResult {
  if (typeof speed !== 'number' || isNaN(speed)) {
    return {
      isValid: false,
      error: 'Speed must be a valid number',
      field: 'speed',
    };
  }

  if (speed < LIMITS.MIN_SPEED || speed > LIMITS.MAX_SPEED) {
    return {
      isValid: false,
      error: `Speed must be between ${LIMITS.MIN_SPEED} and ${LIMITS.MAX_SPEED}`,
      field: 'speed',
    };
  }

  return { isValid: true };
}

/**
 * Validate audio blob
 */
export function validateAudioBlob(blob: Blob | null | undefined): ValidationResult {
  if (!blob) {
    return {
      isValid: false,
      error: 'No audio data available',
      field: 'audioBlob',
    };
  }

  if (blob.size === 0) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.EMPTY_AUDIO,
      field: 'audioBlob',
    };
  }

  return { isValid: true };
}
