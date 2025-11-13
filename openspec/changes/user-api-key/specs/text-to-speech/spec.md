# text-to-speech Specification Delta

## MODIFIED Requirements

### Requirement: TTS API Integration
The system SHALL support both client-side and server-side API keys for TTS generation.

#### Scenario: Accept client-side API key for TTS
- **WHEN** making TTS API requests
- **THEN** the system SHALL accept an optional API key from request headers
- **AND** check for 'x-api-key' header in the request
- **AND** validate the provided key before use
- **AND** fallback to server-side environment variable if no client key provided

#### Scenario: Validate API key before TTS generation
- **WHEN** processing a TTS request
- **THEN** the system SHALL ensure a valid API key is available
- **AND** return appropriate error if no key is configured
- **AND** validate key format before making ElevenLabs API calls
- **AND** handle authentication failures gracefully

#### Scenario: Use API key for ElevenLabs integration
- **WHEN** initializing ElevenLabs client for TTS
- **THEN** the system SHALL use the provided API key from request or environment
- **AND** pass the key to the ElevenLabsClient constructor
- **AND** maintain existing error handling and retry logic
- **AND** preserve all existing TTS functionality

## ADDED Requirements

### Requirement: Hybrid API Key Authentication
The system SHALL support flexible API key authentication for TTS operations.

#### Scenario: Priority-based API key selection
- **WHEN** processing TTS requests
- **THEN** the system SHALL prioritize client-side API key over server-side
- **AND** use client-side key if provided and valid
- **AND** fallback to server-side environment variable if no client key
- **AND** ensure consistent key usage throughout the request lifecycle

#### Scenario: Handle missing API keys gracefully
- **WHEN** neither client-side nor server-side API key is available
- **THEN** the system SHALL return a clear error message
- **AND** include instructions for API key configuration
- **AND** provide appropriate HTTP status code (401 Unauthorized)
- **AND** suggest checking API key configuration in settings

#### Scenario: API key validation for TTS
- **WHEN** an API key is provided for TTS generation
- **THEN** the system SHALL validate the key format before use
- **AND** ensure the key starts with "sk_" prefix
- **AND** verify minimum key length requirements
- **AND** reject malformed keys with helpful error messages

### Requirement: TTS Error Handling for API Keys
The system SHALL provide enhanced error handling for API key-related TTS failures.

#### Scenario: Handle authentication errors
- **WHEN** ElevenLabs API returns authentication failure
- **THEN** the system SHALL return specific error about API key issues
- **AND** distinguish between invalid key and expired key
- **AND** provide guidance for API key resolution
- **AND** maintain user-friendly error messages

#### Scenario: Handle rate limiting with API keys
- **WHEN** API calls hit rate limits
- **THEN** the system SHALL handle rate limiting per API key
- **AND** return appropriate retry-after headers when possible
- **AND** provide clear messaging about rate limit status
- **AND** suggest waiting periods or API key upgrades

#### Scenario: API key quota management
- **WHEN** API key usage exceeds quota
- **THEN** the system SHALL detect quota exceeded errors
- **AND** return appropriate error messages
- **AND** provide information about usage limits
- **AND** suggest checking ElevenLabs account settings