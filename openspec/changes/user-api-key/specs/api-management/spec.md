# api-management Specification

## ADDED Requirements

### Requirement: API Key Input and Storage
The system SHALL allow users to input and store their own ElevenLabs API keys securely.

#### Scenario: Display API key input field
- **WHEN** the settings panel renders
- **THEN** the system SHALL display an API key input section
- **AND** show a label "ElevenLabs API Key"
- **AND** provide a password-style input field for key entry
- **AND** include a show/hide toggle for key visibility
- **AND** display helper text about where to find API keys

#### Scenario: Store API key securely
- **WHEN** a user inputs a valid API key
- **THEN** the system SHALL store the key in browser localStorage
- **AND** use a secure storage key specific to the application
- **AND** persist the key across page refreshes within the browser session
- **AND** never transmit the key to server storage

#### Scenario: Clear API key
- **WHEN** a user clicks "Clear" or "Remove" API key button
- **THEN** the system SHALL remove the API key from localStorage
- **AND** revert to using server-side default API key
- **AND** update UI to reflect no custom API key is configured

#### Scenario: Validate API key format
- **WHEN** a user inputs an API key
- **THEN** the system SHALL validate the key format starts with "sk_"
- **AND** ensure the key meets minimum length requirements
- **AND** display immediate feedback for invalid formats
- **AND** prevent API calls with invalidly formatted keys

### Requirement: API Key Status Indicator
The system SHALL provide visual indication of which API key is being used.

#### Scenario: Modify header to show API key status
- **WHEN** the application header renders
- **THEN** the system SHALL replace the user avatar with a key icon
- **AND** make the key icon clickable to show API key status
- **AND** position the key icon in the top-right corner of the header
- **AND** maintain consistent styling with other header elements

#### Scenario: Display API key status on click
- **WHEN** a user clicks the key icon in the header
- **THEN** the system SHALL display a dropdown or popover
- **AND** show current API key status ("Using Default Key" or "Using Your Key")
- **AND** display option to change or clear the API key
- **AND** include a link to ElevenLabs API key documentation

#### Scenario: Update status indicator dynamically
- **WHEN** a user configures a custom API key
- **THEN** the system SHALL update the status indicator
- **AND** change the key icon color or style to indicate custom key usage
- **AND** update the status text accordingly
- **WHEN** a user clears the custom API key
- **THEN** the system SHALL revert the status indicator to default state

### Requirement: API Key Testing and Validation
The system SHALL provide functionality to test API key validity before use.

#### Scenario: Test API key functionality
- **WHEN** a user inputs an API key
- **THEN** the system SHALL provide a "Test Key" button
- **AND** make a test API call to ElevenLabs voices endpoint
- **AND** display success message if the key works
- **AND** display specific error message if the key fails

#### Scenario: Handle API key test failures
- **WHEN** an API key test fails
- **THEN** the system SHALL display appropriate error message
- **AND** categorize errors (invalid, expired, insufficient permissions)
- **AND** provide guidance on how to resolve the issue
- **AND** prevent using invalid keys for TTS operations

### Requirement: Hybrid API Key Usage
The system SHALL support both client-side and server-side API keys with proper fallback.

#### Scenario: Use client-side API key when available
- **WHEN** a user has configured a custom API key
- **THEN** the system SHALL use the client-side key for all API calls
- **AND** pass the key in request headers to API routes
- **AND** prefer the client-side key over server-side environment variable

#### Scenario: Fallback to server-side API key
- **WHEN** no client-side API key is configured
- **THEN** the system SHALL use the server-side environment variable
- **AND** maintain backward compatibility with existing deployments
- **AND** display appropriate status indicating default key usage

#### Scenario: Handle missing API keys
- **WHEN** neither client-side nor server-side API key is available
- **THEN** the system SHALL display a clear error message
- **AND** guide users to configure an API key
- **AND** disable TTS functionality until a key is provided

### Requirement: API Key Security
The system SHALL handle API keys securely throughout the application lifecycle.

#### Scenario: Secure API key transmission
- **WHEN** making API calls with client-side keys
- **THEN** the system SHALL only transmit keys over HTTPS connections
- **AND** pass keys in HTTP headers (not URL parameters)
- **AND** ensure keys are not exposed in browser URLs or referrers

#### Scenario: Prevent API key logging
- **WHEN** processing API requests server-side
- **THEN** the system SHALL never log the actual API key value
- **AND** use generic log messages instead
- **AND** sanitize any error messages that might contain keys

#### Scenario: Memory management
- **WHEN** API keys are no longer needed in memory
- **THEN** the system SHALL clear sensitive data when possible
- **AND** minimize the time keys are held in memory
- **AND** avoid unnecessary key duplication in application state