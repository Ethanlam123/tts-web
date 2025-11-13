// Type definitions for TTS Web Application

export interface Voice {
  voice_id: string; // Map from voiceId in API response
  name: string;
  labels?: {
    accent?: string;
    gender?: string;
    age?: string;
    description?: string;
    use_case?: string;
    language?: string;
  };
  description?: string;
}

export interface Line {
  id: string;
  text: string;
  audioBlob?: Blob;
  audioUrl?: string;
  status: 'idle' | 'processing' | 'ready' | 'error';
  error?: string;
}

export interface AppSettings {
  voiceId: string;
  speed: number;
}

export type LineStatus = Line['status'];

// API Key Management Types
export type ApiKeyStatus = 'default' | 'custom' | 'none';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: string;
}

export interface ApiKeyManager {
  storeApiKey: (apiKey: string) => void;
  getStoredApiKey: () => string | null;
  clearStoredApiKey: () => void;
  validateApiKeyFormat: (apiKey: string) => boolean;
  testApiKey: (apiKey: string) => Promise<ValidationResult>;
}

// Helper functions for voice formatting
export function formatVoiceName(voice: Voice): string {
  const parts = [voice.name];

  if (voice.labels?.accent || voice.labels?.gender) {
    const details = [
      voice.labels.accent,
      voice.labels.gender,
    ].filter(Boolean).join(', ');

    parts.push(`(${details})`);
  }

  return parts.join(' ');
}

// Helper function for zero-padding line numbers
export function formatLineNumber(index: number): string {
  return String(index + 1).padStart(3, '0');
}