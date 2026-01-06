/**
 * Application-wide constants
 * Centralized to avoid magic numbers and improve maintainability
 */

// API Configuration
export const API_CONFIG = {
  ELEVENLABS_KEY_PREFIX: 'sk_',
  ELEVENLABS_KEY_PATTERN: /^sk_[a-zA-Z0-9]{16,}$/,
  MIN_KEY_LENGTH: 18,
  MAX_VOICE_ID_LENGTH: 50,
} as const;

// Timing Configuration (milliseconds)
export const TIMING = {
  AUDIO_GENERATION_DELAY: 500,
  DIALOG_CLOSE_DELAY: 1500,
  DEBOUNCE_DELAY: 300,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  API_KEY: 'elevenlabs_api_key',
  API_KEY_STATUS: 'elevenlabs_api_key_status',
  VOICE_ID: 'voiceId',
  SPEED: 'speed',
} as const;

// Validation Limits
export const LIMITS = {
  MAX_TEXT_LENGTH: 10000,
  WARNING_TEXT_LENGTH: 8000,
  MIN_SPEED: 0.5,
  MAX_SPEED: 2.0,
  SPEED_STEP: 0.1,
} as const;

// File Naming
export const FILE_NAMING = {
  LINE_NUMBER_PAD: 3,
  ZIP_PREFIX: 'tts_audio',
  LINE_PREFIX: 'line',
  AUDIO_EXTENSION: 'mp3',
  ZIP_EXTENSION: 'zip',
} as const;

// Status Configuration
export const STATUS_CONFIG = {
  idle: null,
  ready: {
    dotColor: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderColor: 'border-emerald-200 dark:border-emerald-500/20',
    text: 'Ready',
  },
  processing: {
    dotColor: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    borderColor: 'border-amber-200 dark:border-amber-500/20',
    text: 'Generating...',
  },
  error: {
    dotColor: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-500/10',
    borderColor: 'border-red-200 dark:border-red-500/20',
    text: 'Failed to generate',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  API_KEY_REQUIRED: 'API key is required. Please configure your ElevenLabs API key in settings.',
  API_KEY_INVALID_FORMAT: 'Invalid API key format. ElevenLabs API keys should start with "sk_" followed by alphanumeric characters.',
  TEXT_REQUIRED: 'Text is required and cannot be empty',
  VOICE_ID_REQUIRED: 'Voice ID is required',
  VOICE_ID_INVALID: 'Invalid voice ID format',
  AUDIO_GENERATION_FAILED: 'Failed to generate audio. Please try again.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again shortly.',
  EMPTY_AUDIO: 'Received empty audio file',
  NO_AUDIO_READY: 'No audio files ready for download',
  ZIP_CREATION_FAILED: 'Failed to create ZIP file',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
} as const;
