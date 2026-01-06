# AudioConverter - Text-to-Speech Web Application

A modern, production-ready text-to-speech application built with Next.js 16 and ElevenLabs API. Convert text files into high-quality audio with granular control over voice selection, playback speed, and batch operations.

## ✨ Features

### 🎙️ Core Functionality
- **Text-to-Speech Conversion**: Convert .txt files to high-quality MP3 audio
- **Line-by-Line Processing**: Generate individual audio files for each text line
- **Voice Selection**: Choose from 100+ ElevenLabs voices with preview
- **Playback Speed Control**: Adjustable speed from 0.5x to 2.0x
- **Batch Operations**: Generate all, download all as ZIP, clear all

### 🔐 API Key Management
- **Flexible API Key Support**: Use server-side or configure your own ElevenLabs API key
- **Secure Storage**: Client-side API keys stored securely in browser localStorage
- **Visual Status Indicator**: Key icon shows current API key status in header
- **Easy Configuration**: Simple dialog interface for API key management
- **Automatic Refresh**: Voices update immediately when API key is configured

### 🎨 User Interface
- **Modern Light Theme**: Clean, professional interface with light mode
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Feedback**: Status indicators for each line generation
- **Drag & Drop**: Intuitive file upload with drag-and-drop support
- **Accessibility**: Proper contrast ratios and keyboard navigation

### ⚡ Technical Features
- **Server-Side Rendering**: Fast initial load with Next.js 16 App Router
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Graceful error handling with user-friendly messages
- **Performance Optimized**: Sequential processing to prevent API rate limits
- **Modern Stack**: React 19, Tailwind CSS v4, shadcn/ui components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: Node.js 20+)
- ElevenLabs API key 

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yusinglam/tts-web.git
   cd tts-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Add your ElevenLabs API key to `.env.local`:
   ```bash
   ELEVENLABS_API_KEY=sk_your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### API Key Setup

#### Option 1: Server-Side (Default)
Add your API key to `.env.local`:
```bash
ELEVENLABS_API_KEY=sk_your_api_key_here
```

#### Option 2: Client-Side (Recommended for users)
1. Click the **key icon** in the top-right header
2. Click **"Configure"** or **"Update"**
3. Enter your ElevenLabs API key (starts with `sk_`)
4. Click **"Save API Key"**

### API Key Format
ElevenLabs API keys must:
- Start with `sk_`
- Be followed by alphanumeric characters
- Example: `sk_1234567890abcdef1234567890abcdef`

## 📖 Usage Guide

### Basic Workflow

1. **Configure API Key**: Set up your ElevenLabs API key
2. **Upload Text File**: Drag and drop or click to upload a .txt file
3. **Select Voice**: Choose your preferred voice from the dropdown
4. **Adjust Speed**: Set playback speed (0.5x - 2.0x)
5. **Generate Audio**: Click "Generate All" or generate individual lines
6. **Play & Download**: Play audio inline or download all as ZIP

### Advanced Features

#### Individual Line Control
- **Regenerate**: Recreate audio for specific lines
- **Play/Pause**: Control playback for each line
- **Delete**: Remove individual lines

#### Batch Operations
- **Generate All**: Process all lines sequentially
- **Download All**: Create ZIP file with all MP3 files
- **Clear All**: Remove all lines and start fresh

#### Voice Customization
- **Voice Selection**: 100+ ElevenLabs voices
- **Voice Information**: Shows accent, gender, and language
- **Default Voice**: Set preferred voice for all lines

## 🏗️ Project Structure

```
tts-web/
├── app/
│   ├── api/
│   │   ├── voices/route.ts        # ElevenLabs voices API
│   │   └── tts/route.ts           # Text-to-speech conversion
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main dashboard
│   └── globals.css                # Global styles
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── Header.tsx                 # App header with API key status
│   ├── SettingsSidebar.tsx        # Right sidebar with controls
│   ├── ApiKeyInput.tsx            # API key configuration
│   ├── UploadArea.tsx             # File upload component
│   ├── LineItem.tsx               # Individual line display
│   └── StatusBadge.tsx            # Status indicators
├── lib/
│   └── api-key-manager.ts         # API key management utilities
├── types/
│   └── index.ts                   # TypeScript type definitions
├── openspec/                      # Specifications and documentation
└── public/                        # Static assets
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Technology Stack

- **Framework**: Next.js 16.0.2 (App Router)
- **Language**: TypeScript 5+ (strict mode)
- **Frontend**: React 19.2.0
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React v0.553.0
- **Audio Processing**: @elevenlabs/elevenlabs-js v2.23.0
- **File Processing**: JSZip v3.10.1
- **Build Tools**: ESLint 9, TypeScript compiler

### API Integration

#### ElevenLabs API
- **Voices**: Fetch available voices with accent, gender, and language metadata
- **TTS**: Convert text to speech with configurable voice and model
- **Model**: Uses `eleven_multilingual_v2` (supports 32 languages)
- **Format**: High-quality MP3 at 44.1kHz, 128kbps
- **Rate Limiting**: Built-in sequential processing with 500ms delays
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🔒 Security

### API Key Management
- **Server-Side Keys**: Stored in environment variables
- **Client-Side Keys**: Stored in localStorage, never logged
- **HTTPS Only**: All API calls made over secure connections
- **No URL Exposure**: API keys transmitted in headers, not URLs

### Best Practices
- Input validation for API key format (`sk_[a-zA-Z0-9]{16,}`)
- Error handling without exposing sensitive data
- Graceful fallbacks for missing configurations
- SSR-safe localStorage access patterns
- Memory cleanup for audio object URLs
- No API key logging or URL exposure

## 🌐 Deployment

### Environment Variables
```bash
ELEVENLABS_API_KEY=your_server_side_api_key
```

### Vercel Deployment
```bash
npm run build
vercel --prod
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎯 Project Status

### ✅ Production Ready
This application is production-ready with comprehensive features:
- **Stable Implementation**: All core features fully implemented and tested
- **Security**: Comprehensive API key management with hybrid server/client approach
- **Performance**: Optimized for handling large text files with sequential processing
- **Error Handling**: User-friendly error messages and graceful fallbacks
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🔄 Recent Updates
- **TypeScript Build Optimization**: Resolved build errors for Vercel deployment
- **Light Theme Implementation**: Updated UI to match professional design mockup
- **Enhanced API Key Management**: Improved validation, testing, and user experience
- **Documentation**: Comprehensive documentation with OpenSpec integration
- **GitHub Setup**: Added proper repository configuration and contribution guidelines

### 📊 Current Capabilities
- **File Processing**: Handles .txt files with up to 10,000 characters
- **Voice Library**: Access to 100+ ElevenLabs voices with detailed metadata
- **Batch Operations**: Sequential processing prevents API rate limits
- **Audio Quality**: High-quality MP3 output (44.1kHz, 128kbps)
- **Memory Management**: Proper cleanup of audio object URLs
- **Character Limits**: Warns at 8,000 characters, maximum 10,000

## 📝 API Reference

### Voices API
```typescript
GET /api/voices
Headers: { x-api-key: "your_api_key" }
Response: { voices: Voice[] }
```

### TTS API
```typescript
POST /api/tts
Headers: { x-api-key: "your_api_key" }
Body: { text: string, voiceId: string }
Response: Audio buffer (MP3)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode practices
- Use shadcn/ui components for consistency
- Maintain light theme compatibility
- Test API key configuration flows
- Ensure responsive design on all devices

## 📄 License

This project is licensed under the MIT License

## 🆘 Support

### Common Issues

**API Key Not Working**
- Verify the key starts with `sk_`
- Check key validity in ElevenLabs dashboard
- Ensure proper format (no extra spaces)

**No Voices Available**
- Click the key icon to check API key status
- Try reconfiguring your API key
- Check internet connection

**Audio Generation Fails**
- Verify text file format (.txt only)
- Check character count limits (10,000 max)
- Ensure API key has sufficient quota

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Create a new issue with detailed error information
- Include browser console logs for debugging

## 🔗 Related Links

- [ElevenLabs API Documentation](https://elevenlabs.io/docs)
- [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

Built with ❤️, Claude Code using Next.js, React, and ElevenLabs API