'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Trash2, Volume2, AlertCircle, Loader2, Pencil, Check, X } from 'lucide-react';
import { Line } from '@/types';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { getStatusConfig, getStatusBorderClasses } from '@/lib/status-helpers';
import { LIMITS } from '@/lib/constants';

interface LineItemProps {
  line: Line;
  index: number;
  onRegenerate: (lineId: string) => void;
  onDelete: (lineId: string) => void;
  onLineUpdate: (lineId: string, newText: string) => void;
  onPlay: (lineId: string) => void;
}

export default function LineItem({ line, index, onRegenerate, onDelete, onLineUpdate }: LineItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(line.text);
  const [editError, setEditError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isPlaying, play, stop } = useAudioPlayback({
    onError: (error) => {
      console.error('Playback error:', error);
    },
  });

  // Auto-focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Handle keyboard shortcuts in edit mode
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      handleEditCancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleEditSave();
    }
  };

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

  const handleEditStart = () => {
    setIsEditing(true);
    setEditText(line.text);
    setEditError(null);
  };

  const handleEditSave = () => {
    const trimmedText = editText.trim();

    // Validation
    if (!trimmedText) {
      setEditError('Text cannot be empty');
      return;
    }

    if (trimmedText.length > LIMITS.MAX_TEXT_LENGTH) {
      setEditError(`Text exceeds ${LIMITS.MAX_TEXT_LENGTH} character limit`);
      return;
    }

    // Call parent callback
    onLineUpdate(line.id, trimmedText);
    setIsEditing(false);
    setEditError(null);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(line.text);
    setEditError(null);
  };

  const statusConfig = getStatusConfig(line.status);
  const borderClasses = getStatusBorderClasses(line.status);

  // Show play button for ready or stale status
  const showPlayButton = line.status === 'ready' || line.status === 'stale';

  return (
    <div className={`
      group relative
      bg-card/80 backdrop-blur-sm
      border rounded-xl
      transition-all duration-200 ease-out
      hover:shadow-md hover:shadow-black/5
      ${borderClasses}
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
          {isEditing ? (
            // Edit mode
            <div className="space-y-2">
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                  w-full px-3 py-2 rounded-lg
                  bg-background border border-input
                  text-foreground text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                  transition-all duration-200
                  resize-none
                  min-h-[80px] max-h-[200px]
                "
                placeholder="Enter text..."
              />
              {editError && (
                <p className="text-xs text-red-600 dark:text-red-400">{editError}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {editText.length.toLocaleString()} / {LIMITS.MAX_TEXT_LENGTH.toLocaleString()} characters
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleEditSave}
                    className="
                      flex items-center gap-1 px-3 py-1.5 rounded-lg
                      bg-emerald-500 text-white hover:bg-emerald-600
                      text-xs font-medium
                      transition-all duration-200
                    "
                    title="Save (Ctrl+Enter)"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="
                      flex items-center gap-1 px-3 py-1.5 rounded-lg
                      bg-muted text-muted-foreground hover:bg-muted/80
                      text-xs font-medium
                      transition-all duration-200
                    "
                    title="Cancel (Esc)"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // View mode
            <>
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
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {isEditing ? (
            // Hide action buttons during edit
            null
          ) : (
            <>
              {/* Play button - show for ready or stale status */}
              {showPlayButton && (
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

              {/* Edit button */}
              <button
                onClick={handleEditStart}
                disabled={line.status === 'processing'}
                className="
                  p-2.5 rounded-lg
                  text-muted-foreground
                  hover:text-foreground hover:bg-muted/80
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                  transition-all duration-200
                "
                title="Edit text"
              >
                <Pencil className="w-4 h-4" />
              </button>

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
            </>
          )}
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
