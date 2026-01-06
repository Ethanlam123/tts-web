// Audio Generator - Centralized TTS generation logic

import { Line } from '@/types';
import { getEffectiveApiKey } from '@/lib/api-key-manager';
import { validateVoiceId, validateText, validateAudioBlob } from '@/lib/validators';
import { API_CONFIG, ERROR_MESSAGES, FILE_NAMING, TIMING } from '@/lib/constants';
import JSZip from 'jszip';

export interface GenerateAudioOptions {
  voiceId: string;
  text: string;
}

export interface GenerateAudioResult {
  success: boolean;
  audioBlob?: Blob;
  audioUrl?: string;
  error?: string;
}

/**
 * Generate audio for a single text
 */
export async function generateSingleAudio(options: GenerateAudioOptions): Promise<GenerateAudioResult> {
  const { voiceId, text } = options;

  // Validate inputs using centralized validators
  const voiceValidation = validateVoiceId(voiceId);
  if (!voiceValidation.isValid) {
    return {
      success: false,
      error: voiceValidation.error || ERROR_MESSAGES.VOICE_ID_INVALID,
    };
  }

  const textValidation = validateText(text);
  if (!textValidation.isValid) {
    return {
      success: false,
      error: textValidation.error || ERROR_MESSAGES.TEXT_REQUIRED,
    };
  }

  try {
    const effectiveApiKey = getEffectiveApiKey();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (effectiveApiKey) {
      headers['x-api-key'] = effectiveApiKey;
    }

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, voiceId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Failed to generate audio',
      };
    }

    const audioBlob = await response.blob();

    // Validate audio blob using centralized validator
    const blobValidation = validateAudioBlob(audioBlob);
    if (!blobValidation.isValid) {
      return {
        success: false,
        error: blobValidation.error || ERROR_MESSAGES.EMPTY_AUDIO,
      };
    }

    // Ensure blob has correct MIME type
    const audioBlobWithCorrectType = new Blob([audioBlob], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlobWithCorrectType);

    return {
      success: true,
      audioBlob: audioBlobWithCorrectType,
      audioUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate audio for multiple lines with progress callback
 */
export async function generateBatchAudio(
  lines: Line[],
  voiceId: string,
  onProgress?: (lineId: string, status: 'processing' | 'ready' | 'error', result?: GenerateAudioResult) => void,
  delayBetweenRequests: number = TIMING.AUDIO_GENERATION_DELAY
): Promise<void> {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip lines that are already ready, stale, or currently processing
    if (line.status === 'ready' || line.status === 'stale' || line.status === 'processing') {
      continue;
    }

    // Notify processing start
    onProgress?.(line.id, 'processing');

    const result = await generateSingleAudio({
      voiceId,
      text: line.text,
    });

    // Notify result
    onProgress?.(line.id, result.success ? 'ready' : 'error', result);

    // Add delay between requests to avoid rate limiting
    if (i < lines.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }
  }
}

/**
 * Create a ZIP file from ready audio lines (including stale audio)
 */
export async function createZipDownload(lines: Line[]): Promise<{ success: boolean; error?: string }> {
  const readyLines = lines.filter(line => (line.status === 'ready' || line.status === 'stale') && line.audioBlob);

  if (readyLines.length === 0) {
    return {
      success: false,
      error: ERROR_MESSAGES.NO_AUDIO_READY,
    };
  }

  try {
    const zip = new JSZip();

    readyLines.forEach((line, index) => {
      const lineNumber = String(index + 1).padStart(FILE_NAMING.LINE_NUMBER_PAD, '0');
      zip.file(`${FILE_NAMING.LINE_PREFIX}_${lineNumber}.${FILE_NAMING.AUDIO_EXTENSION}`, line.audioBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${FILE_NAMING.ZIP_PREFIX}_${new Date().toISOString().split('T')[0]}.${FILE_NAMING.ZIP_EXTENSION}`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.ZIP_CREATION_FAILED,
    };
  }
}

/**
 * Revoke all audio URLs in a list of lines (cleanup)
 */
export function revokeAudioUrls(lines: Line[]): void {
  lines.forEach(line => {
    if (line.audioUrl) {
      URL.revokeObjectURL(line.audioUrl);
    }
  });
}
