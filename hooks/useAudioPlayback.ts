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
  const cleanupListenersRef = useRef<(() => void)[]>([]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Remove all event listeners
    cleanupListenersRef.current.forEach(fn => fn());
    cleanupListenersRef.current = [];

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
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
    // Cleanup any previous playback first
    cleanup();

    // Validate blob
    if (!audioBlob) {
      const error = new Error('No audio blob provided');
      onError?.(error);
      throw error;
    }

    if (audioBlob.size === 0) {
      const error = new Error('Audio blob is empty');
      onError?.(error);
      throw error;
    }

    // Ensure blob has correct MIME type
    const blobWithType = audioBlob.type === 'audio/mpeg'
      ? audioBlob
      : new Blob([audioBlob], { type: 'audio/mpeg' });

    // Create blob URL
    const audioUrl = URL.createObjectURL(blobWithType);
    audioUrlRef.current = audioUrl;

    // Create audio element
    const audio = new Audio();
    audioRef.current = audio;

    // Track if playback has started
    let hasStarted = false;
    let hasErrored = false;

    // Set up event listeners
    const handleEnded = () => {
      if (!hasErrored) {
        cleanup();
        onPlayEnd?.();
      }
    };

    const handleError = (e: Event) => {
      hasErrored = true;
      console.error('Audio playback error:', e);

      // Get more detailed error information
      const audioElement = e.target as HTMLAudioElement;
      const errorMessage = audioElement.error
        ? `Audio error: ${audioElement.error.message} (code: ${audioElement.error.code})`
        : 'Audio playback failed';

      cleanup();
      onError?.(new Error(errorMessage));
    };

    const handleCanPlay = () => {
      // Blob URL is ready to play
    };

    // Add event listeners and track them for cleanup
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    cleanupListenersRef.current.push(
      () => audio.removeEventListener('ended', handleEnded),
      () => audio.removeEventListener('error', handleError),
      () => audio.removeEventListener('canplay', handleCanPlay)
    );

    try {
      // Set source
      audio.src = audioUrl;
      audio.load();

      // Wait for the audio to be ready
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Audio loading timeout'));
        }, 5000);

        audio.addEventListener('canplay', () => {
          clearTimeout(timeoutId);
          resolve();
        }, { once: true });

        audio.addEventListener('error', (e) => {
          clearTimeout(timeoutId);
          reject(new Error('Failed to load audio'));
        }, { once: true });
      });

      // Start playback
      setIsPlaying(true);
      onPlayStart?.();
      hasStarted = true;

      await audio.play();

    } catch (error) {
      hasErrored = true;
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
