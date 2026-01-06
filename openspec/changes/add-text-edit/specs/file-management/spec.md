# file-management Specification Delta

## ADDED Requirements

### Requirement: Line Text Editing
The system SHALL allow users to edit the text of individual lines after file upload.

#### Scenario: Enter edit mode
- **WHEN** a user clicks the Edit button on a line
- **THEN** the system SHALL replace the text display with a textarea
- **AND** pre-fill the textarea with the current line text
- **AND** auto-focus the textarea
- **AND** select all text for quick replacement
- **AND** display Save and Cancel buttons below the textarea

#### Scenario: Edit line text
- **WHEN** a user types in the textarea during edit mode
- **THEN** the system SHALL update the textarea value in real-time
- **AND** display character count
- **AND** allow any text input including newlines and special characters

#### Scenario: Save edited text
- **WHEN** a user clicks the Save button
- **THEN** the system SHALL validate the text is not empty
- **AND** validate the text is within character limits (10,000 max)
- **AND** trim leading/trailing whitespace
- **AND** update the line text in the application state
- **AND** mark existing audio as stale if line was in 'ready' status
- **AND** exit edit mode and return to normal display

#### Scenario: Cancel text editing
- **WHEN** a user clicks the Cancel button
- **THEN** the system SHALL discard any unsaved changes
- **AND** revert to the original line text
- **AND** exit edit mode and return to normal display

#### Scenario: Prevent invalid edits
- **WHEN** a user attempts to save empty text
- **THEN** the system SHALL display an error message
- **AND** prevent saving
- **AND** remain in edit mode
- **WHEN** a user attempts to save text exceeding 10,000 characters
- **THEN** the system SHALL display a warning message
- **AND** prevent saving
- **AND** remain in edit mode

#### Scenario: Disable edit during processing
- **WHEN** a line status is 'processing'
- **THEN** the system SHALL disable the Edit button
- **AND** show visual indication that editing is not available
- **AND** prevent entering edit mode

#### Scenario: Edit keyboard shortcuts
- **WHEN** in edit mode and user presses Enter key (without Ctrl/Cmd)
- **THEN** the system SHALL insert a newline in the textarea
- **WHEN** in edit mode and user presses Ctrl+Enter or Cmd+Enter
- **THEN** the system SHALL save changes and exit edit mode
- **WHEN** in edit mode and user presses Escape key
- **THEN** the system SHALL cancel edit and exit edit mode

### Requirement: Character Count Updates During Edit
The system SHALL update the total character count in real-time during text editing.

#### Scenario: Update count on text edit
- **WHEN** a user edits text and saves changes
- **THEN** the system SHALL recalculate total character count
- **AND** update the character counter in the settings sidebar
- **AND** update warning colors if approaching limits

### Requirement: Edit Mode Visual Design
The system SHALL provide clear visual distinction between edit and view modes.

#### Scenario: Edit mode textarea styling
- **WHEN** a line enters edit mode
- **THEN** the system SHALL display a textarea with proper focus ring
- **AND** use consistent styling with other input elements
- **AND** set minimum height to 80px
- **AND** allow textarea to grow with content (auto-grow)
- **AND** set maximum height with scroll for very long content

#### Scenario: Save and Cancel button styling
- **WHEN** in edit mode
- **THEN** the system SHALL display Save button with green/emerald color
- **AND** display Cancel button with gray/neutral color
- **AND** position buttons below textarea with proper spacing
- **AND** show proper hover and focus states

#### Scenario: Edit button styling
- **WHEN** displaying line action buttons
- **THEN** the system SHALL display Edit button with Pencil icon
- **AND** use consistent button size with other action buttons
- **AND** show "Edit text" tooltip on hover
- **AND** disable button styling when status is 'processing'

### Requirement: Line Update Callback
The system SHALL provide a callback for parent components to handle line text updates.

#### Scenario: Trigger line update callback
- **WHEN** a user saves edited text
- **THEN** the system SHALL call the onLineUpdate callback
- **AND** pass the line ID
- **AND** pass the new text content
- **AND** wait for parent to update state before exiting edit mode

#### Scenario: Handle update errors
- **WHEN** the onLineUpdate callback throws an error
- **THEN** the system SHALL display an error message
- **AND** remain in edit mode
- **AND** allow user to retry or cancel
