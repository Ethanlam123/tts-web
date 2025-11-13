'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import LineItem from '@/components/LineItem';
import SettingsSidebar from '@/components/SettingsSidebar';
import { Voice, Line } from '@/types';
import JSZip from 'jszip';
import {
  getEffectiveApiKey,
  initializeApiKeyStatus,
  getApiKeyStatus
} from '@/lib/api-key-manager';

export default function Dashboard() {
  // State management
  const [lines, setLines] = useState<Line[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [speed, setSpeed] = useState<number>(1.0);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize API key status on component mount
  useEffect(() => {
    initializeApiKeyStatus();
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    const savedVoiceId = localStorage.getItem('voiceId');
    const savedSpeed = localStorage.getItem('speed');

    // Clear invalid cached voice ID
    if (savedVoiceId && (savedVoiceId.includes('(') || savedVoiceId.length > 50)) {
      localStorage.removeItem('voiceId');
    } else if (savedVoiceId) {
      setSelectedVoiceId(savedVoiceId);
    }

    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    // Only save valid voice IDs
    if (selectedVoiceId && !selectedVoiceId.includes('(') && selectedVoiceId.length <= 50) {
      localStorage.setItem('voiceId', selectedVoiceId);
    }
  }, [selectedVoiceId]);

  useEffect(() => {
    localStorage.setItem('speed', speed.toString());
  }, [speed]);

  // Fetch voices function
  const fetchVoices = async () => {
    try {
      const effectiveApiKey = getEffectiveApiKey();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add API key to headers if available
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

        // Filter out voices without valid voice_id
        const validVoices = voicesList.filter((voice: any) =>
          voice && voice.voice_id && typeof voice.voice_id === 'string' && voice.voice_id.trim() !== ''
        );

        setVoices(validVoices);
      } else {
        // Handle 401 gracefully - this is expected when no API key is configured
        if (response.status === 401) {
          console.log('API key required - please configure your ElevenLabs API key');
        } else {
          console.warn('Voices API temporarily unavailable:', response.status);
        }
      }
    } catch (error) {
      console.error('Failed to fetch voices:', error);
    }
  };

  // Fetch voices on mount
  useEffect(() => {
    fetchVoices();
  }, []);

  // Calculate total characters
  const totalCharacters = lines.reduce((sum, line) => sum + line.text.length, 0);

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (file.type !== 'text/plain') {
      alert('Please upload a .txt file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const textLines = content.split('\n').filter(line => line.length > 0);

      const newLines: Line[] = textLines.map((text, index) => ({
        id: `line-${Date.now()}-${index}`,
        text: text.trim(),
        status: 'idle' as const,
      }));

      setLines(newLines);
    };
    reader.readAsText(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Generate audio for a single line
  const generateAudio = async (lineId: string) => {
    const line = lines.find(l => l.id === lineId);
    if (!line || !selectedVoiceId) {
      console.error('No line or voice ID selected');
      return;
    }

    // Validate voice_id format
    if (selectedVoiceId.includes('(') || selectedVoiceId.includes('-') || selectedVoiceId.length > 50) {
      console.error('Invalid voice ID format:', selectedVoiceId);
      alert('Please select a valid voice from the dropdown');
      return;
    }

    // Update line status to processing
    setLines(prev => prev.map(l =>
      l.id === lineId ? { ...l, status: 'processing' as const } : l
    ));

    try {
      const effectiveApiKey = getEffectiveApiKey();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add API key to headers if available
      if (effectiveApiKey) {
        headers['x-api-key'] = effectiveApiKey;
        console.log('Using custom API key for TTS request');
      } else {
        console.log('Using default API key for TTS request');
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: line.text,
          voiceId: selectedVoiceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const audioBlob = await response.blob();

      if (audioBlob.size === 0) {
        throw new Error('Received empty audio file');
      }

      // Ensure blob has correct MIME type
      const audioBlobWithCorrectType = new Blob([audioBlob], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlobWithCorrectType);

      // Update line with audio data
      setLines(prev => prev.map(l =>
        l.id === lineId ? { ...l, status: 'ready' as const, audioBlob: audioBlobWithCorrectType, audioUrl } : l
      ));
    } catch (error) {
      console.error('Failed to generate audio:', error);
      setLines(prev => prev.map(l =>
        l.id === lineId ? { ...l, status: 'error' as const, error: error instanceof Error ? error.message : 'Unknown error' } : l
      ));
    }
  };

  // Generate audio for all lines
  const generateAll = async () => {
    if (!selectedVoiceId || lines.length === 0) return;

    setIsGeneratingAll(true);

    // Process lines sequentially to avoid rate limiting
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip lines that are already ready or currently processing
      if (line.status === 'ready' || line.status === 'processing') {
        continue;
      }

      await generateAudio(line.id);

      // Add a small delay between requests to avoid rate limiting
      if (i < lines.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsGeneratingAll(false);
  };

  // Download all audio files as ZIP
  const downloadAll = async () => {
    const readyLines = lines.filter(line => line.status === 'ready' && line.audioBlob);

    if (readyLines.length === 0) {
      alert('No audio files ready for download');
      return;
    }

    try {
      const zip = new JSZip();

      readyLines.forEach((line, index) => {
        const lineNumber = String(index + 1).padStart(3, '0'); // 001, 002, ...
        zip.file(`line_${lineNumber}.mp3`, line.audioBlob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tts_audio_${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create ZIP file:', error);
      alert('Failed to create download file');
    }
  };

  // Clear all lines
  const clearAll = () => {
    if (lines.length === 0) return;

    if (confirm('Are you sure you want to clear all lines? This action cannot be undone.')) {
      // Clean up object URLs before clearing
      lines.forEach(line => {
        if (line.audioUrl) {
          URL.revokeObjectURL(line.audioUrl);
        }
      });

      setLines([]);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      lines.forEach(line => {
        if (line.audioUrl) {
          URL.revokeObjectURL(line.audioUrl);
        }
      });
    };
  }, [lines]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Text-to-Speech Dashboard
          </h1>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Left Column - Content Area */}
          <div className="space-y-6">
            {/* Upload Area */}
            {lines.length === 0 ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-cyan-primary bg-cyan-primary/5'
                    : 'border-border hover:border-border/80'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* File icon */}
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <div className="text-2xl text-muted-foreground">📄</div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Upload text file
                    </h2>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      Drag and drop a .txt file here or click the button below to start converting your text to audio.
                    </p>
                    <button className="bg-cyan-primary text-primary-foreground hover:bg-cyan-600 px-6 py-2 rounded-md font-medium transition-colors">
                      Upload .txt File
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {lines.map((line, index) => (
                  <LineItem
                    key={line.id}
                    line={line}
                    index={index}
                    onRegenerate={generateAudio}
                    onDelete={(lineId) => {
                      const lineToDelete = lines.find(l => l.id === lineId);
                      if (lineToDelete?.audioUrl) {
                        URL.revokeObjectURL(lineToDelete.audioUrl);
                      }
                      setLines(prev => prev.filter(l => l.id !== lineId));
                    }}
                    onPlay={() => {
                      // Play functionality is handled inside LineItem component
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Settings Sidebar */}
          <div className="space-y-6">
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
      </div>
    </div>
  );
}