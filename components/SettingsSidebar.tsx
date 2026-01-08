'use client';

import { useState, useEffect } from 'react';
import { Voice } from '@/types';
import { formatVoiceName } from '@/types';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { getApiKeyStatus } from '@/lib/api-key-manager';
import {
  getCharacterCountStatus,
  getCharacterCountColorClasses,
  getCharacterCountMessage,
} from '@/lib/status-helpers';
import { LIMITS } from '@/lib/constants';
import {
  Shield,
  Key,
  Sparkles,
  Download,
  Trash2,
  Settings,
  Mic,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

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
  onApiKeyChange?: () => void;
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
  onApiKeyChange,
}: SettingsSidebarProps) {
  const [apiKeyStatus, setApiKeyStatus] = useState<'default' | 'custom' | 'none'>('default');

  useEffect(() => {
    setApiKeyStatus(getApiKeyStatus());
  }, []);

  // Calculate character count status using centralized helper
  const characterStatus = getCharacterCountStatus(totalCharacters);
  const characterColorClasses = getCharacterCountColorClasses(characterStatus);
  const characterMessage = getCharacterCountMessage(characterStatus);

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* API Key Section */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">API Configuration</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Key className="h-3 w-3 text-muted-foreground" />
                <span className={`text-sm ${
                  apiKeyStatus === 'custom'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : apiKeyStatus === 'none'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-foreground'
                }`}>
                  {apiKeyStatus === 'custom'
                    ? 'Using your API key'
                    : apiKeyStatus === 'default'
                    ? 'Using default API key'
                    : 'No API key configured'
                  }
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {apiKeyStatus === 'custom'
                  ? 'Higher usage limits with your personal key.'
                  : 'Configure your own API key for higher limits.'
                }
              </p>
            </div>
            <ApiKeyInput
              onApiKeyChange={() => {
                setApiKeyStatus(getApiKeyStatus());
                onApiKeyChange?.();
              }}
              onStatusChange={setApiKeyStatus}
              trigger={
                <button className="
                  ml-3 text-xs font-medium
                  bg-primary hover:bg-primary/90
                  text-primary-foreground
                  px-4 py-2 rounded-lg
                  transition-all duration-200
                  shadow-sm hover:shadow-md hover:shadow-primary/20
                ">
                  {apiKeyStatus === 'custom' ? 'Update' : 'Configure'}
                </button>
              }
            />
          </div>
        </div>

        {/* Voice Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              Voice
            </label>
          </div>
          {voices.length > 0 ? (
            <select
              value={selectedVoiceId}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-background border border-input
                text-foreground text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                transition-all duration-200
                cursor-pointer
              "
            >
              <option value="">Select a voice...</option>
              {voices.map((voice, index) => (
                <option key={`${voice.voice_id}-${index}`} value={voice.voice_id}>
                  {formatVoiceName(voice)}
                </option>
              ))}
            </select>
          ) : (
            <select
              disabled
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-muted border border-input
                text-muted-foreground text-sm
                cursor-not-allowed
              "
            >
              <option>No voices available - check API key</option>
            </select>
          )}
          <p className="text-xs text-muted-foreground">
            Selected voice will be used for all lines.
          </p>
        </div>

        {/* Speed Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">
                Speed
              </label>
            </div>
            <span className="text-sm font-mono font-medium text-primary">
              {speed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min={LIMITS.MIN_SPEED}
            max={LIMITS.MAX_SPEED}
            step={LIMITS.SPEED_STEP}
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="
              w-full h-2 rounded-lg appearance-none cursor-pointer
              bg-primary
              accent-primary
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-primary
              [&::-webkit-slider-thumb]:shadow-sm
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-primary
              [&::-moz-range-thumb]:shadow-sm
              [&::-moz-range-thumb]:cursor-pointer
            "
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{LIMITS.MIN_SPEED}x</span>
            <span>{LIMITS.MAX_SPEED}x</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onGenerateAll}
            disabled={isGeneratingAll || !selectedVoiceId}
            className="
              w-full flex items-center justify-center gap-2
              bg-primary text-primary-foreground
              hover:bg-primary/90
              disabled:opacity-50 disabled:cursor-not-allowed
              px-4 py-3 rounded-xl font-medium
              transition-all duration-200
              shadow-lg shadow-primary/25
              hover:shadow-xl hover:shadow-primary/30
              disabled:shadow-none
            "
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate All
              </>
            )}
          </button>

          <button
            onClick={onDownloadAll}
            disabled={!hasReadyLines}
            className="
              w-full flex items-center justify-center gap-2
              bg-secondary text-secondary-foreground
              hover:bg-secondary/80
              disabled:opacity-50 disabled:cursor-not-allowed
              px-4 py-3 rounded-xl font-medium
              transition-all duration-200
            "
          >
            <Download className="w-5 h-5" />
            Download All
          </button>

          <button
            onClick={onClearAll}
            className="
              w-full flex items-center justify-center gap-2
              text-destructive
              hover:bg-destructive/10
              px-4 py-3 rounded-xl font-medium
              transition-all duration-200
            "
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>

        {/* Character Counter */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Characters</span>
            <div className={`flex items-center gap-1.5 ${characterColorClasses.text}`}>
              {characterStatus === 'error' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : characterStatus === 'warning' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : totalCharacters > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : null}
              <span className="text-sm font-mono font-medium">
                {totalCharacters.toLocaleString()}
              </span>
            </div>
          </div>
          {characterMessage && (
            <p className={`text-xs mt-1 ${characterColorClasses.text}`}>
              {characterMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
