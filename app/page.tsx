'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import FileUploadArea from '@/components/FileUploadArea';
import LinesList from '@/components/LinesList';
import SettingsSidebar from '@/components/SettingsSidebar';
import { Voice, Line } from '@/types';
import {
  getEffectiveApiKey,
  initializeApiKeyStatus,
} from '@/lib/api-key-manager';
import {
  loadPreferences,
  saveVoiceId,
  saveSpeed,
} from '@/lib/preferences-manager';
import {
  generateSingleAudio,
  createZipDownload,
  revokeAudioUrls,
} from '@/lib/audio-generator';
import { LIMITS } from '@/lib/constants';

export default function Dashboard() {
  // State management
  const [lines, setLines] = useState<Line[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [speed, setSpeed] = useState<number>(1.0);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Initialize API key status on component mount
  useEffect(() => {
    initializeApiKeyStatus();
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    const preferences = loadPreferences();
    if (preferences.voiceId) {
      setSelectedVoiceId(preferences.voiceId);
    }
    setSpeed(preferences.speed);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (selectedVoiceId) {
      saveVoiceId(selectedVoiceId);
    }
  }, [selectedVoiceId]);

  useEffect(() => {
    saveSpeed(speed);
  }, [speed]);

  // Fetch voices function
  const fetchVoices = useCallback(async () => {
    try {
      const effectiveApiKey = getEffectiveApiKey();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (effectiveApiKey) {
        headers['x-api-key'] = effectiveApiKey;
      }

      const response = await fetch('/api/voices', {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const voicesData = await response.json();
        const voicesList = voicesData.voices || [];

        const validVoices = voicesList.filter((voice: Voice) =>
          voice && voice.voice_id && typeof voice.voice_id === 'string' && voice.voice_id.trim() !== ''
        );

        setVoices(validVoices);
      } else {
        if (response.status === 401) {
          console.log('API key required - please configure your ElevenLabs API key');
        } else {
          console.warn('Voices API temporarily unavailable:', response.status);
        }
      }
    } catch (error) {
      console.error('Failed to fetch voices:', error);
    }
  }, []);

  // Fetch voices on mount
  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  // Calculate total characters
  const totalCharacters = lines.reduce((sum, line) => sum + line.text.length, 0);

  // Handle files loaded from FileUploadArea
  const handleFilesLoaded = useCallback((newLines: Line[]) => {
    // Clean up any existing audio URLs first
    revokeAudioUrls(lines);
    setLines(newLines);
  }, [lines]);

  // Generate audio for a single line
  const generateAudio = useCallback(async (lineId: string) => {
    const line = lines.find(l => l.id === lineId);
    if (!line || !selectedVoiceId) {
      console.error('No line or voice ID selected');
      return;
    }

    // Update line status to processing
    setLines(prev => prev.map(l =>
      l.id === lineId ? { ...l, status: 'processing' as const } : l
    ));

    const result = await generateSingleAudio({
      voiceId: selectedVoiceId,
      text: line.text,
    });

    if (result.success && result.audioBlob && result.audioUrl) {
      setLines(prev => prev.map(l =>
        l.id === lineId ? {
          ...l,
          status: 'ready' as const,
          audioBlob: result.audioBlob,
          audioUrl: result.audioUrl,
        } : l
      ));
    } else {
      setLines(prev => prev.map(l =>
        l.id === lineId ? {
          ...l,
          status: 'error' as const,
          error: result.error,
        } : l
      ));
    }
  }, [lines, selectedVoiceId]);

  // Generate audio for all lines
  const generateAll = useCallback(async () => {
    if (!selectedVoiceId || lines.length === 0) return;

    setIsGeneratingAll(true);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.status === 'ready' || line.status === 'processing') {
        continue;
      }

      await generateAudio(line.id);

      if (i < lines.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500)); // TODO: Extract to constant
      }
    }

    setIsGeneratingAll(false);
  }, [lines, selectedVoiceId, generateAudio]);

  // Download all audio files as ZIP
  const downloadAll = useCallback(async () => {
    const result = await createZipDownload(lines);
    if (!result.success) {
      alert(result.error || 'Failed to create download file');
    }
  }, [lines]);

  // Clear all lines
  const clearAll = useCallback(() => {
    if (lines.length === 0) return;

    if (confirm('Are you sure you want to clear all lines? This action cannot be undone.')) {
      revokeAudioUrls(lines);
      setLines([]);
    }
  }, [lines]);

  // Delete a single line
  const handleDeleteLine = useCallback((lineId: string) => {
    const lineToDelete = lines.find(l => l.id === lineId);
    if (lineToDelete?.audioUrl) {
      URL.revokeObjectURL(lineToDelete.audioUrl);
    }
    setLines(prev => prev.filter(l => l.id !== lineId));
  }, [lines]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      revokeAudioUrls(lines);
    };
  }, [lines]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Text-to-Speech Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload a text file and convert each line to high-quality audio.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left Column - Content Area */}
          <div className="space-y-6">
            {lines.length === 0 ? (
              <FileUploadArea onFilesLoaded={handleFilesLoaded} />
            ) : (
              <LinesList
                lines={lines}
                onRegenerate={generateAudio}
                onDelete={handleDeleteLine}
              />
            )}
          </div>

          {/* Right Column - Settings Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <SettingsSidebar
              voices={voices}
              selectedVoiceId={selectedVoiceId}
              speed={speed}
              onVoiceChange={setSelectedVoiceId}
              onSpeedChange={setSpeed}
              onGenerateAll={generateAll}
              onDownloadAll={downloadAll}
              onClearAll={clearAll}
              totalCharacters={totalCharacters}
              isGeneratingAll={isGeneratingAll}
              hasReadyLines={lines.some(line => line.status === 'ready')}
              onApiKeyChange={fetchVoices}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
