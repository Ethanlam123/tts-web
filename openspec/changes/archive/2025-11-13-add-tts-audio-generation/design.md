# Design Document: TTS Audio Generation System

## Context
Building a modern web application for text-to-speech conversion using ElevenLabs API. The application must handle file uploads, manage audio generation state, and provide an intuitive UI for line-by-line audio control. This is a greenfield Next.js 16 project using React 19 and Tailwind CSS v4.

Key constraints:
- API key security (server-side only)
- In-memory storage (no persistence)
- Browser-based audio playback
- Rate limit considerations for third-party API

## Goals / Non-Goals

### Goals
- Enable efficient text-to-audio conversion with line-level granularity
- Provide intuitive UI matching the provided design mockup (screen.png)
- Support batch operations for productivity
- Ensure secure API key handling
- Implement responsive design for mobile and desktop
- Gracefully handle API errors and rate limits

### Non-Goals
- User authentication or multi-user support (placeholder buttons only)
- Persistent storage (database, localStorage for audio)
- Real-time collaboration
- Audio editing capabilities (trim, merge, effects)
- Support for non-.txt file formats
- Server-side audio storage or CDN integration

## Decisions

### 1. API Architecture: Next.js API Routes with ElevenLabs SDK
**Decision**: Use Next.js App Router API routes (`app/api/*`) with the official `@elevenlabs/elevenlabs-js` SDK for backend logic.

**Why**:
- Keeps API key server-side only (security)
- Official SDK provides TypeScript types and error handling
- Simplified API integration with method-based interface
- Leverages Next.js edge runtime capabilities
- Simple deployment (single codebase)
- Better reliability with SDK's built-in retry logic

**Alternatives Considered**:
- Direct REST API calls with fetch: More boilerplate, manual error handling, no type safety
- Separate backend service: Adds deployment complexity, unnecessary for this scope
- Client-side API calls: Exposes API key, not acceptable

**Implementation**:
```typescript
// /app/api/voices/route.ts
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export async function GET() {
  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  const voices = await elevenlabs.voices.getAll();
  return Response.json(voices);
}

// /app/api/tts/route.ts
export async function POST(request: Request) {
  const { text, voiceId } = await request.json();

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  const audio = await elevenlabs.textToSpeech.convert(voiceId, {
    text,
    modelId: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
  });

  // Convert stream to buffer and return
  const chunks = [];
  for await (const chunk of audio) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  return new Response(buffer, {
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}
```

### 2. State Management: React Hooks
**Decision**: Use useState and useEffect for local state management.

**Why**:
- Simple scope (single-page application)
- No complex state sharing across components
- React 19 improves hook performance
- Avoids external dependencies (Redux, Zustand)

**Alternatives Considered**:
- Redux/Zustand: Overkill for single-component state
- Context API: Unnecessary complexity for non-nested state

**State Structure**:
```typescript
interface AppState {
  lines: Line[]
  selectedVoiceId: string
  speed: number
  isGeneratingAll: boolean
  voices: Voice[]
}
```

### 3. Audio Storage: In-Memory Blobs
**Decision**: Store audio as Blob objects in React state.

**Why**:
- Simplest implementation for session-based usage
- No backend storage infrastructure needed
- Immediate playback without network requests
- User expectation: temporary workspace

**Alternatives Considered**:
- IndexedDB: User requested in-memory only
- Server storage: Adds complexity, not needed for MVP
- LocalStorage: Size limits (5-10MB) too restrictive for audio

**Trade-offs**:
- Data lost on refresh (acceptable per requirements)
- Memory constraints for very large files (mitigated by line-by-line approach)

### 4. UI Component Library: shadcn/ui
**Decision**: Use shadcn/ui for UI components.

**Why**:
- User requested
- Built on Radix UI primitives (accessible)
- Copy-paste components (no npm package bloat)
- Full customization with Tailwind CSS v4
- TypeScript-first design

**Components Needed**:
- Button (primary, secondary, destructive variants)
- Slider (speed control)
- Select (voice dropdown with descriptions)
- Progress indicator (character counter)
- Badge (status indicators)

### 5. UI Layout and Design: Two-Column Dark Theme Layout
**Decision**: Implement a two-column layout with dark theme matching the screen.png mockup.

**Why**:
- User provided specific design mockup to follow
- Two-column layout separates content from controls logically
- Dark theme reduces eye strain for prolonged use
- Consistent visual hierarchy guides user attention
- Professional appearance aligns with audio production tools

**Layout Structure**:
```
+----------------------------------------------------------+
| Header: AudioConverter | Dashboard | Upgrade | Avatar    |
+----------------------------------------------------------+
| Text-to-Speech Dashboard                                 |
+------------------+---------------------------------------+
|                  |  Settings & Controls                  |
| Upload Area /    |  - Voice Dropdown                     |
| Line List        |  - Speed Slider                       |
|                  |  - Generate All Button (cyan)         |
| 1. Line text...  |  - Download All Button (gray)         |
| 2. Line text...  |  - Clear All Button (red text)        |
| 3. Line text...  |  - Character Counter Progress         |
|                  |                                       |
+------------------+---------------------------------------+
```

**Color Palette** (from mockup):
- **Background**: Dark blue-black (#0f172a, slate-900)
- **Primary Accent**: Cyan/Blue (#06b6d4, cyan-500) for "Generate All", progress bars
- **Success**: Green (#22c55e, green-500) for "Ready" status
- **Warning**: Yellow/Orange (#f59e0b, amber-500) for "Generating..." status
- **Error**: Red (#ef4444, red-500) for error states, "Clear All"
- **Secondary**: Dark gray (#1e293b, slate-800) for "Download All"
- **Text**: White/light gray for primary text
- **Borders**: Subtle gray (#334155, slate-700) for dividers

**Key UI Elements**:
1. **Header**: Dark background with logo, navigation buttons, user avatar
2. **Upload Area**: Dashed border, file icon, centered text and button
3. **Line Items**: Numbered list with status dots, text, and action icons (regenerate, play, delete)
4. **Settings Sidebar**: Fixed width (~300-350px), dark background, stacked controls
5. **Voice Dropdown**: Shows format "Name (Accent, Gender)" like "Rachel (American, Female)"
6. **Buttons**: Full-width in sidebar, icon + text, clear visual hierarchy
7. **Character Counter**: Progress bar with fraction display "1,254 / 10,000"

**Alternatives Considered**:
- Single-column layout: Less efficient use of space on larger screens
- Light theme: Not aligned with user's design mockup
- Three-column layout: Overcomplicated for the features needed

**Implementation**:
- Use Tailwind CSS v4 utility classes for styling
- Responsive: Stack columns vertically on mobile (<1024px)
- Component structure: Header, UploadArea, LineList, SettingsSidebar
- Icons from lucide-react for consistency

### 6. Status Indicators: Colored Dots with Text
**Decision**: Use colored status dots with descriptive text to indicate line processing state.

**Why**:
- Clear visual feedback at a glance
- Color-coded system is intuitive (green=success, yellow=processing, red=error)
- Text labels provide accessibility for color-blind users
- Matches industry-standard design patterns

**Status States** (from mockup):
1. **Idle**: No indicator shown, ready to generate
2. **Processing**: Yellow/orange dot + "Generating..." text
3. **Ready**: Green dot + "Ready" text
4. **Error**: Red dot + "Error - failed to generate" text

**Implementation**:
- Use Badge component from shadcn/ui
- Combine dot (filled circle) + text label
- Position inline with line text
- Animate processing state (pulsing or spinning)

### 7. Batch Processing: Sequential Queue
**Decision**: Process "Generate All" sequentially, one line at a time.

**Why**:
- Respects API rate limits
- Predictable progress tracking
- Prevents overwhelming browser memory
- Easier error recovery per line

**Alternatives Considered**:
- Parallel requests: Risk rate limiting and browser memory issues
- Batch API endpoint: ElevenLabs doesn't support this

**Implementation**:
```typescript
async function generateAll() {
  for (const line of lines) {
    await generateAudio(line.id)
    updateProgress(line.id)
  }
}
```

### 6. Download Format: ZIP Archive
**Decision**: Use JSZip to create downloadable ZIP of individual audio files.

**Why**:
- User requested ZIP format
- Preserves line numbering (`line_001.mp3`, `line_002.mp3`)
- Client-side generation (no server storage)
- Widely supported format

**Alternatives Considered**:
- Merged audio file: More complex (audio encoding), less flexible for users
- Both options: Unnecessary complexity for MVP

### 7. Speed Control Implementation: HTMLAudioElement.playbackRate
**Decision**: Use native `playbackRate` API for speed adjustment.

**Why**:
- Browser-native, no libraries needed
- Real-time adjustment without re-encoding
- Consistent across browsers
- Maintains audio pitch quality

**Alternatives Considered**:
- Web Audio API: More complex, unnecessary for simple speed control
- Request different speeds from ElevenLabs: Multiple API calls, wasteful

### 12. Type Definitions: Centralized Types
**Decision**: Create `/types/index.ts` for shared type definitions.

**Why**:
- Single source of truth
- Reusable across components and API routes
- TypeScript strict mode enforcement
- Easy to maintain and extend

**Key Types**:
```typescript
interface Voice {
  voice_id: string
  name: string
  labels?: Record<string, string>
}

interface Line {
  id: string
  text: string
  audioBlob?: Blob
  status: 'idle' | 'processing' | 'ready' | 'error'
  error?: string
}

interface AppSettings {
  voiceId: string
  speed: number
}
```

### 13. ElevenLabs TTS Model: eleven_multilingual_v2
**Decision**: Use `eleven_multilingual_v2` model for all text-to-speech generation.

**Why**:
- Multilingual support for 32 languages (English, Spanish, French, German, Chinese, Japanese, etc.)
- High-quality, natural-sounding speech
- Production-ready stability as the default model
- Well-documented and widely used
- Supports all standard ElevenLabs features
- 44.1kHz sample rate at 128kbps provides high-quality audio

**Alternatives Considered**:
- `eleven_monolingual_v1`: Limited to English only, less flexible, deprecated
- `eleven_turbo_v2_5`: Faster (low latency) but potentially lower quality, better for real-time streaming
- `eleven_flash_v2_5`: Ultra-low latency but optimized for speed over quality
- Default model (not specified): Not explicit, harder to maintain

**Implementation**:
```typescript
const audio = await elevenlabs.textToSpeech.convert(voiceId, {
  text: lineText,
  modelId: 'eleven_multilingual_v2',
  outputFormat: 'mp3_44100_128', // 44.1kHz, 128kbps
});
```

**Audio Format**: `mp3_44100_128`
- MP3 format for wide compatibility
- 44.1kHz sample rate (CD quality)
- 128kbps bitrate (high quality, reasonable file size)
- Supported formats: mp3, pcm, ulaw, alaw, opus

## Risks / Trade-offs

### Risk: API Rate Limiting
**Mitigation**:
- Sequential processing with delays between requests
- Display clear error messages when rate limited
- Allow regeneration of failed lines

### Risk: Browser Memory Exhaustion
**Mitigation**:
- Recommend file size limits (< 1000 lines)
- Display character counter
- "Clear All" button to free memory
- In-memory blobs are automatically garbage collected

### Risk: ElevenLabs API Changes
**Mitigation**:
- Abstract API calls in separate functions
- Error handling for unexpected responses
- Version API endpoint if needed in future

### Trade-off: No Persistence
**Impact**: Users lose work on page refresh
**Justification**: User requirement, acceptable for MVP use case

### Trade-off: Sequential Processing
**Impact**: Slower than parallel for large files
**Justification**: Necessary for rate limit compliance and reliability

## Migration Plan

### Phase 1: Foundation (Day 1)
1. Install dependencies (jszip, lucide-react, shadcn/ui CLI)
2. Configure environment variables (.env.local)
3. Create type definitions
4. Set up shadcn/ui components

### Phase 2: Backend (Day 1)
1. Implement `/app/api/voices/route.ts`
2. Implement `/app/api/tts/route.ts`
3. Test API routes with Postman/curl

### Phase 3: Frontend Core (Day 2)
1. File upload UI and parsing logic
2. Line display with numbering
3. Voice selection dropdown
4. Speed control slider

### Phase 4: Audio Features (Day 2-3)
1. Single line audio generation
2. Audio player components
3. Regenerate functionality
4. "Generate All" batch processing

### Phase 5: Batch Operations (Day 3)
1. "Download All" with JSZip
2. "Clear All" functionality
3. Progress tracking UI

### Phase 6: Polish (Day 3-4)
1. Error handling and user feedback
2. Loading states and animations
3. Responsive design adjustments
4. LocalStorage for preferences (voice, speed)

### Rollback Plan
- Simple rollback: Revert to default Next.js starter
- No database migrations or external state to manage

## Open Questions

1. **Character limit per line**: Should we enforce ElevenLabs API character limits client-side?
   - **Resolution**: Display character counter and warn if approaching limits

2. **Voice preview**: Should users be able to preview voices before selecting?
   - **Resolution**: Defer to future enhancement (requires sample audio)

3. **File size limits**: What's the recommended maximum file size?
   - **Resolution**: Recommend < 1000 lines, display warning for larger files

4. **Retry logic**: Should failed generations automatically retry?
   - **Resolution**: No auto-retry, provide manual regenerate button per line
