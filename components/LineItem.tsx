'use client';

import { useState } from 'react';
import { Play, RotateCw, Trash2 } from 'lucide-react';
import { Line } from '@/types';

interface LineItemProps {
  line: Line;
  index: number;
  onRegenerate: (lineId: string) => void;
  onDelete: (lineId: string) => void;
  onPlay: (lineId: string) => void;
}

export default function LineItem({ line, index, onRegenerate, onDelete, onPlay }: LineItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (!line.audioBlob) {
      console.error('No audio blob available for playback');
      return;
    }

    setIsPlaying(true);

    try {
      // Create a fresh blob URL each time to avoid caching issues
      const freshAudioUrl = URL.createObjectURL(line.audioBlob);

      // Create new audio element
      const audio = new Audio(freshAudioUrl);

      // Set up event listeners
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        URL.revokeObjectURL(freshAudioUrl); // Clean up
      });

      audio.addEventListener('error', (e) => {
        setIsPlaying(false);
        URL.revokeObjectURL(freshAudioUrl);
        console.error('Audio playback failed:', audio.error);
      });

      // Play the audio
      await audio.play();

    } catch (error) {
      setIsPlaying(false);
      console.error('Failed to play audio:', error);

      // Try direct HTML5 audio as fallback
      try {
        const audio = new Audio();
        audio.src = URL.createObjectURL(line.audioBlob);
        audio.play().then(() => {
          console.log('Fallback audio playback started');
        }).catch((fallbackError) => {
          console.error('Fallback audio also failed:', fallbackError);
        });
      } catch (fallbackError) {
        console.error('All audio playback attempts failed:', fallbackError);
      }
    }
  };

  return (
    <div className="bg-card/50 border border-border/50 rounded-lg p-4 flex items-start gap-4">
      {/* Line number */}
      <div className="text-muted-foreground font-mono text-sm mt-1 w-12 text-right">
        {String(index + 1).padStart(2, '0')}.
      </div>

      {/* Line content and status */}
      <div className="flex-1 min-w-0">
        <div className="text-foreground font-mono text-sm leading-relaxed">
          {line.text}
        </div>

        {/* Status badge */}
        {line.status !== 'idle' && (
          <div className="mt-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              line.status === 'ready'
                ? 'bg-green-500'
                : line.status === 'processing'
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`} />
            <span className={`text-sm ${
              line.status === 'ready'
                ? 'text-green-500'
                : line.status === 'processing'
                ? 'text-amber-500'
                : 'text-red-500'
            }`}>
              {line.status === 'ready' && 'Ready'}
              {line.status === 'processing' && 'Generating...'}
              {line.status === 'error' && 'Error - failed to generate'}
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {line.status === 'ready' && (
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="p-2 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            title={isPlaying ? 'Playing...' : 'Play audio'}
          >
            <Play className="w-4 h-4" fill={isPlaying ? 'currentColor' : 'none'} />
          </button>
        )}
        <button
          onClick={() => onRegenerate(line.id)}
          disabled={line.status === 'processing'}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          title="Regenerate"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(line.id)}
          disabled={line.status === 'processing'}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          title="Delete line"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}