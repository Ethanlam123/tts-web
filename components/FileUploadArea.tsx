'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Line } from '@/types';

interface FileUploadAreaProps {
  onFilesLoaded: (lines: Line[]) => void;
}

export default function FileUploadArea({ onFilesLoaded }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((file: File) => {
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

      onFilesLoaded(newLines);
    };
    reader.readAsText(file);
  }, [onFilesLoaded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      className={`
        relative overflow-hidden
        border-2 border-dashed rounded-2xl p-12 text-center
        transition-all duration-300 ease-out cursor-pointer
        ${isDragging
          ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10'
          : 'border-border/60 hover:border-primary/50 hover:bg-accent/30'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex flex-col items-center space-y-6">
        {/* Icon container with glassmorphism */}
        <div className={`
          w-20 h-20 rounded-2xl
          bg-gradient-to-br from-primary/10 to-primary/5
          backdrop-blur-sm border border-primary/20
          flex items-center justify-center
          transition-all duration-300
          ${isDragging ? 'scale-110 rotate-3' : 'group-hover:scale-105'}
        `}>
          {isDragging ? (
            <Upload className="w-10 h-10 text-primary animate-bounce" />
          ) : (
            <FileText className="w-10 h-10 text-primary/70" />
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">
            Upload text file
          </h2>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Drag and drop a .txt file here or click to browse. Each line will be converted to audio.
          </p>
        </div>

        <button
          type="button"
          className="
            relative overflow-hidden
            bg-primary text-primary-foreground
            hover:bg-primary/90
            px-8 py-3 rounded-xl font-medium
            transition-all duration-200
            shadow-lg shadow-primary/25
            hover:shadow-xl hover:shadow-primary/30
            hover:-translate-y-0.5
            active:translate-y-0
          "
        >
          <span className="relative z-10 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload .txt File
          </span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
