# Implementation Tasks

## 1. Environment Setup ✅
- [x] 1.1 Install ElevenLabs SDK: npm install @elevenlabs/elevenlabs-js
- [x] 1.2 Install dependencies: npm install jszip lucide-react
- [x] 1.3 Initialize shadcn/ui CLI: npx shadcn@latest init
- [x] 1.4 Configure components.json with Tailwind CSS v4 settings
- [x] 1.5 Create .env.local with ELEVENLABS_API_KEY=sk_668f22bfbf737089e1c0650373ce11a8d57cafbf299a5b82
- [x] 1.6 Create .env.example template with ELEVENLABS_API_KEY=
- [x] 1.7 Verify .env.local is in .gitignore

## 2. Type Definitions ✅
- [x] 2.1 Create types/index.ts file
- [x] 2.2 Define Voice interface
- [x] 2.3 Define Line interface with status types
- [x] 2.4 Define AppSettings interface
- [x] 2.5 Export all types

## 3. shadcn/ui Components ✅
- [x] 3.1 Install Button component (npx shadcn@latest add button)
- [x] 3.2 Install Slider component (npx shadcn@latest add slider)
- [x] 3.3 Install Select component (npx shadcn@latest add select)
- [x] 3.4 Install Progress component (npx shadcn@latest add progress)
- [x] 3.5 Install Badge component (npx shadcn@latest add badge)

## 4. API Routes ✅
- [x] 4.1 Create app/api/voices/route.ts
  - [x] 4.1.1 Import ElevenLabsClient from @elevenlabs/elevenlabs-js
  - [x] 4.1.2 Implement GET handler
  - [x] 4.1.3 Initialize client with apiKey from process.env.ELEVENLABS_API_KEY
  - [x] 4.1.4 Call await elevenlabs.voices.getAll() to fetch voices
  - [x] 4.1.5 Map voiceId to voice_id for frontend consistency
  - [x] 4.1.6 Return Response.json(mappedVoices) with 200 status
  - [x] 4.1.7 Add try-catch for error handling
  - [x] 4.1.8 Return 500 status with error message on failure
- [x] 4.2 Create app/api/tts/route.ts
  - [x] 4.2.1 Import ElevenLabsClient from @elevenlabs/elevenlabs-js
  - [x] 4.2.2 Implement POST handler with request: Request parameter
  - [x] 4.2.3 Parse request body: const { text, voiceId } = await request.json()
  - [x] 4.2.4 Validate text is non-empty and voiceId is provided
  - [x] 4.2.5 Return 400 status if validation fails
  - [x] 4.2.6 Initialize ElevenLabsClient with API key
  - [x] 4.2.7 Call elevenlabs.textToSpeech.convert(voiceId, { text, modelId: 'eleven_multilingual_v2', outputFormat: 'mp3_44100_128' })
  - [x] 4.2.8 Convert audio stream to buffer with enhanced error handling
  - [x] 4.2.9 Return new Response(buffer, { headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': buffer.length.toString() } })
  - [x] 4.2.10 Add comprehensive try-catch for stream processing
  - [x] 4.2.11 Check for empty audio data and stream errors
  - [x] 4.2.12 Return appropriate status codes (429 or 500) with error messages

## 5. UI Layout and Theme Setup ✅
- [x] 5.1 Update app/globals.css with dark theme variables
  - [x] 5.1.1 Define color palette (slate-900 bg, cyan-500 primary, etc.)
  - [x] 5.1.2 Set background colors for body and main containers
  - [x] 5.1.3 Define status color classes (green, yellow, red)
- [x] 5.2 Create Header component
  - [x] 5.2.1 Add "AudioConverter" logo/text on left
  - [x] 5.2.2 Add "Dashboard" placeholder button
  - [x] 5.2.3 Add "Upgrade" button with cyan styling
  - [x] 5.2.4 Add user avatar icon on right
  - [x] 5.2.5 Style with dark background and proper spacing
- [x] 5.3 Create main layout structure in app/page.tsx
  - [x] 5.3.1 Add 'use client' directive
  - [x] 5.3.2 Create two-column grid layout (content + sidebar)
  - [x] 5.3.3 Add "Text-to-Speech Dashboard" main heading
  - [x] 5.3.4 Set up responsive breakpoints (stack on mobile)

## 6. File Upload Feature ✅
- [x] 6.1 Create upload area component
  - [x] 6.1.1 Add dashed border container matching mockup
  - [x] 6.1.2 Add file icon from lucide-react
  - [x] 6.1.3 Add "Upload text file" heading
  - [x] 6.1.4 Add instruction text
  - [x] 6.1.5 Add "Upload .txt File" button
- [x] 6.2 Implement drag-and-drop functionality
  - [x] 6.2.1 Add onDragOver, onDragLeave, onDrop handlers
  - [x] 6.2.2 Add visual hover state (border color change)
  - [x] 6.2.3 Accept only .txt files via accept attribute
- [x] 6.3 Implement click-to-browse functionality
  - [x] 6.3.1 Add hidden file input element
  - [x] 6.3.2 Trigger file input on button click
  - [x] 6.3.3 Handle file selection via onChange
- [x] 6.4 Implement file parsing logic
  - [x] 6.4.1 Read file as text using FileReader
  - [x] 6.4.2 Split content by newlines (\n)
  - [x] 6.4.3 Create Line objects with unique IDs (uuid or index)
  - [x] 6.4.4 Initialize each line with status: 'idle'
  - [x] 6.4.5 Update state with parsed lines array

## 7. Line Display UI ✅
- [x] 7.1 Create LineItem component
  - [x] 7.1.1 Display line number (sequential, starting from 1)
  - [x] 7.1.2 Display line text content
  - [x] 7.1.3 Add status indicator (colored dot + text)
  - [x] 7.1.4 Add action buttons container on right
  - [x] 7.1.5 Style with proper spacing and borders
- [x] 7.2 Implement status badges
  - [x] 7.2.1 Create StatusBadge component
  - [x] 7.2.2 Show green dot + "Ready" for ready state
  - [x] 7.2.3 Show yellow dot + "Generating..." for processing state
  - [x] 7.2.4 Show red dot + "Error - failed to generate" for error state
  - [x] 7.2.5 Hide badge for idle state
- [x] 7.3 Add action icon buttons
  - [x] 7.3.1 Add regenerate/refresh icon button (lucide-react RotateCw)
  - [x] 7.3.2 Add play icon button (only when audio ready)
  - [x] 7.3.3 Add delete/trash icon button (lucide-react Trash2)
  - [x] 7.3.4 Style buttons with hover effects
  - [x] 7.3.5 Arrange horizontally on the right side

## 8. Settings Sidebar ✅
- [x] 8.1 Create SettingsSidebar component
  - [x] 8.1.1 Add "Settings & Controls" heading
  - [x] 8.1.2 Set fixed width (~300-350px)
  - [x] 8.1.3 Add dark background matching theme
  - [x] 8.1.4 Stack all controls vertically with spacing
- [x] 8.2 Create voice selection dropdown
  - [x] 8.2.1 Add "Default Voice" label
  - [x] 8.2.2 Fetch voices from /api/voices on mount
  - [x] 8.2.3 Display voices in format "Name (Accent, Gender)"
  - [x] 8.2.4 Use shadcn Select component
  - [x] 8.2.5 Add helper text below dropdown
  - [x] 8.2.6 Store selected voiceId in state
  - [x] 8.2.7 Load/save to localStorage
- [x] 8.3 Create speed slider control
  - [x] 8.3.1 Add "Playback Speed: 1.0x" label
  - [x] 8.3.2 Use shadcn Slider component
  - [x] 8.3.3 Set range: 0.5x to 2.0x, step 0.1
  - [x] 8.3.4 Display current value in label dynamically
  - [x] 8.3.5 Style slider track with cyan fill color
  - [x] 8.3.6 Store speed in state
  - [x] 8.3.7 Load/save to localStorage

## 9. Action Buttons in Sidebar ✅
- [x] 9.1 Create "Generate All" button
  - [x] 9.1.1 Use shadcn Button component with full width
  - [x] 9.1.2 Style with bright cyan background (bg-cyan-500)
  - [x] 9.1.3 Add sparkle/wand icon from lucide-react (Sparkles)
  - [x] 9.1.4 Add "Generate All" text
  - [x] 9.1.5 Disable when no lines or generating
- [x] 9.2 Create "Download All" button
  - [x] 9.2.1 Use shadcn Button component with full width
  - [x] 9.2.2 Style with dark gray background (bg-slate-800)
  - [x] 9.2.3 Add download icon from lucide-react (Download)
  - [x] 9.2.4 Add "Download All" text
  - [x] 9.2.5 Disable when no audio generated
- [x] 9.3 Create "Clear All" button
  - [x] 9.3.1 Use shadcn Button component with variant="ghost"
  - [x] 9.3.2 Style with red text color (text-red-500)
  - [x] 9.3.3 Add trash icon from lucide-react (Trash2)
  - [x] 9.3.4 Add "Clear All" text
  - [x] 9.3.5 Disable when no lines loaded

## 10. Character Counter ✅
- [x] 10.1 Create CharacterCounter component
  - [x] 10.1.1 Add "Character Count" label
  - [x] 10.1.2 Calculate total characters from all lines
  - [x] 10.1.3 Display in format "1,254 / 10,000"
  - [x] 10.1.4 Add progress bar below (shadcn Progress or custom)
  - [x] 10.1.5 Fill progress bar proportionally
  - [x] 10.1.6 Use cyan color for progress fill
  - [x] 10.1.7 Change to yellow/orange when > 8,000 characters
  - [x] 10.1.8 Update in real-time when lines change

## 11. Single Line Audio Generation ✅
- [x] 11.1 Create generateAudio function
  - [x] 11.1.1 Call /api/tts with line text, voiceId, speed
  - [x] 11.1.2 Update line status to 'processing'
  - [x] 11.1.3 Store audio blob in line state
  - [x] 11.1.4 Update line status to 'ready' on success
  - [x] 11.1.5 Update line status to 'error' on failure
- [x] 11.2 Add "Generate" button per line
- [x] 11.3 Show loading spinner during processing
- [x] 11.4 Display error message if generation fails

## 12. Audio Playback ✅
- [x] 12.1 Create audio player component for each line
- [x] 12.2 Use HTML5 <audio> element with controls
- [x] 12.3 Create object URL from audio blob
- [x] 12.4 Apply speed control via playbackRate
- [x] 12.5 Show player only when audio is ready
- [x] 12.6 Clean up object URLs on unmount (memory management)

## 13. Regenerate Functionality ✅
- [x] 13.1 Add "Regenerate" button per line
- [x] 13.2 Clear existing audio blob
- [x] 13.3 Reset line status to 'processing'
- [x] 13.4 Call generateAudio function
- [x] 13.5 Update UI to show new audio

## 14. Batch Operations ✅
- [x] 14.1 Generate All
  - [x] 14.1.1 Create generateAll function
  - [x] 14.1.2 Process lines sequentially with async/await
  - [x] 14.1.3 Display progress indicator (e.g., "Line 5/20 processing...")
  - [x] 14.1.4 Update global isGeneratingAll state
  - [x] 14.1.5 Disable Generate All button during processing
- [x] 14.2 Download All
  - [x] 14.2.1 Create downloadAll function
  - [x] 14.2.2 Filter lines with audio blobs
  - [x] 14.2.3 Create JSZip instance
  - [x] 14.2.4 Add files with naming: line_001.mp3, line_002.mp3
  - [x] 14.2.5 Generate ZIP blob
  - [x] 14.2.6 Trigger browser download
- [x] 14.3 Clear All
  - [x] 14.3.1 Create clearAll function
  - [x] 14.3.2 Reset lines state to empty array
  - [x] 14.3.3 Clear file input
  - [x] 14.3.4 Add confirmation dialog before clearing

## 15. Settings Panel ✅
- [x] 15.1 Create settings sidebar component
- [x] 15.2 Add voice dropdown
- [x] 15.3 Add speed slider with value display
- [x] 15.4 Add character counter (current/10,000)
- [x] 15.5 Add "Generate All" button (cyan/blue styling)
- [x] 15.6 Add "Download All" button (dark styling)
- [x] 15.7 Add "Clear All" button (red text styling)
- [x] 15.8 Make responsive (stack below content on mobile)

## 16. Character Counter ✅
- [x] 16.1 Calculate total characters from all lines
- [x] 16.2 Display count in format: "1,234 / 10,000"
- [x] 16.3 Add warning color if approaching limit
- [x] 16.4 Update counter in real-time as lines change

## 17. Header UI ✅
- [x] 17.1 Create header component with dark background
- [x] 17.2 Add logo/title on left
- [x] 17.3 Add "Dashboard" button (placeholder, non-functional)
- [x] 17.4 Add "Upgrade" button (placeholder, non-functional)
- [x] 17.5 Style to match screen.png design

## 18. Dark Theme Styling ✅
- [x] 18.1 Update app/globals.css with custom dark theme colors
- [x] 18.2 Style file upload area (dashed border, hover effects)
- [x] 18.3 Style line items (borders, spacing)
- [x] 18.4 Style status badges (colors per status)
- [x] 18.5 Style buttons (cyan primary, red destructive)
- [x] 18.6 Add loading animations
- [x] 18.7 Add hover effects

## 19. Responsive Design ✅
- [x] 19.1 Test on mobile viewport (375px width)
- [x] 19.2 Test on tablet viewport (768px width)
- [x] 19.3 Test on desktop viewport (1440px width)
- [x] 19.4 Ensure touch-friendly button sizes
- [x] 19.5 Adjust sidebar layout for mobile
- [x] 19.6 Verify audio players work on mobile browsers

## 20. Error Handling ✅
- [x] 20.1 Handle network errors (display user message)
- [x] 20.2 Handle API rate limit errors (show retry suggestion)
- [x] 20.3 Handle invalid file uploads (show file type error)
- [x] 20.4 Handle empty file uploads (prevent processing)
- [x] 20.5 Handle ElevenLabs API errors (display specific errors)
- [x] 20.6 Add try-catch blocks in all async functions

## 21. Loading States ✅
- [x] 21.1 Show spinner during voice fetch
- [x] 21.2 Show spinner per line during generation
- [x] 21.3 Show progress text during "Generate All"
- [x] 21.4 Disable buttons during processing
- [x] 21.5 Add loading overlay for blocking operations

## 22. Testing & Validation ✅
- [x] 22.1 Test with small .txt file (5 lines)
- [x] 22.2 Test with medium .txt file (50 lines)
- [x] 22.3 Test with large .txt file (500 lines)
- [x] 22.4 Test voice switching
- [x] 22.5 Test speed control across different values
- [x] 22.6 Test regenerate functionality
- [x] 22.7 Test "Generate All" with progress tracking
- [x] 22.8 Test "Download All" ZIP creation
- [x] 22.9 Test "Clear All" functionality
- [x] 22.10 Test error scenarios (invalid API key, network failure)
- [x] 22.11 Test on Chrome, Firefox, Safari
- [x] 22.12 Test responsive design on mobile devices
