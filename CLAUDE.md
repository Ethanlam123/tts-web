<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

---

# TTS Web Application - Development Guidelines

## Project Overview

AudioConverter is a Next.js-based text-to-speech web application that converts text files into high-quality audio using the ElevenLabs API. The application provides line-by-line audio generation with granular control over voice selection, playback speed, and batch operations.

**Key Features:**
- Line-by-line TTS generation with individual controls
- Voice selection from ElevenLabs library
- Adjustable playback speed (0.5x - 2.0x)
- Batch operations (Generate All, Download All as ZIP)
- Real-time character counting
- Light theme UI matching screen.png design mockup

## Technology Stack

### Core Framework
- **Next.js 16** (App Router) - Server and client components
- **React 19** - Latest with improved hooks
- **TypeScript** (strict mode) - Type safety throughout

### Styling & UI
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Accessible component primitives (Radix UI)
- **lucide-react** - Icon library

### Audio & APIs
- **@elevenlabs/elevenlabs-js** - Official SDK for TTS
- **eleven_multilingual_v2** - Primary TTS model (32 languages)
- **jszip** - Client-side ZIP file creation

### State Management
- React hooks (useState, useEffect, useCallback)
- No external state management library needed

## ElevenLabs API Integration

### API Key Management

The application supports a **hybrid API key approach**:

#### Server-Side API Keys (Default)
```typescript
// ✅ CORRECT - Server-side only
// app/api/tts/route.ts
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY, // Server environment variable
});
```

#### Client-Side API Keys (User Configured)
```typescript
// ✅ CORRECT - User-configured client keys
// app/api/tts/route.ts
export async function POST(request: Request) {
  // Get API key from headers or fallback to environment variable
  const apiKey = request.headers.get('x-api-key') || process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is required. Please configure your ElevenLabs API key in settings.' },
      { status: 401 }
    );
  }

  const elevenlabs = new ElevenLabsClient({ apiKey });
  // ... rest of implementation
}
```

#### API Key Manager Usage
```typescript
import { apiKeyManager, getEffectiveApiKey, getApiKeyStatus } from '@/lib/api-key-manager';

// Get current API key (client-first, server fallback)
const effectiveApiKey = getEffectiveApiKey();

// Check API key status
const status = getApiKeyStatus(); // 'default' | 'custom' | 'none'

// Store user API key
await apiKeyManager.storeApiKey('sk_user_api_key_here');

// Clear user API key
apiKeyManager.clearStoredApiKey();
```

### Security Best Practices
```typescript
// ❌ WRONG - Never expose API key client-side
const apiKey = "sk_..."; // Never hardcode in client components

// ❌ WRONG - Don't log API keys
console.log('API Key:', apiKey); // NEVER log actual keys

// ✅ CORRECT - Use headers for transmission
const headers = { 'x-api-key': apiKey, 'Content-Type': 'application/json' };

// ✅ CORRECT - SSR-safe localStorage access
const getStoredApiKey = (): string | null => {
  try {
    if (typeof window === 'undefined') return null; // SSR check
    return localStorage.getItem('apiKey');
  } catch (error) {
    console.error('Failed to retrieve API key:', error);
    return null;
  }
};
```

### SDK Usage Patterns

**Fetch Voices:**
```typescript
// app/api/voices/route.ts
export async function GET() {
  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  const voices = await elevenlabs.voices.getAll();
  return Response.json({ voices: voices.voices });
}
```

**Generate Audio:**
```typescript
// app/api/tts/route.ts
export async function POST(request: Request) {
  const { text, voiceId } = await request.json();

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  const audio = await elevenlabs.textToSpeech.convert(voiceId, {
    text,
    modelId: 'eleven_multilingual_v2',      // Always use multilingual v2
    outputFormat: 'mp3_44100_128',          // High quality: 44.1kHz, 128kbps
  });

  // Convert stream to buffer
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

### Model Configuration
- **Always use**: `eleven_multilingual_v2` (default, 32 languages)
- **Output format**: `mp3_44100_128` (CD quality, web-optimized)
- **Never use**: Deprecated v1 models or unspecified defaults

### Error Handling
```typescript
try {
  const audio = await elevenlabs.textToSpeech.convert(voiceId, options);
  // Process audio
} catch (error) {
  // Check for rate limiting
  if (error.status === 429) {
    return Response.json(
      { error: 'Rate limit exceeded. Please try again shortly.' },
      { status: 429 }
    );
  }

  // Generic error
  return Response.json(
    { error: 'Failed to generate audio. Please try again.' },
    { status: 500 }
  );
}
```

## UI/UX Design Conventions

### Color Palette (from screen.png)
```typescript
// Tailwind classes to use consistently:
const colors = {
  background: 'bg-slate-900',           // #0f172a - Main background
  primary: 'bg-cyan-500',               // #06b6d4 - Generate All, progress bars
  success: 'text-green-500',            // #22c55e - "Ready" status
  warning: 'text-amber-500',            // #f59e0b - "Generating..." status
  error: 'text-red-500',                // #ef4444 - Error states, Clear All
  secondary: 'bg-slate-800',            // #1e293b - Download All
  border: 'border-slate-700',           // #334155 - Dividers, borders
};
```

### Component Layout Structure
```
app/page.tsx
├── Header (AudioConverter logo, Key icon for API status)
├── Main Container (grid lg:grid-cols-[1fr_350px])
│   ├── Left Column (Content Area)
│   │   ├── Page Title ("Text-to-Speech Dashboard")
│   │   ├── UploadArea (dashed border, file icon, instructions)
│   │   └── LineList
│   │       └── LineItem[]
│   │           ├── Line number
│   │           ├── Line text
│   │           ├── StatusBadge (colored dot + text)
│   │           └── Action buttons (regenerate, play, delete)
│   └── Right Column (Settings Sidebar - fixed 300-350px)
│       ├── API Configuration Section (status indicator + configure button)
│       ├── Voice Dropdown ("Rachel (American, Female)")
│       ├── Speed Slider (0.5x - 2.0x)
│       ├── Generate All Button (cyan, Sparkles icon)
│       ├── Download All Button (gray, Download icon)
│       ├── Clear All Button (red text, Trash icon)
│       └── Character Counter (text count, no progress bar)
```

### Status Indicators
```typescript
// Use these exact status values:
type LineStatus = 'idle' | 'processing' | 'ready' | 'error';

// Visual representation:
const statusConfig = {
  idle: { show: false },
  processing: { dot: 'bg-amber-500', text: 'Generating...' },
  ready: { dot: 'bg-green-500', text: 'Ready' },
  error: { dot: 'bg-red-500', text: 'Error - failed to generate' },
};
```

### shadcn/ui Components to Use
- **Button** - Primary actions, icon buttons
- **Select** - Voice dropdown
- **Slider** - Speed control
- **Progress** - Character counter
- **Badge** - Status indicators

### Icon Usage (lucide-react)
```typescript
import {
  FileText,      // Upload area
  Sparkles,      // Generate All
  Download,      // Download All
  Trash2,        // Clear All, delete line
  RotateCw,      // Regenerate line
  Play,          // Play audio
  Key,           // API key icon in header
  Shield,        // API security icon
  Check,         // Success indicator
  X,            // Close/delete
  ExternalLink,  // Documentation links
} from 'lucide-react';
```

## File Organization

```
tts-web/
├── app/
│   ├── api/
│   │   ├── voices/route.ts        # GET - Fetch ElevenLabs voices
│   │   └── tts/route.ts           # POST - Generate audio
│   ├── layout.tsx                 # Root layout with fonts
│   ├── page.tsx                   # Main dashboard (client component)
│   └── globals.css                # Tailwind + custom light theme
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx     # API key status dropdown
│   │   ├── dialog.tsx             # API key configuration dialog
│   │   ├── tabs.tsx               # API key help tabs
│   │   ├── alert.tsx              # Status and error messages
│   │   └── input.tsx              # API key input field
│   ├── Header.tsx                 # App header with API key status
│   ├── ApiKeyInput.tsx            # API key configuration component
│   ├── UploadArea.tsx             # File upload zone
│   ├── LineItem.tsx               # Individual line display
│   ├── StatusBadge.tsx            # Status indicator
│   ├── SettingsSidebar.tsx        # Right sidebar
│   └── CharacterCounter.tsx       # Text counter (no progress bar)
├── lib/
│   └── api-key-manager.ts         # API key management utilities
├── types/
│   └── index.ts                   # Shared TypeScript types
├── openspec/                      # Specifications and documentation
│   ├── project.md
│   ├── changes/
│   │   ├── user-api-key/          # User API key management
│   │   └── add-tts-audio-generation/
│   └── specs/
│       ├── api-management/        # API key management specs
│       └── ui-components/         # UI component specs
├── .env.local                     # ELEVENLABS_API_KEY (not in git)
├── .env.example                   # Template for env vars
└── .gitignore                     # Git ignore file
```

## Type Definitions

**Always use these centralized types:**
```typescript
// types/index.ts

export interface Voice {
  voice_id: string;
  name: string;
  labels?: {
    accent?: string;
    gender?: string;
    age?: string;
  };
}

export interface Line {
  id: string;
  text: string;
  audioBlob?: Blob;
  audioUrl?: string;
  status: 'idle' | 'processing' | 'ready' | 'error';
  error?: string;
}

export interface AppSettings {
  voiceId: string;
  speed: number;
}

export interface ApiKeyManager {
  storeApiKey: (apiKey: string) => void;
  getStoredApiKey: () => string | null;
  clearStoredApiKey: () => void;
  validateApiKeyFormat: (apiKey: string) => boolean;
  testApiKey: (apiKey: string) => Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: string;
}

export type ApiKeyStatus = 'default' | 'custom' | 'none';
```

## State Management Patterns

### Main Dashboard State
```typescript
'use client';

export default function Dashboard() {
  // File & Lines
  const [lines, setLines] = useState<Line[]>([]);

  // Voice & Settings
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [speed, setSpeed] = useState<number>(1.0);

  // UI State
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedVoiceId = localStorage.getItem('voiceId');
    const savedSpeed = localStorage.getItem('speed');
    if (savedVoiceId) setSelectedVoiceId(savedVoiceId);
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (selectedVoiceId) localStorage.setItem('voiceId', selectedVoiceId);
  }, [selectedVoiceId]);

  useEffect(() => {
    localStorage.setItem('speed', speed.toString());
  }, [speed]);
}
```

### Audio Object URL Management
```typescript
// ✅ CORRECT - Clean up object URLs
useEffect(() => {
  const urls = lines
    .filter(line => line.audioUrl)
    .map(line => line.audioUrl!);

  return () => {
    urls.forEach(url => URL.revokeObjectURL(url));
  };
}, [lines]);

// When creating audio URL:
const audioUrl = URL.createObjectURL(audioBlob);
setLines(prev => prev.map(line =>
  line.id === lineId ? { ...line, audioUrl, audioBlob } : line
));
```

## Common Patterns

### Sequential Batch Processing
```typescript
async function generateAll() {
  setIsGeneratingAll(true);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.status === 'ready') continue; // Skip already generated

    try {
      await generateAudio(line.id);
      // Update progress: `Line ${i + 1}/${lines.length} processing...`
    } catch (error) {
      console.error(`Failed to generate line ${i + 1}:`, error);
      // Continue with next line
    }
  }

  setIsGeneratingAll(false);
}
```

### ZIP Download Creation
```typescript
import JSZip from 'jszip';

async function downloadAll() {
  const zip = new JSZip();

  const readyLines = lines.filter(line => line.audioBlob);

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
}
```

### Voice Dropdown Formatting
```typescript
// Format: "Name (Accent, Gender)"
function formatVoiceName(voice: Voice): string {
  const parts = [voice.name];

  if (voice.labels?.accent || voice.labels?.gender) {
    const details = [
      voice.labels.accent,
      voice.labels.gender,
    ].filter(Boolean).join(', ');

    parts.push(`(${details})`);
  }

  return parts.join(' ');
}

// Example: "Rachel (American, Female)"
```

## Responsive Design

### Breakpoints
```typescript
// Tailwind breakpoints to use:
// - Mobile: < 1024px (stack vertically)
// - Desktop: >= 1024px (two-column)

<div className="grid lg:grid-cols-[1fr_350px] gap-6">
  <div>{/* Main content */}</div>
  <div>{/* Settings sidebar */}</div>
</div>
```

## Testing Approach

### Manual Testing Checklist
1. File upload (small, medium, large .txt files)
2. Voice selection and persistence
3. Speed control with audio playback
4. Single line generation
5. Batch "Generate All" with progress
6. "Download All" ZIP creation
7. "Clear All" confirmation
8. Error handling (invalid file, API errors, rate limits)
9. Responsive layout (mobile, tablet, desktop)
10. Browser compatibility (Chrome, Firefox, Safari)

## Common Pitfalls to Avoid

### ❌ DON'T
```typescript
// Don't expose API key client-side
const elevenlabs = new ElevenLabsClient({
  apiKey: 'sk_...' // NEVER in client components
});

// Don't forget to clean up object URLs
// (Causes memory leaks)

// Don't use deprecated v1 models
modelId: 'eleven_monolingual_v1'

// Don't process lines in parallel
// (Causes rate limiting)
await Promise.all(lines.map(line => generateAudio(line)));
```

### ✅ DO
```typescript
// Keep API calls server-side
// app/api/tts/route.ts

// Clean up object URLs
useEffect(() => {
  return () => urls.forEach(url => URL.revokeObjectURL(url));
}, []);

// Use multilingual v2 model
modelId: 'eleven_multilingual_v2'

// Process lines sequentially
for (const line of lines) {
  await generateAudio(line);
}
```

## Performance Considerations

- **In-memory storage**: Acceptable for < 1000 lines
- **Sequential processing**: Prevents API rate limits
- **Character limit**: Warn at 8,000, max 10,000
- **Audio format**: MP3 at 44.1kHz/128kbps for balance of quality and size

## Environment Variables

```bash
# .env.local (DO NOT COMMIT)
ELEVENLABS_API_KEY=sk_your_actual_api_key_here

# .env.example (COMMIT THIS)
ELEVENLABS_API_KEY=
```

## Git Commit Conventions

- **feat**: New feature (e.g., "feat: add voice selection dropdown")
- **fix**: Bug fix (e.g., "fix: resolve audio playback race condition")
- **ui**: UI/styling changes (e.g., "ui: match status badge colors to mockup")
- **refactor**: Code restructuring (e.g., "refactor: extract LineItem component")
- **docs**: Documentation (e.g., "docs: update CLAUDE.md with API patterns")

---

## Quick Reference

**Start Development:**
```bash
npm install
cp .env.example .env.local
# Add your ELEVENLABS_API_KEY to .env.local
npm run dev
```

**Add shadcn/ui Component:**
```bash
npx shadcn@latest add button
npx shadcn@latest add select
npx shadcn@latest add slider
```

**View OpenSpec:**
```bash
openspec show add-tts-audio-generation
openspec list --specs
```

---

For detailed specifications, see `openspec/changes/add-tts-audio-generation/`