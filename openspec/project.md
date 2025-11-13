# Project Context

## Purpose
TTS Web is a text-to-speech web application that converts text files into audio using the ElevenLabs API. The application enables line-by-line audio generation with individual playback controls, voice customization, and batch operations for efficient audio content creation.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Audio API**: ElevenLabs TTS API
- **Storage**: In-memory (session-based)
- **Archive Format**: JSZip for batch downloads

## Project Conventions

### Code Style
- Use TypeScript strict mode with explicit types
- Follow Next.js App Router conventions (app directory structure)
- Prefer functional components with hooks
- Use Tailwind utility classes for styling
- Keep components focused and single-purpose (SOLID principles)

### Architecture Patterns
- **API Routes**: Backend logic in `/app/api/*` for ElevenLabs integration
- **Server Components**: Default to server components, use 'use client' only when needed
- **State Management**: React hooks (useState, useEffect) for local state
- **Type Safety**: Centralized type definitions in `/types` directory
- **Error Handling**: Graceful degradation with user-friendly error messages

### Testing Strategy
- Manual testing during development
- Focus on API error handling and edge cases
- Validate audio generation across different browsers
- Test responsive design on mobile and desktop

### Git Workflow
- Feature branches from main
- Descriptive commit messages
- OpenSpec proposals for significant features

## Domain Context

### Text-to-Speech Workflow
1. User uploads .txt file
2. Content is split into lines (by newline characters)
3. Each line is sent individually to ElevenLabs TTS API
4. Audio blobs are stored in memory with line metadata
5. Users can play, regenerate, or download audio files

### ElevenLabs API
- Requires API key authentication
- Supports voice selection and speed control
- Character limits per request
- Rate limiting considerations
- Returns MP3 audio streams

### Audio Management
- In-memory storage clears on page refresh
- Each line maintains its own audio state
- Batch operations process lines sequentially
- ZIP archives for multiple file downloads

## Important Constraints
- **API Key Security**: ElevenLabs API key stored in environment variables (server-side only)
- **Browser Compatibility**: Web Audio API support required for playback
- **Memory Limits**: In-memory storage suitable for reasonable file sizes (< 1000 lines)
- **Rate Limiting**: Implement graceful handling of ElevenLabs API rate limits
- **Character Limits**: Display character count and warn if approaching API limits

## External Dependencies
- **ElevenLabs API**: Primary TTS service
  - Endpoint: https://api.elevenlabs.io/v1/
  - Model: eleven_multilingual_v2
  - Authentication: API key in headers
  - Voice listing and audio generation endpoints
- **JSZip**: Client-side ZIP file creation for batch downloads
- **Lucide React**: Icon library for UI elements
