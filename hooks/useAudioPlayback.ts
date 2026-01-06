'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAudioPlaybackOptions {
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  onError?: (error: Error) => void;
}

interface UseAudioPlaybackReturn {
  isPlaying: boolean;
  play: (audioBlob: Blob) => Promise<void>;
  stop: () => void;
}

/**
 * Custom hook for managing audio playback
 * Handles proper cleanup and error handling
 */
export function useAudioPlayback(options: UseAudioPlaybackOptions = {}): UseAudioPlaybackReturn {
  const { onPlayStart, onPlayEnd, onError } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Stop playback
  const stop = useCallback(() => {
    cleanup();
    onPlayEnd?.();
  }, [cleanup, onPlayEnd]);

  // Play audio from blob
  const play = useCallback(async (audioBlob: Blob) => {
    // Cleanup any previous playback
    cleanup();

    if (!audioBlob || audioBlob.size === 0) {
      const error = new Error('No audio blob available for playback');
      onError?.(error);
      throw error;
    }

    // Ensure blob has correct MIME type
    const blobWithType = audioBlob.type === 'audio/mpeg'
      ? audioBlob
      : new Blob([audioBlob], { type: 'audio/mpeg' });

    try {
      // Create a fresh blob URL
      const freshAudioUrl = URL.createObjectURL(blobWithType);
      audioUrlRef.current = freshAudioUrl;

      // Create new audio element
      const audio = new Audio();
      audioRef.current = audio;

      // Set up event listeners before setting src
      const handleEnded = () => {
        cleanup();
        onPlayEnd?.();
      };

      const handleError = async () => {
        console.warn('Primary audio playback failed, trying fallback...');

        // Try fallback approach - create new audio element with different method
        try {
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
          }

          const fallbackUrl = URL.createObjectURL(blobWithType);
          audioUrlRef.current = fallbackUrl;

          const fallbackAudio = new Audio(fallbackUrl);
          audioRef.current = fallbackAudio;

          fallbackAudio.addEventListener('ended', handleEnded);
          fallbackAudio.addEventListener('error', () => {
            cleanup();
            onError?.(new Error('Audio playback failed after fallback attempt'));
          });

          await fallbackAudio.play();
        } catch (fallbackError) {
          cleanup();
          onError?.(new Error('Audio playback failed'));
        }
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Set source and attempt playback
      audio.src = freshAudioUrl;
      audio.load();

      // Start playback
      setIsPlaying(true);
      onPlayStart?.();

      await audio.play();

    } catch (error) {
      cleanup();
      const playbackError = error instanceof Error ? error : new Error('Failed to play audio');
      onError?.(playbackError);
      throw playbackError;
    }
  }, [cleanup, onPlayStart, onPlayEnd, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isPlaying,
    play,
    stop,
  };
}
