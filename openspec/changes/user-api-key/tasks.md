# Implementation Tasks

## 1. Specification Updates ✅
- [x] 1.1 Create proposal.md with change justification and impact analysis
- [x] 1.2 Create design.md with architectural decisions and security model
- [x] 1.3 Create spec deltas for api-management, ui-components, and text-to-speech
- [x] 1.4 Create tasks.md with implementation checklist

## 2. Backend API Route Modifications
- [ ] 2.1 Update TTS API route to support client-side API keys
  - [ ] 2.1.1 Modify /app/api/tts/route.ts to accept x-api-key header
  - [ ] 2.1.2 Implement fallback to process.env.ELEVENLABS_API_KEY
  - [ ] 2.1.3 Add proper error handling for missing/invalid keys
  - [ ] 2.1.4 Ensure API keys are not logged or exposed
- [ ] 2.2 Update Voices API route to support client-side API keys
  - [ ] 2.2.1 Modify /app/api/voices/route.ts to accept x-api-key header
  - [ ] 2.2.2 Implement fallback to server-side environment variable
  - [ ] 2.2.3 Add validation for API key format and presence
  - [ ] 2.2.4 Maintain existing voice listing functionality

## 3. Type Definitions and Utilities
- [ ] 3.1 Create API key management types
  - [ ] 3.1.1 Add ApiKeyStatus type to types/index.ts
  - [ ] 3.1.2 Add ValidationResult type for API key testing
  - [ ] 3.1.3 Create ApiKeyManager interface for operations
- [ ] 3.2 Implement localStorage utilities
  - [ ] 3.2.1 Create storeApiKey function for secure key storage
  - [ ] 3.2.2 Create getStoredApiKey function for key retrieval
  - [ ] 3.2.3 Create clearStoredApiKey function for key removal
  - [ ] 3.2.4 Add isValidApiKeyFormat validation function

## 4. API Key Input Component
- [ ] 4.1 Create ApiKeyInput component
  - [ ] 4.1.1 Implement password-style input field with masking
  - [ ] 4.1.2 Add show/hide toggle for key visibility
  - [ ] 4.1.3 Include real-time validation feedback
  - [ ] 4.1.4 Add "Test Key" functionality
  - [ ] 4.1.5 Add "Clear Key" functionality
- [ ] 4.2 Implement API key validation
  - [ ] 4.2.1 Create format validation for ElevenLabs API keys
  - [ ] 4.2.2 Implement connectivity testing to /api/voices
  - [ ] 4.2.3 Handle different error types (invalid, expired, quota)
  - [ ] 4.2.4 Provide user-friendly error messages and guidance

## 5. Header Component Updates
- [ ] 5.1 Replace user avatar with key icon
  - [ ] 5.1.1 Modify /components/Header.tsx to use key icon instead of User icon
  - [ ] 5.1.2 Make key icon clickable to show API key status
  - [ ] 5.1.3 Add visual distinction between default and custom API keys
  - [ ] 5.1.4 Maintain consistent header styling and layout
- [ ] 5.2 Create API key status dropdown
  - [ ] 5.2.1 Implement dropdown/popup for API key status display
  - [ ] 5.2.2 Show "Using Default Key" or "Using Your Key" status
  - [ ] 5.2.3 Add navigation to API key settings
  - [ ] 5.2.4 Add "Test Connection" option
  - [ ] 5.2.5 Include click-outside-to-close functionality

## 6. Settings Sidebar Integration
- [ ] 6.1 Add API key configuration section
  - [ ] 6.1.1 Integrate ApiKeyInput component into SettingsSidebar
  - [ ] 6.1.2 Add API key status display section
  - [ ] 6.1.3 Include helper text and documentation links
  - [ ] 6.1.4 Maintain consistent styling with existing settings
- [ ] 6.2 Update SettingsSidebar props and state management
  - [ ] 6.2.1 Add apiKey prop to SettingsSidebarProps interface
  - [ ] 6.2.2 Add onApiKeyChange callback prop
  - [ ] 6.2.3 Add apiKeyStatus prop for UI feedback
  - [ ] 6.2.4 Update main dashboard to manage API key state

## 7. Main Dashboard Integration
- [ ] 7.1 Add API key state management
  - [ ] 7.1.1 Add apiKey state to main dashboard component
  - [ ] 7.1.2 Load stored API key on component mount
  - [ ] 7.1.3 Handle API key changes and validation
  - [ ] 7.1.4 Update API calls to use client-side key when available
- [ ] 7.2 Update API call functions
  - [ ] 7.2.1 Modify generateAudio to pass API key in headers
  - [ ] 7.2.2 Update voices fetching to use client-side key
  - [ ] 7.2.3 Handle API key-related errors in UI
  - [ ] 7.2.4 Maintain fallback to server-side functionality

## 8. Error Handling and User Feedback
- [ ] 8.1 Implement API key error handling
  - [ ] 8.1.1 Handle missing API key scenarios
  - [ ] 8.1.2 Display clear error messages for invalid keys
  - [ ] 8.1.3 Show guidance for API key configuration
  - [ ] 8.1.4 Prevent TTS operations without valid key
- [ ] 8.2 Add user feedback for API key operations
  - [ ] 8.2.1 Show success messages for key validation
  - [ ] 8.2.2 Display loading states during key testing
  - [ ] 8.2.3 Provide error recovery options
  - [ ] 8.2.4 Update UI to reflect key status changes

## 9. Testing and Validation
- [ ] 9.1 Test API key functionality
  - [ ] 9.1.1 Test client-side API key usage for TTS generation
  - [ ] 9.1.2 Test voice fetching with user-provided API key
  - [ ] 9.1.3 Test fallback to server-side API key
  - [ ] 9.1.4 Test API key validation and error handling
- [ ] 9.2 Test UI components and interactions
  - [ ] 9.2.1 Test key icon click and dropdown functionality
  - [ ] 9.2.2 Test API key input component validation
  - [ ] 9.2.3 Test show/hide toggle for key visibility
  - [ ] 9.2.4 Test settings integration and state management
- [ ] 9.3 Test security considerations
  - [ ] 9.3.1 Verify API keys are not logged server-side
  - [ ] 9.3.2 Test secure transmission over HTTPS
  - [ ] 9.3.3 Test localStorage storage and retrieval
  - [ ] 9.3.4 Test memory management for sensitive data

## 10. Final Validation and Cleanup
- [ ] 10.1 Run OpenSpec validation
  - [ ] 10.1.1 Execute `openspec validate user-api-key --strict`
  - [ ] 10.1.2 Resolve any validation errors
  - [ ] 10.1.3 Ensure all requirements are properly addressed
- [ ] 10.2 Cross-browser testing
  - [ ] 10.2.1 Test API key functionality in Chrome
  - [ ] 10.2.2 Test in Firefox browser
  - [ ] 10.2.3 Test in Safari browser
  - [ ] 10.2.4 Verify consistent behavior across browsers
- [ ] 10.3 Integration testing
  - [ ] 10.3.1 Test complete TTS workflow with user API key
  - [ ] 10.3.2 Test with both client-side and server-side keys
  - [ ] 10.3.3 Verify no conflicts with existing functionality
  - [ ] 10.3.4 Test responsive design with new UI elements
- [ ] 10.4 Documentation and cleanup
  - [ ] 10.4.1 Update inline comments if needed
  - [ ] 10.4.2 Verify component exports are correct
  - [ ] 10.4.3 Check for console warnings or errors
  - [ ] 10.4.4 Prepare change summary for commit message