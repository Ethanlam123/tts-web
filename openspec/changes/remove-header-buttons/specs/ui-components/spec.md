# ui-components Specification Delta

## MODIFIED Requirements

### Requirement: Application Header
The system SHALL display a simplified header with branding and user controls.

#### Scenario: Display simplified header elements
- **WHEN** the application loads
- **THEN** the system SHALL display "AudioConverter" logo on the left side
- **AND** display user avatar icon on the right side
- **AND** use dark background color for header
- **AND** maintain proper spacing between logo and avatar
- **AND** use flex justify-between layout for balanced positioning

#### Scenario: Remove placeholder navigation buttons
- **WHEN** the header renders
- **THEN** the system SHALL NOT display "Dashboard" button
- **AND** SHALL NOT display "Upgrade" button
- **AND** SHALL maintain clean layout without center navigation section

#### Scenario: Maintain header styling and behavior
- **WHEN** the header renders
- **THEN** the system SHALL maintain dark background with backdrop blur
- **AND** preserve border-bottom styling
- **AND** keep responsive behavior for different screen sizes
- **AND** maintain header height (h-16) for consistent layout
- **AND** preserve user avatar hover and interaction states

#### Scenario: Display header with proper accessibility
- **WHEN** the header renders
- **THEN** the system SHALL maintain proper ARIA labeling for logo
- **AND** ensure user avatar button is keyboard accessible
- **AND** maintain proper focus management
- **AND** preserve semantic HTML structure

### Requirement: Character Counter Display
The system SHALL display character count with color-coded warnings but without visual progress bar.

#### Scenario: Display simplified character count
- **WHEN** the settings panel renders with loaded lines
- **THEN** the system SHALL display "Character Count" label
- **AND** show count in format "X,XXX / 10,000"
- **AND** SHALL NOT display a progress bar below the count
- **AND** maintain compact layout with just the numeric display

#### Scenario: Update character count in real-time
- **WHEN** file is uploaded or lines change
- **THEN** the system SHALL recalculate total characters
- **AND** update displayed count immediately
- **AND** maintain color-coded warnings based on thresholds

#### Scenario: Warn when approaching limit
- **WHEN** character count exceeds 8,000 characters
- **THEN** the system SHALL change counter color to yellow/orange
- **WHEN** character count exceeds 10,000 characters
- **THEN** the system SHALL change counter color to red

#### Scenario: Display character counter with proper spacing
- **WHEN** the character counter renders
- **THEN** the system SHALL maintain proper spacing with other settings panel elements
- **AND** ensure text remains readable with color coding
- **AND** use consistent typography with other sidebar elements