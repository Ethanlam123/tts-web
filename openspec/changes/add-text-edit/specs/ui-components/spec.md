# ui-components Specification Delta

## MODIFIED Requirements

### Requirement: Line Item Display
MODIFY: The system SHALL display all parsed lines with numbering, status, and edit capability.

#### ADDED Scenario: Display edit button
- **WHEN** displaying a line item
- **THEN** the system SHALL display an Edit button in the action buttons section
- **AND** position the Edit button between Regenerate and Delete buttons
- **AND** use the Pencil icon from lucide-react
- **AND** show "Edit text" tooltip on hover
- **AND** disable the button when line status is 'processing'

#### ADDED Scenario: Enter edit mode on button click
- **WHEN** a user clicks the Edit button
- **THEN** the system SHALL hide the line text display
- **AND** show a textarea with the current line text
- **AND** auto-focus the textarea and select all text
- **AND** hide the Edit, Regenerate, Delete, and Play buttons
- **AND** show Save and Cancel buttons below the textarea

#### ADDED Scenario: Display edit mode textarea
- **WHEN** a line is in edit mode
- **THEN** the system SHALL display a textarea element
- **AND** set textarea value to the current line text
- **AND** use consistent styling with form inputs
- **AND** show focus ring on textarea
- **AND** set minimum height of 80px
- **AND** allow textarea to grow with content up to 200px
- **AND** enable scroll for content beyond 200px

#### ADDED Scenario: Display save and cancel buttons in edit mode
- **WHEN** a line is in edit mode
- **THEN** the system SHALL display a Save button with checkmark icon
- **AND** display a Cancel button with X icon
- **AND** position buttons below the textarea
- **AND** use emerald/green color for Save button
- **AND** use gray/neutral color for Cancel button
- **AND** show proper hover and focus states
- **AND** maintain consistent button size with other action buttons

#### ADDED Scenario: Exit edit mode on save
- **WHEN** a user clicks the Save button in edit mode
- **THEN** the system SHALL validate the text is not empty
- **AND** validate character count is within limits
- **AND** call the onLineUpdate callback with line ID and new text
- **AND** hide the textarea and Save/Cancel buttons
- **AND** show the updated text in normal display mode
- **AND** restore the action buttons (Edit, Regenerate, Delete, Play)

#### ADDED Scenario: Exit edit mode on cancel
- **WHEN** a user clicks the Cancel button in edit mode
- **THEN** the system SHALL discard any unsaved changes
- **AND** hide the textarea and Save/Cancel buttons
- **AND** show the original text in normal display mode
- **AND** restore the action buttons

#### ADDED Scenario: Display character count during edit
- **WHEN** a line is in edit mode
- **THEN** the system SHALL display character count below the textarea
- **AND** format count as "XXX / 10,000 characters"
- **AND** update count in real-time as user types
- **AND** show warning color if approaching limit (>8,000)
- **AND** show error color if at limit (10,000)

#### ADDED Scenario: Validate edit mode input
- **WHEN** a user types in the edit mode textarea
- **THEN** the system SHALL update the textarea value in real-time
- **AND** update the character count
- **AND** prevent saving if text is empty after trim
- **AND** prevent saving if text exceeds 10,000 characters
- **AND** show error message for invalid input

#### ADDED Scenario: Handle keyboard shortcuts in edit mode
- **WHEN** in edit mode and user presses Ctrl+Enter or Cmd+Enter
- **THEN** the system SHALL trigger save action
- **WHEN** in edit mode and user presses Escape key
- **THEN** the system SHALL trigger cancel action
- **WHEN** in edit mode and user presses Enter without Ctrl/Cmd
- **THEN** the system SHALL insert a newline in the textarea

## ADDED Requirements

### Requirement: Stale Status Display
The system SHALL display visual indicators for lines with stale audio (text edited after generation).

#### Scenario: Display stale status badge
- **WHEN** a line status is 'stale'
- **THEN** the system SHALL display a status badge
- **AND** use amber/orange color scheme for the badge
- **AND** show "Stale - Regenerate" text
- **AND** display AlertCircle icon in the badge
- **AND** show badge with consistent styling as other status badges

#### Scenario: Stale status badge visual design
- **WHEN** displaying a stale status badge
- **THEN** the system SHALL use bg-amber-50 dark:bg-amber-500/10 for background
- **AND** use text-amber-700 dark:text-amber-400 for text color
- **AND** use border-amber-200 dark:border-amber-500/30 for border
- **AND** ensure proper contrast ratio for accessibility
- **AND** maintain visual consistency with other status badges

#### Scenario: Stale status border indicator
- **WHEN** a line status is 'stale'
- **THEN** the system SHALL display amber border around the line item
- **AND** use border-amber-300 dark:border-amber-500/40
- **AND** maintain consistent border width with other statuses
- **AND** ensure border is visible on both light and dark themes

#### Scenario: Play button visibility for stale status
- **WHEN** a line status is 'stale' and audio is available
- **THEN** the system SHALL display the Play button
- **AND** allow users to play the outdated audio
- **AND** show the stale badge to indicate audio doesn't match text
- **AND** keep the Regenerate button enabled

### Requirement: Edit Mode Accessibility
The system SHALL ensure edit mode is accessible via keyboard and screen readers.

#### Scenario: Keyboard navigation to edit button
- **WHEN** a user tabs through line item actions
- **THEN** the system SHALL include the Edit button in tab order
- **AND** allow activating edit mode with Enter or Space key
- **AND** provide clear focus indicator on the Edit button

#### Scenario: Textarea accessibility in edit mode
- **WHEN** a line enters edit mode
- **THEN** the system SHALL auto-focus the textarea
- **AND** provide aria-label for the textarea
- **AND** announce the edit mode to screen readers
- **AND** allow keyboard navigation within textarea

#### Scenario: Save/Cancel button accessibility
- **WHEN** in edit mode
- **THEN** the system SHALL allow tabbing to Save and Cancel buttons
- **AND** provide aria-labels for Save and Cancel buttons
- **AND** allow activation with Enter or Space key
- **AND** return focus to Edit button after cancel
- **AND** move focus to next line item after save

### Requirement: Edit Mode Responsive Design
The system SHALL ensure edit mode works correctly on mobile devices.

#### Scenario: Edit mode on mobile
- **WHEN** a user enters edit mode on a mobile device
- **THEN** the system SHALL display textarea with appropriate width
- **AND** ensure textarea is usable on touch devices
- **AND** adjust button layout for smaller screens
- **AND** maintain proper touch target sizes (44px minimum)

#### Scenario: Keyboard handling on mobile
- **WHEN** in edit mode on a mobile device
- **THEN** the system SHALL show keyboard on textarea focus
- **AND** provide Done button in keyboard toolbar
- **AND** handle keyboard dismissal without accidental save
- **AND** ensure textarea remains visible when keyboard is shown
