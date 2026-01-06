// Audio Generator - Centralized TTS generation logic

import { Line } from '@/types';
import { getEffectiveApiKey } from '@/lib/api-key-manager';
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

  // Validate voice_id format
  if (voiceId.includes('(') || voiceId.includes('-') || voiceId.length > 50) {
    return {
      success: false,
      error: 'Invalid voice ID format',
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

    if (audioBlob.size === 0) {
      return {
        success: false,
        error: 'Received empty audio file',
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
  delayBetweenRequests: number = 500
): Promise<void> {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip lines that are already ready or currently processing
    if (line.status === 'ready' || line.status === 'processing') {
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
 * Create a ZIP file from ready audio lines
 */
export async function createZipDownload(lines: Line[]): Promise<{ success: boolean; error?: string }> {
  const readyLines = lines.filter(line => line.status === 'ready' && line.audioBlob);

  if (readyLines.length === 0) {
    return {
      success: false,
      error: 'No audio files ready for download',
    };
  }

  try {
    const zip = new JSZip();

    readyLines.forEach((line, index) => {
      const lineNumber = String(index + 1).padStart(3, '0');
      zip.file(`line_${lineNumber}.mp3`, line.audioBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tts_audio_${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create ZIP file',
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
