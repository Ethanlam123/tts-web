# UI Components Capability

## ADDED Requirements

### Requirement: Application Header
The system SHALL display a header with branding and navigation controls.

#### Scenario: Display header elements
- **WHEN** the application loads
- **THEN** the system SHALL display "AudioConverter" logo on the left side
- **AND** display "Dashboard" button in the header (non-functional placeholder)
- **AND** display "Upgrade" button in cyan/blue color
- **AND** display user avatar icon on the right side
- **AND** use dark background color for header

### Requirement: Page Title
The system SHALL display a prominent page title.

#### Scenario: Display dashboard title
- **WHEN** the dashboard renders
- **THEN** the system SHALL display "Text-to-Speech Dashboard" as the main heading
- **AND** use large, bold typography
- **AND** position title at the top of the content area

### Requirement: Upload Area UI
The system SHALL provide a visually distinct upload area matching the design mockup.

#### Scenario: Display upload area when no file loaded
- **WHEN** no file is currently loaded
- **THEN** the system SHALL display a large dashed-border upload area
- **AND** show a file icon at the center
- **AND** display "Upload text file" as heading
- **AND** show instruction text "Drag and drop a .txt file here or click the button below to start converting your text to audio."
- **AND** display "Upload .txt File" button in the center
- **AND** use dark background with subtle border

#### Scenario: Highlight upload area on drag over
- **WHEN** user drags a file over the upload area
- **THEN** the system SHALL change border color to indicate hover state
- **AND** provide visual feedback that drop is acceptable

### Requirement: Line Item Display
The system SHALL display text lines in a numbered list with status indicators and controls.

#### Scenario: Display line with number and text
- **WHEN** lines are rendered
- **THEN** each line SHALL display a sequential number (1, 2, 3...)
- **AND** display the line text content
- **AND** show status indicator dot (green/yellow/red)
- **AND** show status text ("Ready", "Generating...", "Error - failed to generate")
- **AND** align controls to the right side

#### Scenario: Display status indicator colors
- **WHEN** line status is "idle"
- **THEN** the system SHALL show no status indicator
- **WHEN** line status is "processing"
- **THEN** the system SHALL show yellow/orange dot with "Generating..." text
- **WHEN** line status is "ready"
- **THEN** the system SHALL show green dot with "Ready" text
- **WHEN** line status is "error"
- **THEN** the system SHALL show red dot with "Error - failed to generate" text

#### Scenario: Display line action buttons
- **WHEN** a line is displayed
- **THEN** the system SHALL show regenerate/refresh icon button
- **AND** show play/pause icon button (only when audio is ready)
- **AND** show delete/remove icon button
- **AND** use icon-only buttons with hover effects
- **AND** arrange buttons horizontally on the right side

### Requirement: Settings Sidebar
The system SHALL display a settings panel on the right side with controls and information.

#### Scenario: Display settings panel structure
- **WHEN** the dashboard renders
- **THEN** the system SHALL display "Settings & Controls" heading
- **AND** position panel on the right side of the screen
- **AND** use dark background matching the theme
- **AND** maintain fixed width for consistent layout

### Requirement: Voice Selection Dropdown
The system SHALL display a voice selection dropdown with clear labeling.

#### Scenario: Display voice dropdown
- **WHEN** settings panel renders
- **THEN** the system SHALL display "Default Voice" label
- **AND** show dropdown with current voice "Rachel (American, Female)"
- **AND** include descriptive format showing voice name, accent, and gender
- **AND** display helper text below: "This voice will be used for all lines by default. You can override it for individual lines on the left."
- **AND** use shadcn/ui Select component styling

### Requirement: Playback Speed Control
The system SHALL display a speed control slider with current value.

#### Scenario: Display speed slider
- **WHEN** settings panel renders
- **THEN** the system SHALL display "Playback Speed: 1.0x" label
- **AND** show horizontal slider with handle
- **AND** display current speed value next to label (e.g., "1.0x")
- **AND** use cyan/blue color for slider track fill
- **AND** allow range from 0.5x to 2.0x
- **AND** update value in real-time as slider moves

### Requirement: Action Buttons Panel
The system SHALL display primary action buttons in the settings panel.

#### Scenario: Display Generate All button
- **WHEN** settings panel renders
- **THEN** the system SHALL display "Generate All" button
- **AND** use bright cyan/blue background color
- **AND** include sparkle/magic wand icon
- **AND** make button full-width within settings panel
- **AND** position as first action button

#### Scenario: Display Download All button
- **WHEN** settings panel renders
- **THEN** the system SHALL display "Download All" button
- **AND** use dark gray/slate background color
- **AND** include download icon
- **AND** make button full-width within settings panel
- **AND** position below Generate All button

#### Scenario: Display Clear All button
- **WHEN** settings panel renders
- **THEN** the system SHALL display "Clear All" button
- **AND** use red text color with no background
- **AND** include trash/delete icon
- **AND** make button full-width within settings panel
- **AND** position below Download All button

#### Scenario: Disable buttons when appropriate
- **WHEN** no lines are loaded
- **THEN** the system SHALL disable "Generate All", "Download All", and "Clear All" buttons
- **AND** reduce opacity to indicate disabled state

### Requirement: Character Counter Display
The system SHALL display character count with progress visualization.

#### Scenario: Display character count
- **WHEN** settings panel renders with loaded lines
- **THEN** the system SHALL display "Character Count" label
- **AND** show count in format "1,254 / 10,000"
- **AND** display horizontal progress bar below count
- **AND** fill progress bar proportionally (e.g., 12.54% for 1,254 characters)
- **AND** use cyan/blue color for progress fill

#### Scenario: Update character count in real-time
- **WHEN** file is uploaded or lines change
- **THEN** the system SHALL recalculate total characters
- **AND** update displayed count immediately
- **AND** update progress bar fill percentage

#### Scenario: Warn when approaching limit
- **WHEN** character count exceeds 8,000 characters
- **THEN** the system SHALL change counter color to yellow/orange
- **AND** change progress bar color to indicate warning

### Requirement: Responsive Layout
The system SHALL adapt layout for different screen sizes.

#### Scenario: Desktop layout
- **WHEN** viewport width is >= 1024px
- **THEN** the system SHALL display two-column layout
- **AND** position main content area on the left (larger width)
- **AND** position settings panel on the right (fixed width ~300px)
- **AND** maintain side-by-side arrangement

#### Scenario: Mobile layout
- **WHEN** viewport width is < 1024px
- **THEN** the system SHALL stack content vertically
- **AND** display main content area first
- **AND** display settings panel below main content
- **AND** make settings panel full-width

### Requirement: Dark Theme Styling
The system SHALL use consistent dark theme colors throughout the interface.

#### Scenario: Apply color scheme
- **WHEN** the application renders
- **THEN** the system SHALL use dark blue/black background (#0f172a or similar)
- **AND** use cyan/blue accent color (#06b6d4 or similar) for primary actions
- **AND** use red color (#ef4444 or similar) for destructive actions and errors
- **AND** use green color (#22c55e or similar) for success states
- **AND** use yellow/orange color (#f59e0b or similar) for processing/warning states
- **AND** use gray shades for secondary elements and borders

### Requirement: Typography Hierarchy
The system SHALL maintain consistent typography throughout the interface.

#### Scenario: Apply text styles
- **WHEN** rendering text elements
- **THEN** the system SHALL use large bold font for main heading
- **AND** use medium font for section headings
- **AND** use regular font for body text and labels
- **AND** use monospace font for code-like elements (character count)
- **AND** maintain readable contrast ratios for accessibility

### Requirement: Icon Usage
The system SHALL use consistent icon library throughout the interface.

#### Scenario: Display icons from lucide-react
- **WHEN** rendering UI elements
- **THEN** the system SHALL use lucide-react icon library
- **AND** display sparkle/wand icon for "Generate All"
- **AND** display download icon for "Download All"
- **AND** display trash icon for "Clear All"
- **AND** display play icon for audio playback
- **AND** display refresh/rotate icon for regenerate
- **AND** display file icon in upload area
- **AND** maintain consistent icon sizes (16px-20px typically)

### Requirement: Interactive States
The system SHALL provide visual feedback for interactive elements.

#### Scenario: Button hover states
- **WHEN** user hovers over a button
- **THEN** the system SHALL slightly darken or brighten the background
- **AND** change cursor to pointer
- **AND** provide smooth transition animation

#### Scenario: Button disabled states
- **WHEN** a button is disabled
- **THEN** the system SHALL reduce opacity to 50%
- **AND** change cursor to not-allowed
- **AND** prevent click interactions

#### Scenario: Input focus states
- **WHEN** user focuses on an input or select element
- **THEN** the system SHALL display cyan/blue focus ring
- **AND** increase border visibility
- **AND** maintain accessibility standards
