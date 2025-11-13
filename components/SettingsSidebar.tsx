"use client";

import { Voice } from "@/types";
import { formatVoiceName } from "@/types";

interface SettingsSidebarProps {
  voices: Voice[];
  selectedVoiceId: string;
  speed: number;
  onVoiceChange: (voiceId: string) => void;
  onSpeedChange: (speed: number) => void;
  onGenerateAll: () => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
  totalCharacters: number;
  isGeneratingAll: boolean;
  hasReadyLines: boolean;
}

export default function SettingsSidebar({
  voices,
  selectedVoiceId,
  speed,
  onVoiceChange,
  onSpeedChange,
  onGenerateAll,
  onDownloadAll,
  onClearAll,
  totalCharacters,
  isGeneratingAll,
  hasReadyLines,
}: SettingsSidebarProps) {
  // Calculate character count status
  const getCharacterCountStatus = () => {
    if (totalCharacters > 8000) return "warning";
    if (totalCharacters > 10000) return "error";
    return "normal";
  };

  const characterStatus = getCharacterCountStatus();

  return (
    <div className="bg-card/50 border border-border/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Settings & Controls
      </h2>

      {/* Voice Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Default Voice
          </label>
          {voices.length > 0 ? (
            <select
              value={selectedVoiceId}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-foreground"
            >
              <option value="">Select a voice...</option>
              {voices.map((voice, index) => (
                <option
                  key={`${voice.voice_id}-${index}`}
                  value={voice.voice_id}
                >
                  {formatVoiceName(voice)}
                </option>
              ))}
            </select>
          ) : (
            <select
              disabled
              className="w-full bg-muted border border-input rounded-md px-3 py-2 text-muted-foreground"
            >
              <option key="no-voices">
                No voices available - check API key
              </option>
            </select>
          )}
          <p className="text-xs text-muted-foreground">
            This voice will be used for all lines by default. You can override
            it for individual lines on the left.
          </p>
        </div>

        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Playback Speed: {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-cyan-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.5x</span>
            <span>2.0x</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-6">
        <button
          onClick={onGenerateAll}
          className="w-full bg-cyan-primary text-primary-foreground hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          disabled={isGeneratingAll}
        >
          ✨ Generate All
        </button>

        <button
          onClick={onDownloadAll}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          disabled={!hasReadyLines}
        >
          ⬇️ Download All
        </button>

        <button
          onClick={onClearAll}
          className="w-full text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Character Counter */}
      <div className="mt-6">
        <div className="flex justify-between text-sm">
          <span className="text-foreground">Character Count</span>
          <span
            className={
              characterStatus === "warning"
                ? "text-amber-500"
                : characterStatus === "error"
                ? "text-red-500"
                : "text-foreground"
            }
          >
            {totalCharacters.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
