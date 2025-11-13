# audio-management Specification

## Purpose
TBD - created by archiving change add-tts-audio-generation. Update Purpose after archive.
## Requirements
### Requirement: In-Memory Audio Storage
The system SHALL store generated audio in browser memory for the current session.

#### Scenario: Store audio blob
- **WHEN** audio generation completes successfully
- **THEN** the system SHALL store the audio blob in React state
- **AND** associate it with the corresponding line ID
- **AND** mark the line status as "ready"

#### Scenario: Clear audio on refresh
- **WHEN** the user refreshes the page
- **THEN** all stored audio SHALL be cleared from memory
- **AND** lines SHALL reset to initial state

#### Scenario: Memory management
- **WHEN** audio blobs are no longer needed
- **THEN** the system SHALL revoke object URLs to free memory
- **AND** remove blob references from state

### Requirement: Audio Playback Controls
The system SHALL provide audio playback controls for each generated audio line.

#### Scenario: Display audio player
- **WHEN** a line has generated audio
- **THEN** the system SHALL display an HTML5 audio player
- **AND** create an object URL from the audio blob
- **AND** set the audio source to the object URL

#### Scenario: Play audio
- **WHEN** a user clicks play on an audio player
- **THEN** the system SHALL play the audio
- **AND** apply the current speed setting via playbackRate

#### Scenario: Pause audio
- **WHEN** a user clicks pause during playback
- **THEN** the system SHALL pause the audio
- **AND** maintain the current playback position

#### Scenario: Seek audio
- **WHEN** a user drags the audio progress bar
- **THEN** the system SHALL update the playback position
- **AND** continue playing from the new position

#### Scenario: Apply speed control to playback
- **WHEN** the speed slider is adjusted
- **THEN** the system SHALL update playbackRate on all audio elements
- **AND** apply immediately to currently playing audio

### Requirement: Individual Audio Download
The system SHALL allow users to download individual audio files.

#### Scenario: Download single audio file
- **WHEN** a user clicks download button for a line with audio
- **THEN** the system SHALL create a downloadable link from the audio blob
- **AND** trigger browser download with filename format "line_XXX.mp3"
- **AND** use zero-padded line numbers (e.g., line_001.mp3)

### Requirement: Batch Audio Download
The system SHALL allow users to download all generated audio as a ZIP archive.

#### Scenario: Create ZIP archive
- **WHEN** a user clicks "Download All" button
- **THEN** the system SHALL collect all lines with generated audio
- **AND** create a ZIP file using JSZip library
- **AND** add each audio file with filename format "line_XXX.mp3"
- **AND** maintain line number order

#### Scenario: Trigger ZIP download
- **WHEN** ZIP archive creation completes
- **THEN** the system SHALL generate a blob URL for the ZIP
- **AND** trigger browser download with filename "tts_audio_YYYY-MM-DD.zip"
- **AND** include timestamp in filename

#### Scenario: Handle empty download
- **WHEN** a user clicks "Download All" with no generated audio
- **THEN** the system SHALL display a message indicating no audio to download
- **AND** not create or download an empty ZIP

#### Scenario: Download progress indication
- **WHEN** ZIP creation is in progress
- **THEN** the system SHALL display a loading indicator
- **AND** disable the "Download All" button
- **AND** show progress message

### Requirement: Audio Status Tracking
The system SHALL track and display the status of each audio line.

#### Scenario: Idle status
- **WHEN** a line has no audio and no processing in progress
- **THEN** the system SHALL display status as "Idle"
- **AND** show a "Generate" button

#### Scenario: Processing status
- **WHEN** audio generation is in progress for a line
- **THEN** the system SHALL display status as "Processing"
- **AND** show a loading spinner
- **AND** disable the generate button

#### Scenario: Ready status
- **WHEN** audio generation completes successfully
- **THEN** the system SHALL display status as "Ready"
- **AND** show the audio player
- **AND** change button to "Regenerate"

#### Scenario: Error status
- **WHEN** audio generation fails for a line
- **THEN** the system SHALL display status as "Error"
- **AND** show error message details
- **AND** allow user to retry with "Regenerate" button

### Requirement: Audio Player UI
The system SHALL provide a consistent audio player interface for all lines.

#### Scenario: Display player controls
- **WHEN** an audio player is shown
- **THEN** the system SHALL include play/pause button
- **AND** show progress bar
- **AND** display current time and duration
- **AND** include volume control

#### Scenario: Visual feedback during playback
- **WHEN** audio is playing
- **THEN** the system SHALL update progress bar in real-time
- **AND** show play icon changing to pause icon
- **AND** highlight the currently playing line

#### Scenario: Auto-stop other players
- **WHEN** a user starts playing audio on one line
- **THEN** the system MAY pause other currently playing audio
- **AND** allow only one audio to play at a time (optional)

### Requirement: Object URL Management
The system SHALL properly manage object URLs to prevent memory leaks.

#### Scenario: Create object URL
- **WHEN** audio blob is ready for playback
- **THEN** the system SHALL create an object URL using URL.createObjectURL
- **AND** store the URL reference with the line

#### Scenario: Revoke object URL
- **WHEN** a line's audio is regenerated or cleared
- **THEN** the system SHALL revoke the previous object URL
- **AND** create a new URL for the new audio blob

#### Scenario: Cleanup on unmount
- **WHEN** the component unmounts or page closes
- **THEN** the system SHALL revoke all object URLs
- **AND** free associated memory

### Requirement: Download Filename Conventions
The system SHALL use consistent naming conventions for downloaded audio files.

#### Scenario: Single file naming
- **WHEN** downloading an individual audio file
- **THEN** the filename SHALL be "line_XXX.mp3" where XXX is zero-padded line number
- **AND** line numbers SHALL be at least 3 digits (001, 002, ..., 010, 011)

#### Scenario: ZIP archive naming
- **WHEN** downloading all audio as ZIP
- **THEN** the filename SHALL be "tts_audio_YYYY-MM-DD_HHmmss.zip"
- **AND** include date and time to prevent overwriting previous downloads

#### Scenario: Preserve line order in ZIP
- **WHEN** creating ZIP archive
- **THEN** files SHALL be added in line number order
- **AND** maintain sequential numbering regardless of gaps in generation

