# Change: Allow Users to Use Their Own API Key

## Why
Currently, the TTS application requires the API key to be configured server-side in environment variables, which limits deployment flexibility and prevents users from using their own ElevenLabs API keys. Allowing users to provide their own API key will:

1. **Enable Self-Service**: Users can immediately use the application with their own ElevenLabs account without requiring administrator configuration
2. **Improve Deployment Flexibility**: The application can be deployed to static hosting platforms without server-side environment variable setup
3. **Enhanced Privacy**: Users' API keys remain on their device and are not stored on the server
4. **Cost Management**: Users can use their own ElevenLabs subscription and manage their own usage and billing
5. **Development Testing**: Developers can easily test the application without needing to configure server environment

## What Changes
- **API Key Input UI**: Add a secure API key input field in the settings sidebar
- **Client-Side Storage**: Store API key in localStorage for persistence during the session
- **Client-Side API Calls**: Modify TTS and voice fetching to work directly from the client
- **Security Measures**: Implement proper validation and secure handling of API keys
- **Error Handling**: Enhanced error messages for invalid/expired API keys
- **Fallback Support**: Maintain server-side API key as fallback for deployments

## Impact

### Affected Specs
- **text-to-speech** (MODIFIED): Support client-side API key usage and fallback to server-side
- **ui-components** (MODIFIED): Add API key input UI with validation and secure display
- **api-management** (NEW): API key management, validation, and secure storage requirements

### Affected Code
- `app/api/tts/route.ts`: Accept optional API key from request body, validate server key as fallback
- `app/api/voices/route.ts`: Accept optional API key from request headers, validate server key as fallback
- `components/SettingsSidebar.tsx`: Add API key input field with secure display and validation
- `components/ApiKeyInput.tsx`: New component for secure API key input and management
- `app/page.tsx`: Handle API key state and pass to API calls
- `types/index.ts`: Add API key management types and interfaces

### Technical Considerations
- **Security**: API keys will be stored in localStorage (session-based) and transmitted over HTTPS
- **Validation**: Client-side validation of API key format before API calls
- **Error Handling**: Clear error messages for invalid keys, rate limits, and authentication failures
- **Fallback**: Server-side API key as fallback for environments where client-side keys aren't configured
- **Privacy**: API keys are never logged or stored server-side when provided by users