'use client';

import { Play, Pause, RotateCw, Trash2, Volume2, AlertCircle, Loader2 } from 'lucide-react';
import { Line } from '@/types';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

interface LineItemProps {
  line: Line;
  index: number;
  onRegenerate: (lineId: string) => void;
  onDelete: (lineId: string) => void;
  onPlay: (lineId: string) => void;
}

export default function LineItem({ line, index, onRegenerate, onDelete }: LineItemProps) {
  const { isPlaying, play, stop } = useAudioPlayback({
    onError: (error) => {
      console.error('Playback error:', error);
    },
  });

  const handlePlayToggle = async () => {
    if (isPlaying) {
      stop();
    } else if (line.audioBlob) {
      try {
        await play(line.audioBlob);
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  };

  const getStatusConfig = () => {
    switch (line.status) {
      case 'ready':
        return {
          dotColor: 'bg-emerald-500',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
          borderColor: 'border-emerald-200 dark:border-emerald-500/20',
          icon: Volume2,
          text: 'Ready',
        };
      case 'processing':
        return {
          dotColor: 'bg-amber-500',
          textColor: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-500/10',
          borderColor: 'border-amber-200 dark:border-amber-500/20',
          icon: Loader2,
          text: 'Generating...',
        };
      case 'error':
        return {
          dotColor: 'bg-red-500',
          textColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-500/10',
          borderColor: 'border-red-200 dark:border-red-500/20',
          icon: AlertCircle,
          text: 'Failed to generate',
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`
      group relative
      bg-card/80 backdrop-blur-sm
      border rounded-xl
      transition-all duration-200 ease-out
      hover:shadow-md hover:shadow-black/5
      ${line.status === 'processing'
        ? 'border-amber-300 dark:border-amber-500/30 shadow-sm shadow-amber-500/10'
        : line.status === 'error'
        ? 'border-red-300 dark:border-red-500/30'
        : 'border-border/50 hover:border-border'
      }
    `}>
      <div className="flex items-start gap-4 p-4">
        {/* Line number */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
          <span className="text-sm font-mono font-medium text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Line content and status */}
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-foreground text-sm leading-relaxed break-words">
            {line.text}
          </p>

          {/* Status badge */}
          {statusConfig && (
            <div className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
              ${statusConfig.bgColor} ${statusConfig.textColor}
              border ${statusConfig.borderColor}
            `}>
              <statusConfig.icon className={`w-3 h-3 ${line.status === 'processing' ? 'animate-spin' : ''}`} />
              <span>{statusConfig.text}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {/* Play button - only show when ready */}
          {line.status === 'ready' && (
            <button
              onClick={handlePlayToggle}
              className={`
                p-2.5 rounded-lg
                transition-all duration-200
                ${isPlaying
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10'
                }
              `}
              title={isPlaying ? 'Stop' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" fill="currentColor" />
              )}
            </button>
          )}

          {/* Regenerate button */}
          <button
            onClick={() => onRegenerate(line.id)}
            disabled={line.status === 'processing'}
            className="
              p-2.5 rounded-lg
              text-muted-foreground
              hover:text-foreground hover:bg-muted/80
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
              transition-all duration-200
            "
            title="Regenerate"
          >
            <RotateCw className={`w-4 h-4 ${line.status === 'processing' ? 'animate-spin' : ''}`} />
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(line.id)}
            disabled={line.status === 'processing'}
            className="
              p-2.5 rounded-lg
              text-muted-foreground
              hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground
              transition-all duration-200
            "
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Processing progress indicator */}
      {line.status === 'processing' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50 rounded-b-xl overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 animate-pulse" />
        </div>
      )}
    </div>
  );
}
