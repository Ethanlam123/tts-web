# Text-to-Speech Capability

## ADDED Requirements

### Requirement: ElevenLabs API Integration
The system SHALL integrate with ElevenLabs API using the official @elevenlabs/elevenlabs-js SDK for text-to-speech audio generation with the eleven_multilingual_v2 model.

#### Scenario: Initialize ElevenLabs client
- **WHEN** the API route initializes
- **THEN** the system SHALL create an ElevenLabsClient instance
- **AND** pass the API key from environment variable ELEVENLABS_API_KEY
- **AND** use the client for all API operations

#### Scenario: Fetch available voices
- **WHEN** the application loads
- **THEN** the system SHALL call elevenlabs.voices.getAll() method
- **AND** retrieve voice objects with voiceId, name, and labels
- **AND** return the voice list as JSON to the client

#### Scenario: Generate audio from text
- **WHEN** a user requests audio generation for a text line
- **THEN** the system SHALL call elevenlabs.textToSpeech.convert(voiceId, options)
- **AND** pass text, modelId as "eleven_multilingual_v2", and outputFormat as "mp3_44100_128"
- **AND** return the audio stream as a blob response

#### Scenario: Handle API authentication
- **WHEN** initializing the ElevenLabs client
- **THEN** the system SHALL read ELEVENLABS_API_KEY from environment variables
- **AND** pass the API key to the client constructor
- **AND** ensure the API key is never exposed to the client-side code

#### Scenario: Handle API rate limiting
- **WHEN** ElevenLabs API returns a rate limit error
- **THEN** the system SHALL catch the error in a try-catch block
- **AND** return a 429 status code with error message
- **AND** allow the user to retry the request

#### Scenario: Use multilingual model
- **WHEN** generating audio for any text line
- **THEN** the system SHALL specify modelId as "eleven_multilingual_v2"
- **AND** support 32 languages including English, Spanish, French, German, Chinese, Japanese, and more
- **AND** maintain consistent model usage across all generations

#### Scenario: Specify audio output format
- **WHEN** generating audio
- **THEN** the system SHALL use outputFormat "mp3_44100_128"
- **AND** generate MP3 audio at 44.1kHz sample rate with 128kbps bitrate
- **AND** return audio suitable for web playback

### Requirement: Voice Selection
The system SHALL allow users to select different voices for audio generation.

#### Scenario: Display voice options
- **WHEN** voices are successfully fetched
- **THEN** the system SHALL display all available voices in a dropdown menu
- **AND** show voice names clearly

#### Scenario: Select a voice
- **WHEN** a user selects a voice from the dropdown
- **THEN** the system SHALL store the selected voice ID
- **AND** use this voice for all subsequent audio generations
- **AND** persist the selection to localStorage

#### Scenario: Load saved voice preference
- **WHEN** the application loads
- **THEN** the system SHALL check localStorage for a saved voice ID
- **AND** pre-select that voice in the dropdown if it exists

### Requirement: Speed Control
The system SHALL allow users to adjust playback speed for generated audio.

#### Scenario: Display speed slider
- **WHEN** the settings panel is visible
- **THEN** the system SHALL display a speed slider ranging from 0.5x to 2.0x
- **AND** show the current speed value (e.g., "1.2x")

#### Scenario: Adjust playback speed
- **WHEN** a user moves the speed slider
- **THEN** the system SHALL update the speed value in real-time
- **AND** apply the new speed to all audio players via playbackRate
- **AND** persist the speed setting to localStorage

#### Scenario: Load saved speed preference
- **WHEN** the application loads
- **THEN** the system SHALL check localStorage for a saved speed value
- **AND** set the slider to that speed if it exists
- **AND** default to 1.0x if no saved preference exists

### Requirement: Line-by-Line Audio Generation
The system SHALL generate audio for individual text lines independently.

#### Scenario: Generate audio for single line
- **WHEN** a user clicks "Generate" button for a specific line
- **THEN** the system SHALL update line status to "processing"
- **AND** call the TTS API with the line text, selected voice, and speed
- **AND** store the returned audio blob with the line
- **AND** update line status to "ready" on success

#### Scenario: Display generation progress
- **WHEN** audio is being generated for a line
- **THEN** the system SHALL display a loading indicator on that line
- **AND** disable the generate button for that line

#### Scenario: Handle generation error
- **WHEN** audio generation fails for a line
- **THEN** the system SHALL update line status to "error"
- **AND** display an error message to the user
- **AND** allow the user to retry generation

### Requirement: Regenerate Audio
The system SHALL allow users to regenerate audio for individual lines.

#### Scenario: Regenerate audio
- **WHEN** a user clicks "Regenerate" button for a line with existing audio
- **THEN** the system SHALL clear the existing audio blob
- **AND** reset line status to "processing"
- **AND** generate new audio with current voice and speed settings
- **AND** update the audio player with the new audio

### Requirement: Batch Audio Generation
The system SHALL support generating audio for all lines at once.

#### Scenario: Generate all lines
- **WHEN** a user clicks "Generate All" button
- **THEN** the system SHALL process each line sequentially
- **AND** display progress indicator (e.g., "Line 5/20 processing...")
- **AND** disable the "Generate All" button during processing
- **AND** continue processing remaining lines if one fails

#### Scenario: Display batch progress
- **WHEN** batch generation is in progress
- **THEN** the system SHALL show current line number and total count
- **AND** update progress in real-time as each line completes
- **AND** show visual indicator for currently processing line

#### Scenario: Complete batch generation
- **WHEN** all lines have been processed
- **THEN** the system SHALL re-enable the "Generate All" button
- **AND** display completion message
- **AND** show summary of successful and failed generations

### Requirement: Character Counter
The system SHALL display the total character count for all lines.

#### Scenario: Display character count
- **WHEN** text lines are loaded
- **THEN** the system SHALL calculate total characters across all lines
- **AND** display count in format "X / 10,000"
- **AND** update count in real-time as lines change

#### Scenario: Warn on character limit
- **WHEN** total character count exceeds 8,000 characters
- **THEN** the system SHALL change counter color to indicate warning
- **AND** continue to allow generation (no hard limit enforced client-side)

### Requirement: API Route for Voice Listing
The system SHALL provide a Next.js API route to fetch available voices using the ElevenLabs SDK.

#### Scenario: GET request to /api/voices
- **WHEN** a GET request is made to /api/voices
- **THEN** the system SHALL initialize ElevenLabsClient with API key from environment
- **AND** call await elevenlabs.voices.getAll() to fetch voices
- **AND** return JSON response with voices array containing voiceId and name
- **AND** return 200 status code on success

#### Scenario: Handle voice fetch errors
- **WHEN** voice fetching fails
- **THEN** the system SHALL catch the error
- **AND** log the error details
- **AND** return 500 status code with error message
- **AND** prevent API key exposure in error response

### Requirement: API Route for Audio Generation
The system SHALL provide a Next.js API route to generate audio using the ElevenLabs SDK with eleven_multilingual_v2 model.

#### Scenario: POST request to /api/tts
- **WHEN** a POST request is made to /api/tts with text and voiceId
- **THEN** the system SHALL validate required parameters
- **AND** initialize ElevenLabsClient with API key from environment
- **AND** call await elevenlabs.textToSpeech.convert(voiceId, options) with modelId "eleven_multilingual_v2"
- **AND** stream the audio response with content-type "audio/mpeg"
- **AND** return audio blob data

#### Scenario: Validate request parameters
- **WHEN** /api/tts receives a request
- **THEN** the system SHALL validate that text is provided and non-empty
- **AND** validate that voiceId is provided and is a string
- **AND** return 400 status code with validation error message if validation fails

#### Scenario: Convert audio stream to response
- **WHEN** audio generation succeeds
- **THEN** the system SHALL convert the audio stream to buffer
- **AND** set response headers with content-type "audio/mpeg"
- **AND** return the audio buffer as response body
- **AND** return 200 status code

#### Scenario: Handle API errors
- **WHEN** ElevenLabs SDK throws an error
- **THEN** the system SHALL catch the error in try-catch block
- **AND** check if error is rate limit related (status 429)
- **AND** return appropriate HTTP status code (429 for rate limit, 500 for other errors)
- **AND** include user-friendly error message in JSON response body
- **AND** log detailed error for debugging
