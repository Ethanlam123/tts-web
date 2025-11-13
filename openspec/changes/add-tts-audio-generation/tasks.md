# Implementation Tasks

## 1. Environment Setup
- [ ] 1.1 Install ElevenLabs SDK: npm install @elevenlabs/elevenlabs-js
- [ ] 1.2 Install dependencies: npm install jszip lucide-react
- [ ] 1.3 Initialize shadcn/ui CLI: npx shadcn@latest init
- [ ] 1.4 Configure components.json with Tailwind CSS v4 settings
- [ ] 1.5 Create .env.local with ELEVENLABS_API_KEY=your_api_key_here
- [ ] 1.6 Create .env.example template with ELEVENLABS_API_KEY=
- [ ] 1.7 Verify .env.local is in .gitignore

## 2. Type Definitions
- [ ] 2.1 Create types/index.ts file
- [ ] 2.2 Define Voice interface
- [ ] 2.3 Define Line interface with status types
- [ ] 2.4 Define AppSettings interface
- [ ] 2.5 Export all types

## 3. shadcn/ui Components
- [ ] 3.1 Install Button component (npx shadcn@latest add button)
- [ ] 3.2 Install Slider component (npx shadcn@latest add slider)
- [ ] 3.3 Install Select component (npx shadcn@latest add select)
- [ ] 3.4 Install Progress component (npx shadcn@latest add progress)
- [ ] 3.5 Install Badge component (npx shadcn@latest add badge)

## 4. API Routes
- [ ] 4.1 Create app/api/voices/route.ts
  - [ ] 4.1.1 Import ElevenLabsClient from @elevenlabs/elevenlabs-js
  - [ ] 4.1.2 Implement GET handler
  - [ ] 4.1.3 Initialize client with apiKey from process.env.ELEVENLABS_API_KEY
  - [ ] 4.1.4 Call await elevenlabs.voices.getAll() to fetch voices
  - [ ] 4.1.5 Return Response.json(voices) with 200 status
  - [ ] 4.1.6 Add try-catch for error handling
  - [ ] 4.1.7 Return 500 status with error message on failure
- [ ] 4.2 Create app/api/tts/route.ts
  - [ ] 4.2.1 Import ElevenLabsClient from @elevenlabs/elevenlabs-js
  - [ ] 4.2.2 Implement POST handler with request: Request parameter
  - [ ] 4.2.3 Parse request body: const { text, voiceId } = await request.json()
  - [ ] 4.2.4 Validate text is non-empty and voiceId is provided
  - [ ] 4.2.5 Return 400 status if validation fails
  - [ ] 4.2.6 Initialize ElevenLabsClient with API key
  - [ ] 4.2.7 Call elevenlabs.textToSpeech.convert(voiceId, { text, modelId: 'eleven_multilingual_v2', outputFormat: 'mp3_44100_128' })
  - [ ] 4.2.8 Convert audio stream to buffer (iterate and concat chunks)
  - [ ] 4.2.9 Return new Response(buffer, { headers: { 'Content-Type': 'audio/mpeg' } })
  - [ ] 4.2.10 Add try-catch for error handling
  - [ ] 4.2.11 Check for rate limit errors (status 429)
  - [ ] 4.2.12 Return appropriate status codes (429 or 500) with error messages

## 5. UI Layout and Theme Setup
- [ ] 5.1 Update app/globals.css with dark theme variables
  - [ ] 5.1.1 Define color palette (slate-900 bg, cyan-500 primary, etc.)
  - [ ] 5.1.2 Set background colors for body and main containers
  - [ ] 5.1.3 Define status color classes (green, yellow, red)
- [ ] 5.2 Create Header component
  - [ ] 5.2.1 Add "AudioConverter" logo/text on left
  - [ ] 5.2.2 Add "Dashboard" placeholder button
  - [ ] 5.2.3 Add "Upgrade" button with cyan styling
  - [ ] 5.2.4 Add user avatar icon on right
  - [ ] 5.2.5 Style with dark background and proper spacing
- [ ] 5.3 Create main layout structure in app/page.tsx
  - [ ] 5.3.1 Add 'use client' directive
  - [ ] 5.3.2 Create two-column grid layout (content + sidebar)
  - [ ] 5.3.3 Add "Text-to-Speech Dashboard" main heading
  - [ ] 5.3.4 Set up responsive breakpoints (stack on mobile)

## 6. File Upload Feature
- [ ] 6.1 Create upload area component
  - [ ] 6.1.1 Add dashed border container matching mockup
  - [ ] 6.1.2 Add file icon from lucide-react
  - [ ] 6.1.3 Add "Upload text file" heading
  - [ ] 6.1.4 Add instruction text
  - [ ] 6.1.5 Add "Upload .txt File" button
- [ ] 6.2 Implement drag-and-drop functionality
  - [ ] 6.2.1 Add onDragOver, onDragLeave, onDrop handlers
  - [ ] 6.2.2 Add visual hover state (border color change)
  - [ ] 6.2.3 Accept only .txt files via accept attribute
- [ ] 6.3 Implement click-to-browse functionality
  - [ ] 6.3.1 Add hidden file input element
  - [ ] 6.3.2 Trigger file input on button click
  - [ ] 6.3.3 Handle file selection via onChange
- [ ] 6.4 Implement file parsing logic
  - [ ] 6.4.1 Read file as text using FileReader
  - [ ] 6.4.2 Split content by newlines (\n)
  - [ ] 6.4.3 Create Line objects with unique IDs (uuid or index)
  - [ ] 6.4.4 Initialize each line with status: 'idle'
  - [ ] 6.4.5 Update state with parsed lines array

## 7. Line Display UI
- [ ] 7.1 Create LineItem component
  - [ ] 7.1.1 Display line number (sequential, starting from 1)
  - [ ] 7.1.2 Display line text content
  - [ ] 7.1.3 Add status indicator (colored dot + text)
  - [ ] 7.1.4 Add action buttons container on right
  - [ ] 7.1.5 Style with proper spacing and borders
- [ ] 7.2 Implement status badges
  - [ ] 7.2.1 Create StatusBadge component
  - [ ] 7.2.2 Show green dot + "Ready" for ready state
  - [ ] 7.2.3 Show yellow dot + "Generating..." for processing state
  - [ ] 7.2.4 Show red dot + "Error - failed to generate" for error state
  - [ ] 7.2.5 Hide badge for idle state
- [ ] 7.3 Add action icon buttons
  - [ ] 7.3.1 Add regenerate/refresh icon button (lucide-react RotateCw)
  - [ ] 7.3.2 Add play icon button (only when audio ready)
  - [ ] 7.3.3 Add delete/trash icon button (lucide-react Trash2)
  - [ ] 7.3.4 Style buttons with hover effects
  - [ ] 7.3.5 Arrange horizontally on the right side

## 8. Settings Sidebar
- [ ] 8.1 Create SettingsSidebar component
  - [ ] 8.1.1 Add "Settings & Controls" heading
  - [ ] 8.1.2 Set fixed width (~300-350px)
  - [ ] 8.1.3 Add dark background matching theme
  - [ ] 8.1.4 Stack all controls vertically with spacing
- [ ] 8.2 Create voice selection dropdown
  - [ ] 8.2.1 Add "Default Voice" label
  - [ ] 8.2.2 Fetch voices from /api/voices on mount
  - [ ] 8.2.3 Display voices in format "Name (Accent, Gender)"
  - [ ] 8.2.4 Use shadcn Select component
  - [ ] 8.2.5 Add helper text below dropdown
  - [ ] 8.2.6 Store selected voiceId in state
  - [ ] 8.2.7 Load/save to localStorage
- [ ] 8.3 Create speed slider control
  - [ ] 8.3.1 Add "Playback Speed: 1.0x" label
  - [ ] 8.3.2 Use shadcn Slider component
  - [ ] 8.3.3 Set range: 0.5x to 2.0x, step 0.1
  - [ ] 8.3.4 Display current value in label dynamically
  - [ ] 8.3.5 Style slider track with cyan fill color
  - [ ] 8.3.6 Store speed in state
  - [ ] 8.3.7 Load/save to localStorage

## 9. Action Buttons in Sidebar
- [ ] 9.1 Create "Generate All" button
  - [ ] 9.1.1 Use shadcn Button component with full width
  - [ ] 9.1.2 Style with bright cyan background (bg-cyan-500)
  - [ ] 9.1.3 Add sparkle/wand icon from lucide-react (Sparkles)
  - [ ] 9.1.4 Add "Generate All" text
  - [ ] 9.1.5 Disable when no lines or generating
- [ ] 9.2 Create "Download All" button
  - [ ] 9.2.1 Use shadcn Button component with full width
  - [ ] 9.2.2 Style with dark gray background (bg-slate-800)
  - [ ] 9.2.3 Add download icon from lucide-react (Download)
  - [ ] 9.2.4 Add "Download All" text
  - [ ] 9.2.5 Disable when no audio generated
- [ ] 9.3 Create "Clear All" button
  - [ ] 9.3.1 Use shadcn Button component with variant="ghost"
  - [ ] 9.3.2 Style with red text color (text-red-500)
  - [ ] 9.3.3 Add trash icon from lucide-react (Trash2)
  - [ ] 9.3.4 Add "Clear All" text
  - [ ] 9.3.5 Disable when no lines loaded

## 10. Character Counter
- [ ] 10.1 Create CharacterCounter component
  - [ ] 10.1.1 Add "Character Count" label
  - [ ] 10.1.2 Calculate total characters from all lines
  - [ ] 10.1.3 Display in format "1,254 / 10,000"
  - [ ] 10.1.4 Add progress bar below (shadcn Progress or custom)
  - [ ] 10.1.5 Fill progress bar proportionally
  - [ ] 10.1.6 Use cyan color for progress fill
  - [ ] 10.1.7 Change to yellow/orange when > 8,000 characters
  - [ ] 10.1.8 Update in real-time when lines change

## 11. Single Line Audio Generation
- [ ] 9.1 Create generateAudio function
  - [ ] 9.1.1 Call /api/tts with line text, voiceId, speed
  - [ ] 9.1.2 Update line status to 'processing'
  - [ ] 9.1.3 Store audio blob in line state
  - [ ] 9.1.4 Update line status to 'ready' on success
  - [ ] 9.1.5 Update line status to 'error' on failure
- [ ] 9.2 Add "Generate" button per line
- [ ] 9.3 Show loading spinner during processing
- [ ] 9.4 Display error message if generation fails

## 12. Audio Playback
- [ ] 10.1 Create audio player component for each line
- [ ] 10.2 Use HTML5 <audio> element with controls
- [ ] 10.3 Create object URL from audio blob
- [ ] 10.4 Apply speed control via playbackRate
- [ ] 10.5 Show player only when audio is ready
- [ ] 10.6 Clean up object URLs on unmount (memory management)

## 13. Regenerate Functionality
- [ ] 11.1 Add "Regenerate" button per line
- [ ] 11.2 Clear existing audio blob
- [ ] 11.3 Reset line status to 'processing'
- [ ] 11.4 Call generateAudio function
- [ ] 11.5 Update UI to show new audio

## 14. Batch Operations
- [ ] 12.1 Generate All
  - [ ] 12.1.1 Create generateAll function
  - [ ] 12.1.2 Process lines sequentially with async/await
  - [ ] 12.1.3 Display progress indicator (e.g., "Line 5/20 processing...")
  - [ ] 12.1.4 Update global isGeneratingAll state
  - [ ] 12.1.5 Disable Generate All button during processing
- [ ] 12.2 Download All
  - [ ] 12.2.1 Create downloadAll function
  - [ ] 12.2.2 Filter lines with audio blobs
  - [ ] 12.2.3 Create JSZip instance
  - [ ] 12.2.4 Add files with naming: line_001.mp3, line_002.mp3
  - [ ] 12.2.5 Generate ZIP blob
  - [ ] 12.2.6 Trigger browser download
- [ ] 12.3 Clear All
  - [ ] 12.3.1 Create clearAll function
  - [ ] 12.3.2 Reset lines state to empty array
  - [ ] 12.3.3 Clear file input
  - [ ] 12.3.4 Add confirmation dialog before clearing

## 15. Settings Panel
- [ ] 13.1 Create settings sidebar component
- [ ] 13.2 Add voice dropdown
- [ ] 13.3 Add speed slider with value display
- [ ] 13.4 Add character counter (current/10,000)
- [ ] 13.5 Add "Generate All" button (cyan/blue styling)
- [ ] 13.6 Add "Download All" button (dark styling)
- [ ] 13.7 Add "Clear All" button (red text styling)
- [ ] 13.8 Make responsive (stack below content on mobile)

## 16. Character Counter
- [ ] 14.1 Calculate total characters from all lines
- [ ] 14.2 Display count in format: "1,234 / 10,000"
- [ ] 14.3 Add warning color if approaching limit
- [ ] 14.4 Update counter in real-time as lines change

## 17. Header UI
- [ ] 15.1 Create header component with dark background
- [ ] 15.2 Add logo/title on left
- [ ] 15.3 Add "Dashboard" button (placeholder, non-functional)
- [ ] 15.4 Add "Upgrade" button (placeholder, non-functional)
- [ ] 15.5 Style to match screen.png design

## 18. Dark Theme Styling
- [ ] 16.1 Update app/globals.css with custom dark theme colors
- [ ] 16.2 Style file upload area (dashed border, hover effects)
- [ ] 16.3 Style line items (borders, spacing)
- [ ] 16.4 Style status badges (colors per status)
- [ ] 16.5 Style buttons (cyan primary, red destructive)
- [ ] 16.6 Add loading animations
- [ ] 16.7 Add hover effects

## 19. Responsive Design
- [ ] 17.1 Test on mobile viewport (375px width)
- [ ] 17.2 Test on tablet viewport (768px width)
- [ ] 17.3 Test on desktop viewport (1440px width)
- [ ] 17.4 Ensure touch-friendly button sizes
- [ ] 17.5 Adjust sidebar layout for mobile
- [ ] 17.6 Verify audio players work on mobile browsers

## 20. Error Handling
- [ ] 18.1 Handle network errors (display user message)
- [ ] 18.2 Handle API rate limit errors (show retry suggestion)
- [ ] 18.3 Handle invalid file uploads (show file type error)
- [ ] 18.4 Handle empty file uploads (prevent processing)
- [ ] 18.5 Handle ElevenLabs API errors (display specific errors)
- [ ] 18.6 Add try-catch blocks in all async functions

## 21. Loading States
- [ ] 19.1 Show spinner during voice fetch
- [ ] 19.2 Show spinner per line during generation
- [ ] 19.3 Show progress text during "Generate All"
- [ ] 19.4 Disable buttons during processing
- [ ] 19.5 Add loading overlay for blocking operations

## 22. Testing & Validation
- [ ] 20.1 Test with small .txt file (5 lines)
- [ ] 20.2 Test with medium .txt file (50 lines)
- [ ] 20.3 Test with large .txt file (500 lines)
- [ ] 20.4 Test voice switching
- [ ] 20.5 Test speed control across different values
- [ ] 20.6 Test regenerate functionality
- [ ] 20.7 Test "Generate All" with progress tracking
- [ ] 20.8 Test "Download All" ZIP creation
- [ ] 20.9 Test "Clear All" functionality
- [ ] 20.10 Test error scenarios (invalid API key, network failure)
- [ ] 20.11 Test on Chrome, Firefox, Safari
- [ ] 20.12 Test responsive design on mobile devices
