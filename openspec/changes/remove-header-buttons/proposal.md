# Change: Remove Header Navigation Buttons and Usage Progress Bar

## Why
The Dashboard and Upgrade buttons in the header are currently non-functional placeholders that serve no practical purpose in the single-page TTS application. Additionally, the character count progress bar adds visual complexity without providing significant value beyond the numeric count itself. Removing these elements will:

1. **Simplify the UI** - Eliminate confusing placeholder elements and reduce visual noise
2. **Reduce visual clutter** - Create a cleaner, more focused interface centered on the core TTS functionality
3. **Improve user experience** - Prevent user frustration from clicking non-functional buttons
4. **Streamline header and sidebar layout** - Create better visual balance and reduce cognitive load
5. **Maintain essential information** - Keep the character count which is actually useful for users

## What Changes
- **Header Component Update**: Remove the "Dashboard" and "Upgrade" buttons from the Header component
- **Settings Sidebar Update**: Remove the progress bar from character counter, keep only the numeric count
- **UI Layout Simplification**: Center the AudioConverter logo with user avatar on the right
- **Character Counter Simplification**: Display "X,XXX / 10,000 characters" without visual progress bar
- **Visual Design Refinement**: Maintain dark theme styling and responsive behavior
- **Specification Update**: Remove requirements for placeholder navigation buttons and progress bar

## Impact

### Affected Specs
- **ui-components** (MODIFIED): Remove header navigation button requirements, simplify header layout requirements, update character counter requirements

### Affected Code
- `components/Header.tsx`: Remove center navigation section with Dashboard and Upgrade buttons
- `components/SettingsSidebar.tsx`: Remove progress bar from character counter, keep only text display
- `openspec/specs/ui-components/spec.md`: Update Application Header and Character Counter requirements

### Technical Considerations
- No functional impact on core TTS features
- Maintains responsive header behavior
- Preserves accessibility and user avatar functionality
- Keeps header styling consistent with dark theme
- Maintains character count functionality while simplifying visual representation