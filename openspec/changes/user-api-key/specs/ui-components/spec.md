# ui-components Specification Delta

## MODIFIED Requirements

### Requirement: Application Header
The system SHALL display a simplified header with branding and API key status indicator.

#### Scenario: Replace user avatar with key icon
- **WHEN** the application loads
- **THEN** the system SHALL display "AudioConverter" logo on the left side
- **AND** display a key icon instead of user avatar on the right side
- **AND** make the key icon clickable to show API key status
- **AND** use dark background color for header
- **AND** maintain proper spacing between logo and key icon

#### Scenario: Display API key status on key icon click
- **WHEN** a user clicks the key icon in the header
- **THEN** the system SHALL display a dropdown or popover menu
- **AND** show current API key status ("Using Default Key" or "Using Your Key")
- **AND** include option to configure or change API key
- **AND** provide link to settings or API key management
- **AND** close the dropdown when clicking outside

#### Scenario: Update key icon appearance based on status
- **WHEN** using default server-side API key
- **THEN** the system SHALL display key icon in default styling
- **WHEN** using user-provided API key
- **THEN** the system SHALL display key icon with distinct styling (e.g., different color)
- **AND** maintain consistent visual hierarchy with other header elements

## ADDED Requirements

### Requirement: API Key Input Component
The system SHALL provide a secure input component for API key management.

#### Scenario: Display API key input field
- **WHEN** API key configuration section renders
- **THEN** the system SHALL display a labeled input field
- **AND** use password-style input to mask the key characters
- **AND** provide a show/hide toggle button for key visibility
- **AND** include placeholder text for API key entry

#### Scenario: Show/hide API key visibility
- **WHEN** a user clicks the show/hide toggle
- **THEN** the system SHALL toggle between masked and visible key display
- **AND** maintain secure handling of the key value
- **AND** update the toggle button icon accordingly

#### Scenario: Validate API key input in real-time
- **WHEN** a user types in the API key input field
- **THEN** the system SHALL validate the key format as they type
- **AND** display validation feedback (error/success indicators)
- **AND** prevent form submission with invalid formats
- **AND** show helpful error messages for common issues

### Requirement: API Key Status Display
The system SHALL provide clear visual feedback about API key configuration status.

#### Scenario: Display current API key status
- **WHEN** API key settings section renders
- **THEN** the system SHALL display the current API key status
- **AND** show "Using Default Key" when no custom key is configured
- **AND** show "Using Your Key" when a custom key is active
- **AND** display key validation status when applicable

#### Scenario: Provide API key management actions
- **WHEN** displaying API key status
- **THEN** the system SHALL provide action buttons
- **AND** include "Test Key" button to validate API key functionality
- **AND** include "Clear Key" button when a custom key is configured
- **AND** include "Configure Key" button when no custom key is set

#### Scenario: Handle API key status changes
- **WHEN** a user successfully configures a new API key
- **THEN** the system SHALL update the status display immediately
- **AND** change the status text to "Using Your Key"
- **AND** update the header key icon appearance
- **AND** provide success feedback to the user

### Requirement: API Key Settings Section
The system SHALL integrate API key management into the settings sidebar.

#### Scenario: Add API key section to settings
- **WHEN** the settings sidebar renders
- **THEN** the system SHALL display an API key configuration section
- **AND** position it above or below existing settings sections
- **AND** maintain consistent styling with other settings controls
- **AND** include a section heading for API key management

#### Scenario: Integrate with existing settings layout
- **WHEN** API key section is displayed
- **THEN** the system SHALL maintain consistent spacing and typography
- **AND** use the same card/styling as other settings sections
- **AND** follow the established visual hierarchy
- **AND** ensure responsive behavior matches other settings

### Requirement: API Key Dropdown Menu
The system SHALL provide a dropdown menu for API key status and actions.

#### Scenario: Display dropdown menu on key icon click
- **WHEN** a user clicks the key icon in the header
- **THEN** the system SHALL display a dropdown menu positioned below the icon
- **AND** use consistent styling with other dropdown menus in the application
- **AND** include a backdrop or overlay to close when clicking outside
- **AND** maintain proper z-index layering

#### Scenario: Provide navigation options in dropdown
- **WHEN** the dropdown menu is displayed
- **THEN** the system SHALL include "API Key Status" section
- **AND** provide "Go to Settings" option for API key configuration
- **AND** include "Test Connection" option for key validation
- **AND** add "Help" or "Documentation" link for API key guidance

#### Scenario: Handle dropdown interactions
- **WHEN** a user interacts with dropdown menu items
- **THEN** the system SHALL execute the appropriate action
- **AND** close the dropdown after selection
- **AND** provide appropriate feedback for successful actions
- **AND** handle errors gracefully with informative messages