// Type definitions for TTS Web Application

export interface Voice {
  voice_id: string;
  name: string;
  labels?: {
    accent?: string;
    gender?: string;
    age?: string;
    description?: string;
    use_case?: string;
  };
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