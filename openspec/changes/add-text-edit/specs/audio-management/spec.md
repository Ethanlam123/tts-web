# audio-management Specification Delta

## ADDED Requirements

### Requirement: Stale Audio Status
The system SHALL mark audio as stale when text is edited after generation.

#### Scenario: Mark audio as stale on text edit
- **WHEN** a user edits the text of a line with 'ready' status
- **THEN** the system SHALL change the line status from 'ready' to 'stale'
- **AND** preserve the existing audio blob
- **AND** preserve the existing audio URL
- **AND** keep the audio playable
- **AND** display visual indicator that audio is outdated

#### Scenario: Stale status state transition
- **WHEN** line status transitions to 'stale'
- **THEN** the system SHALL maintain all existing audio data
- **AND** update the status badge to show 'Stale - Regenerate'
- **AND** change status indicator color to amber/orange
- **AND** update line item border to amber color
- **AND** keep the Play button functional

#### Scenario: Regenerate audio from stale status
- **WHEN** a user clicks Regenerate on a line with 'stale' status
- **THEN** the system SHALL revoke the existing audio URL (URL.revokeObjectURL)
- **AND** clear the existing audio blob
- **AND** change status from 'stale' to 'processing'
- **AND** generate new audio with the updated text
- **AND** change status to 'ready' when generation completes
- **AND** store the new audio blob and URL

#### Scenario: Play stale audio
- **WHEN** a user clicks Play on a line with 'stale' status
- **THEN** the system SHALL play the existing audio
- **AND** show the stale badge during playback
- **AND** allow users to hear the outdated audio
- **AND** keep the Pause/Stop button functional
- **AND** maintain stale status after playback ends

#### Scenario: Edit text with other statuses
- **WHEN** a user edits text of a line with 'idle' status
- **THEN** the system SHALL keep status as 'idle'
- **AND** NOT mark as stale (no audio exists yet)
- **WHEN** a user edits text of a line with 'error' status
- **THEN** the system SHALL keep status as 'error'
- **AND** NOT mark as stale (no valid audio exists)
- **WHEN** a user edits text of a line with 'processing' status
- **THEN** the system SHALL prevent edit (Edit button disabled)
- **AND** NOT allow text changes during generation

### Requirement: Audio Status Tracking Extension
MODIFY: The system SHALL track audio generation and lifecycle status including stale state.

#### ADDED Scenario: Stale status definition
- **WHEN** audio exists but text has been modified
- **THEN** the system SHALL set status to 'stale'
- **AND** indicate regeneration is recommended
- **AND** preserve audio for comparison/reference
- **AND** allow user choice to keep or regenerate

#### ADDED Scenario: Status transition to stale
- **WHEN** onLineUpdate callback is triggered for a 'ready' line
- **THEN** the system SHALL set line.status = 'stale'
- **AND** preserve line.audioBlob
- **AND** preserve line.audioUrl
- **AND** trigger re-render to show updated status

#### ADDED Scenario: Stale status visual feedback
- **WHEN** displaying a line with 'stale' status
- **THEN** the system SHALL show amber/orange status badge
- **AND** display "Stale - Regenerate" text
- **AND** show AlertCircle icon in badge
- **AND** use amber border on line item
- **AND** keep Play button visible and functional

### Requirement: Object URL Management for Stale Audio
MODIFY: The system SHALL manage object URLs for stale audio properly.

#### ADDED Scenario: Preserve object URL for stale audio
- **WHEN** line status changes to 'stale'
- **THEN** the system SHALL NOT revoke the existing object URL
- **AND** keep the URL valid for playback
- **AND** maintain reference to audio blob
- **AND** allow normal audio operations

#### ADDED Scenario: Revoke object URL on stale regeneration
- **WHEN** regenerating audio from 'stale' status
- **THEN** the system SHALL revoke the old object URL
- **AND** clear the old audio blob reference
- **AND** create new object URL for new audio
- **AND** prevent memory leaks

### Requirement: Audio Player UI for Stale Status
MODIFY: The system SHALL display appropriate player controls for stale audio.

#### ADDED Scenario: Display player for stale audio
- **WHEN** line status is 'stale' and audio is available
- **THEN** the system SHALL display the Play/Pause button
- **AND** show the stale status badge
- **AND** allow normal playback controls
- **AND** indicate audio is outdated with visual cue

#### ADDED Scenario: Visual warning for stale audio playback
- **WHEN** playing audio from a line with 'stale' status
- **THEN** the system SHALL show the stale badge during playback
- **AND** maintain amber color scheme
- **AND** allow user to stop playback
- **AND** show Regenerate button as primary action

### Requirement: Download Handling for Stale Audio
MODIFY: The system SHALL handle stale audio in batch downloads.

#### ADDED Scenario: Include stale audio in ZIP download
- **WHEN** user downloads all audio as ZIP
- **THEN** the system SHALL include lines with 'stale' status
- **AND** use the existing (outdated) audio for those lines
- **AND** NOT prevent download due to stale status
- **AND** allow users to download mixed ready/stale audio

#### Scenario: Regenerate stale audio before download
- **WHEN** user wants to ensure all audio is current before download
- **THEN** the system SHALL provide option to regenerate all stale audio
- **AND** show count of stale lines
- **AND** allow batch regeneration of stale lines
- **AND** update download after regeneration completes
