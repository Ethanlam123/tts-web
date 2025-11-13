# Design Document: Allow Users to Use Their Own API Key

## Context
The current TTS application requires the ElevenLabs API key to be configured server-side in environment variables (ELEVENLABS_API_KEY). This approach limits deployment flexibility and prevents users from using their own API keys. The application needs to support client-side API key configuration while maintaining security and fallback capabilities.

## Goals / Non-Goals

### Goals
- Enable users to input and use their own ElevenLabs API keys
- Provide secure client-side API key storage using localStorage
- Maintain server-side API key as fallback for existing deployments
- Implement proper validation and error handling for API keys
- Create intuitive UI for API key management
- Ensure API keys are transmitted securely over HTTPS
- Support immediate validation of API key validity

### Non-Goals
- Store API keys server-side or in databases
- Implement user authentication or account management
- Share API keys between users or store them permanently
- Modify ElevenLabs API usage patterns beyond authentication

## Decisions

### 1. Hybrid API Key Approach: Client-Side with Server Fallback
**Decision**: Support both client-side API keys and server-side environment variables, with client-side taking priority.

**Why**:
- Maintains backward compatibility with existing deployments
- Provides flexibility for different deployment scenarios
- Allows users to override server configuration when needed
- Ensures the application works in environments without client-side keys

**Implementation**:
```typescript
// API routes will check for client key first, then fallback to server key
const apiKey = request.headers.get('x-api-key') || process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  return NextResponse.json({ error: 'API key required' }, { status: 401 });
}
```

**Alternatives Considered**:
- Client-side only: Breaks existing deployments
- Server-side only: Doesn't solve the core problem
- Separate endpoints: Adds unnecessary complexity

### 2. Client-Side Storage: Session-Based localStorage
**Decision**: Store API keys in localStorage for the browser session, not permanent storage.

**Why**:
- API keys persist across page refreshes during a session
- Keys are automatically cleared when users clear browser data
- No server-side storage required for privacy
- Simple implementation with no additional dependencies

**Security Considerations**:
- API keys are only transmitted over HTTPS
- Keys are not logged or stored server-side
- localStorage is isolated to the origin domain
- Keys are validated before use

**Implementation**:
```typescript
// API key management utilities
const API_KEY_STORAGE_KEY = 'tts-elevenlabs-api-key';

export const storeApiKey = (apiKey: string) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const getStoredApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const clearStoredApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};
```

### 3. UI Integration: Settings Section with Secure Input
**Decision**: Add API key management to the existing settings sidebar with secure password-style input.

**Why**:
- Fits naturally with existing settings controls
- Provides easy access for configuration
- Maintains consistent UI patterns
- Allows for immediate testing and validation

**Implementation**:
```typescript
// New API key input component
interface ApiKeyInputProps {
  value: string;
  onChange: (key: string) => void;
  onValidate?: (isValid: boolean, message?: string) => void;
}

// Features:
- Password-style input (masked characters)
- Show/Hide toggle for key visibility
- Real-time validation
- Test key functionality
- Clear key option
- Visual feedback for validation status
```

### 4. API Key Validation: Immediate Client-Side Checks
**Decision**: Implement client-side validation before making API calls to provide immediate feedback.

**Why**:
- Prevents unnecessary API calls with invalid keys
- Provides better user experience with immediate feedback
- Reduces server load and rate limit issues
- Helps users identify configuration issues quickly

**Validation Steps**:
1. **Format Validation**: Check if key matches ElevenLabs API key format (starts with 'sk_')
2. **Length Validation**: Ensure key has appropriate length (typically 32+ characters)
3. **Connectivity Test**: Make a lightweight API call to validate the key works
4. **Error Categorization**: Different error messages for different failure types

```typescript
const validateApiKey = async (apiKey: string): Promise<ValidationResult> => {
  // Format check
  if (!apiKey.startsWith('sk_') || apiKey.length < 30) {
    return { isValid: false, error: 'Invalid API key format' };
  }

  // Connectivity test
  try {
    const response = await fetch('/api/voices', {
      headers: { 'x-api-key': apiKey }
    });

    if (!response.ok) {
      throw new Error('API key validation failed');
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'API key is invalid or expired'
    };
  }
};
```

### 5. Security Model: Secure Transmission and Storage
**Decision**: Implement security best practices for API key handling without over-engineering.

**Why**:
- API keys are sensitive credentials that require protection
- Users need confidence their keys are handled securely
- Simple security model is easier to maintain and audit
- Follows industry standards for client-side API key management

**Security Measures**:
- **HTTPS Only**: Ensure API keys are only transmitted over encrypted connections
- **No Server Logging**: Explicitly prevent API keys from being logged on the server
- **Input Sanitization**: Validate and sanitize API key inputs
- **Memory Management**: Clear API keys from memory when no longer needed
- **Origin Validation**: Ensure API calls originate from the expected domain

```typescript
// Secure API key handling in API routes
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');

  // Never log the actual API key
  console.log('Processing TTS request'); // ✅ Safe
  console.log('API key:', apiKey); // ❌ Never do this

  // Validate key format
  if (!apiKey || !isValidApiKeyFormat(apiKey)) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  // Use the key securely...
}
```

## Trade-offs

### Positive Trade-offs
- **User Autonomy**: Users can use their own API keys immediately
- **Deployment Flexibility**: Application can be deployed anywhere
- **Privacy**: Keys are not stored server-side
- **Cost Management**: Users manage their own ElevenLabs billing
- **Backward Compatibility**: Existing deployments continue to work

### Considerations
- **Security Responsibility**: Users must protect their own API keys
- **Client-Side Exposure**: API keys exist in browser memory (mitigated by HTTPS)
- **Support Complexity**: Need to handle both client-side and server-side key scenarios
- **Rate Limiting**: Individual users may hit rate limits faster

## Migration Plan

### Phase 1: Backend API Changes
1. Modify `/app/api/tts/route.ts` to accept optional API key from headers
2. Modify `/app/api/voices/route.ts` to accept optional API key from headers
3. Implement fallback to server-side environment variable
4. Add proper error handling for missing/invalid keys

### Phase 2: Client-Side Components
1. Create `components/ApiKeyInput.tsx` component
2. Implement localStorage utilities for API key management
3. Add validation logic and error handling
4. Create API key state management in main dashboard

### Phase 3: UI Integration
1. Add API key input section to SettingsSidebar
2. Implement "Test API Key" functionality
3. Add clear/remove API key option
4. Update error handling throughout the application

### Phase 4: Testing and Validation
1. Test client-side API key functionality
2. Verify server-side fallback still works
3. Test error handling and validation
4. Ensure security measures are working properly

### Rollback Plan
- Simple revert of API routes to ignore client-side keys
- Remove API key input UI from settings
- Keep server-side environment variable functionality intact

## Open Questions

1. **API Key Persistence**: Should we offer to remember API keys across browser sessions?
   - **Resolution**: No, localStorage is session-based for better security

2. **Multiple API Keys**: Should we support multiple API keys for different users?
   - **Resolution**: No, single key approach is simpler and sufficient

3. **API Key Sharing**: Should we allow users to export/import API keys?
   - **Resolution**: No, this increases security risk without clear benefit

## Validation Criteria
- Users can input their own ElevenLabs API key in settings
- API key is validated format-wise before use
- Application works with client-side API keys for all TTS operations
- Server-side environment variable still works as fallback
- API keys are stored securely in localStorage only
- Clear error messages for invalid/expired API keys
- Test functionality validates API key connectivity
- Application works when no API key is configured (shows setup prompt)
- Security measures prevent API key leakage in logs or storage