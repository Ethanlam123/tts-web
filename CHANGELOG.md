# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- DEPLOYMENT.md - Comprehensive deployment guide
- API.md - Detailed API documentation
- CHANGELOG.md - Project changelog tracking
- .env.example - Environment variable template

### Changed
- Updated README.md with current project status and capabilities
- Enhanced documentation with recent improvements and features

## [0.1.0] - 2024-01-XX

### Added
- Initial release of AudioConverter TTS web application
- Core text-to-speech functionality using ElevenLabs API
- Line-by-line audio generation with individual controls
- Voice selection from 100+ ElevenLabs voices
- Playback speed control (0.5x - 2.0x)
- Batch operations (Generate All, Download All, Clear All)
- Modern light theme UI matching design mockup
- Responsive design for desktop, tablet, and mobile
- Comprehensive API key management system
- Hybrid server/client API key support
- Real-time status indicators for audio generation
- Character counting with limits (8,000 warning, 10,000 max)
- ZIP file creation for batch downloads
- Error handling with user-friendly messages
- Sequential processing to prevent API rate limits

### Technology Stack
- **Framework**: Next.js 16.0.2 with App Router
- **Frontend**: React 19.2.0
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React v0.553.0
- **Audio Processing**: @elevenlabs/elevenlabs-js v2.23.0
- **File Processing**: JSZip v3.10.1

### Features
#### Core Functionality
- Text-to-speech conversion using ElevenLabs API
- Support for .txt file upload and processing
- Individual line processing with separate audio files
- High-quality MP3 output (44.1kHz, 128kbps)
- Multi-language support via `eleven_multilingual_v2` model

#### API Key Management
- Server-side API key support (environment variables)
- Client-side API key configuration (user configurable)
- Visual status indicators in header
- API key format validation
- Secure localStorage storage
- Automatic voice refresh on key configuration

#### User Interface
- Clean, professional light theme design
- Two-column layout with fixed settings sidebar (350px)
- Drag & drop file upload zone
- Real-time status badges (idle/processing/ready/error)
- Intuitive controls for each line (regenerate, play, delete)
- Character counter with warning system
- Mobile-responsive design

#### Batch Operations
- Sequential "Generate All" processing with progress
- ZIP download with numbered files (line_001.mp3, etc.)
- "Clear All" with confirmation dialog
- Individual line controls override batch settings

#### Security & Performance
- SSR-safe localStorage access patterns
- Memory cleanup for audio object URLs
- Rate limiting with 500ms delays between requests
- Comprehensive error handling
- Input validation and sanitization

### API Endpoints
- `GET /api/voices` - Fetch available ElevenLabs voices
- `POST /api/tts` - Convert text to speech

### Project Structure
```
tts-web/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── [other components]
├── lib/                   # Utility functions
├── types/                 # TypeScript definitions
├── openspec/             # Specifications
└── public/               # Static assets
```

### Documentation
- Comprehensive README.md with usage examples
- Contributing guidelines (CONTRIBUTING.md)
- Development setup instructions
- API integration documentation
- Security best practices
- Deployment guides

### Quality Assurance
- TypeScript strict mode compliance
- ESLint configuration
- Responsive design testing
- Error handling verification
- Accessibility considerations

## [0.1.0-rc.2] - 2024-01-XX

### Fixed
- TypeScript build errors for Vercel deployment
- Memory leak issues with audio object URLs
- API key validation edge cases
- Mobile responsiveness issues

### Changed
- Updated UI to match light theme design mockup
- Enhanced error messages for better user experience
- Improved API key status indicators
- Optimized sequential processing delays

## [0.1.0-rc.1] - 2024-01-XX

### Added
- Initial API key management system
- Voice selection and metadata display
- File upload and text processing
- Basic TTS functionality

### Known Issues
- TypeScript build warnings on Vercel
- Memory management for large audio files
- Limited mobile support

---

## Version Scheme

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes (API changes, incompatible updates)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Types

- **Production**: Stable releases (e.g., 0.1.0)
- **Release Candidate**: Pre-production testing (e.g., 0.1.0-rc.1)
- **Development**: Feature development (e.g., 0.1.0-dev)

## Migration Guide

### From 0.1.0-rc to 0.1.0

No breaking changes. This is a stable release with bug fixes and improvements.

### Environment Variables

No changes required. Existing `.env.local` files will continue to work.

### API Changes

No breaking API changes in v0.1.0.

## Support

For issues related to specific versions:
1. Check this changelog first
2. Review the version-specific documentation
3. Open an issue with version information
4. Include steps to reproduce

---

*Last updated: January 2024*