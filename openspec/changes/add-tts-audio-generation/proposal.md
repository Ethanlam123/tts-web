# Change: Add Text-to-Speech Audio Generation System

## Why
Users need a web-based tool to convert text files into audio for content creation, accessibility, and multimedia production. The application should provide granular control over audio generation with line-by-line processing, voice customization, and batch operations to enable efficient workflows.

## What Changes
- **Text-to-Speech Integration**: Connect to ElevenLabs API using the official @elevenlabs/elevenlabs-js SDK for high-quality audio generation with the eleven_multilingual_v2 model, voice selection, and speed control
- **File Upload System**: Accept .txt files with drag-and-drop support, parse content by newlines, and display with line numbers
- **Line-by-Line Audio Generation**: Generate audio for individual lines with progress tracking and regeneration capabilities
- **Audio Playback Controls**: Embed HTML5 audio players for each line with play/pause functionality
- **Voice Management**: Fetch available voices from ElevenLabs API, display voice selection UI, and persist user preferences
- **Speed Control**: Implement adjustable playback speed (0.5x to 2.0x) with live slider controls
- **Batch Operations**:
  - Generate All: Process all lines sequentially with queue management
  - Download All: Create ZIP archive of individual audio files
  - Clear All: Reset application state
- **Settings Panel**: Display voice dropdown, speed slider, character counter, and action buttons
- **UI Components**: Modern dark-themed interface using shadcn/ui components with responsive design
- **State Management**: In-memory storage for audio blobs with React hooks for state management
- **Error Handling**: Graceful API error handling, rate limit management, and user-friendly error messages

## Impact

### Affected Specs
- **text-to-speech** (NEW): Core TTS functionality including API integration, voice selection, and audio generation
- **file-management** (NEW): File upload, parsing, and validation
- **audio-management** (NEW): Audio playback, storage, and download operations
- **ui-components** (NEW): User interface components, layout, dark theme, and responsive design matching screen.png mockup

### Affected Code
- `app/page.tsx`: Complete rewrite for TTS dashboard UI
- `app/api/voices/route.ts`: New API route using ElevenLabs SDK to fetch voices
- `app/api/tts/route.ts`: New API route using ElevenLabs SDK to generate audio
- `types/index.ts`: New type definitions for Voice, Line, AppSettings
- `components/ui/*`: shadcn/ui components for buttons, sliders, inputs, etc.
- `.env.local`: Environment configuration for ELEVENLABS_API_KEY
- `package.json`: Add dependencies (@elevenlabs/elevenlabs-js, jszip, lucide-react, shadcn/ui)
- `app/globals.css`: Custom styling for dark theme and audio players

### Technical Considerations
- API key must be stored server-side only (Next.js API routes)
- In-memory storage means data is lost on page refresh
- Sequential processing prevents API rate limit issues
- Browser compatibility for Web Audio API required
- File size limits recommended for memory management
