# API Documentation

This document provides detailed information about the AudioConverter API endpoints and usage patterns.

## 🌐 Overview

The AudioConverter provides RESTful API endpoints for:
- Fetching available ElevenLabs voices
- Converting text to speech
- Managing API authentication

All API endpoints support both server-side and client-side API key authentication.

## 🔐 Authentication

### Methods
1. **Server-side API Key**: Set in `ELEVENLABS_API_KEY` environment variable
2. **Client-side API Key**: Sent in `x-api-key` header

### Header Format
```http
x-api-key: sk_your_elevenlabs_api_key_here
```

### API Key Format Validation
- Must start with `sk_`
- Followed by alphanumeric characters
- Minimum 16 characters after `sk_`
- Regex pattern: `^sk_[a-zA-Z0-9]{16,}$`

## 📡 Endpoints

### GET /api/voices

Fetches all available ElevenLabs voices with metadata.

#### Request
```http
GET /api/voices
Headers: {
  "Content-Type": "application/json",
  "x-api-key": "sk_your_api_key" (optional)
}
```

#### Response (200 OK)
```json
{
  "voices": [
    {
      "voice_id": "21m00Tcm4TlvDq8ikWAM",
      "name": "Rachel",
      "labels": {
        "accent": "American",
        "gender": "Female",
        "age": "Young",
        "use case": "narration",
        "description": "calm, balanced"
      }
    },
    {
      "voice_id": "29vD33N1CtxCmqQRPOwG",
      "name": "Drew",
      "labels": {
        "accent": "American",
        "gender": "Male",
        "age": "Young",
        "use case": "narration"
      }
    }
  ]
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "error": "API key is required. Please configure your ElevenLabs API key in settings."
}
```

**429 Rate Limited**
```json
{
  "error": "Rate limit exceeded. Please try again shortly."
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch voices. Please try again."
}
```

### POST /api/tts

Converts text to speech using specified voice.

#### Request
```http
POST /api/tts
Headers: {
  "Content-Type": "application/json",
  "x-api-key": "sk_your_api_key" (optional)
}
Body: {
  "text": "Hello, world!",
  "voiceId": "21m00Tcm4TlvDq8ikWAM"
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to convert to speech (max 10,000 characters) |
| `voiceId` | string | Yes | ElevenLabs voice ID |

#### Response (200 OK)

Returns MP3 audio buffer with appropriate headers:

```http
Content-Type: audio/mpeg
Content-Length: 12345
```

The response body is the binary MP3 audio data.

#### Error Responses

**400 Bad Request**
```json
{
  "error": "Text and voiceId are required"
}
```

**401 Unauthorized**
```json
{
  "error": "API key is required. Please configure your ElevenLabs API key in settings."
}
```

**429 Rate Limited**
```json
{
  "error": "Rate limit exceeded. Please try again shortly."
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to generate audio. Please try again."
}
```

## 🎛️ Configuration

### Model Settings

All TTS generation uses the following configuration:

```typescript
{
  modelId: "eleven_multilingual_v2",  // Supports 32 languages
  outputFormat: "mp3_44100_128"      // 44.1kHz, 128kbps MP3
}
```

### Rate Limiting

To prevent API abuse, the application implements:
- **Sequential Processing**: 500ms delay between requests
- **Error Handling**: Automatic retry with exponential backoff
- **User Feedback**: Clear error messages for rate limits

## 🛡️ Security

### API Key Handling

**Server-side (Default)**
```typescript
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY, // Environment variable
});
```

**Client-side (User Configured)**
```typescript
// API key from header with fallback
const apiKey = request.headers.get('x-api-key') || process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  return NextResponse.json(
    { error: 'API key is required' },
    { status: 401 }
  );
}
```

### Security Best Practices

- ✅ API keys never logged or exposed
- ✅ HTTPS-only communication
- ✅ Input validation for all parameters
- ✅ Error messages don't expose sensitive data
- ✅ Rate limiting prevents abuse
- ✅ SSR-safe localStorage access

## 🧪 Testing

### Local Development

1. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Add your ELEVENLABS_API_KEY
   ```

2. **Test endpoints**
   ```bash
   # Test voices endpoint
   curl -H "x-api-key: sk_your_key" http://localhost:3000/api/voices

   # Test TTS endpoint
   curl -X POST \
     -H "Content-Type: application/json" \
     -H "x-api-key: sk_your_key" \
     -d '{"text":"Hello world","voiceId":"21m00Tcm4TlvDq8ikWAM"}' \
     http://localhost:3000/api/tts \
     --output test.mp3
   ```

### Error Testing

Test various error scenarios:

```bash
# Test missing API key
curl http://localhost:3000/api/voices

# Test invalid API key
curl -H "x-api-key: invalid_key" http://localhost:3000/api/voices

# Test missing parameters
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello"}' \
  http://localhost:3000/api/tts
```

## 📊 Performance

### Response Times

- **Voices API**: ~200-500ms
- **TTS API**: ~1-3 seconds (depends on text length)
- **Processing**: Sequential to prevent rate limits

### Caching Strategy

- **Voices**: Cached in browser for 1 hour
- **Audio**: Generated on-demand, cached as object URLs
- **API Keys**: Stored in localStorage with validation

### Limits

- **Text Length**: Maximum 10,000 characters
- **Concurrent Requests**: Limited by sequential processing
- **File Size**: MP3 files typically 50-500KB depending on text length

## 🔧 Integration Examples

### JavaScript/TypeScript

```typescript
// Fetch voices
async function getVoices(apiKey?: string) {
  const response = await fetch('/api/voices', {
    headers: apiKey ? { 'x-api-key': apiKey } : {}
  });

  const data = await response.json();
  return data.voices;
}

// Generate audio
async function generateAudio(text: string, voiceId: string, apiKey?: string) {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { 'x-api-key': apiKey })
    },
    body: JSON.stringify({ text, voiceId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.blob(); // Audio blob
}
```

### Python

```python
import requests

def get_voices(api_key=None):
    headers = {}
    if api_key:
        headers['x-api-key'] = api_key

    response = requests.get('http://localhost:3000/api/voices', headers=headers)
    response.raise_for_status()
    return response.json()['voices']

def generate_audio(text, voice_id, api_key=None):
    headers = {'Content-Type': 'application/json'}
    if api_key:
        headers['x-api-key'] = api_key

    data = {'text': text, 'voiceId': voice_id}
    response = requests.post('http://localhost:3000/api/tts', headers=headers, json=data)
    response.raise_for_status()
    return response.content  # Binary MP3 data
```

## 🔍 Debugging

### Common Issues

**1. "API key is required"**
- Check environment variables
- Verify client-side API key configuration
- Ensure proper header format

**2. "Rate limit exceeded"**
- Wait before retrying
- Check ElevenLabs quota
- Implement proper delays

**3. "Failed to generate audio"**
- Verify text length under 10,000 chars
- Check voice ID is valid
- Ensure API key has sufficient quota

### Logging

The application provides structured error logging:

```typescript
// Error response format
{
  error: "User-friendly error message",
  details: "Technical error details", // Optional
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

## 📝 Version History

- **v1.0**: Initial release with voices and TTS endpoints
- **v1.1**: Added client-side API key support
- **v1.2**: Enhanced error handling and rate limiting
- **v1.3**: Improved security and validation

## 🆘 Support

For API-related issues:
1. Check the error messages and response codes
2. Verify your ElevenLabs API key and quota
3. Review this documentation
4. Open an issue with detailed error information

---

For general application usage, see the main [README.md](README.md).