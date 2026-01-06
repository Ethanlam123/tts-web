# Change: Add Text Editing Capability

## Why
Currently, users cannot edit the text of individual lines after uploading a file. If a user notices a typo, wants to rephrase a sentence, or adjust pronunciation, they must delete the line and re-upload the entire file. Adding inline text editing will:

1. **Fix typos and errors** - Allow users to correct mistakes without re-uploading files
2. **Refine content** - Enable users to adjust wording for better audio pronunciation
3. **Improve workflow** - Eliminate the need to delete and recreate lines for minor changes
4. **Save API quota** - Users can edit text before generating, avoiding wasteful regeneration
5. **Enhanced flexibility** - Support iterative content improvement

## What Changes
- **Line Status Enhancement**: Add new `stale` status to indicate audio needs regeneration after text edit
- **Edit Button**: Add pencil/edit icon button to line item action buttons
- **Inline Edit Mode**: Replace text display with textarea when editing
- **Save/Cancel Actions**: Add save and cancel buttons during edit mode
- **Audio State Management**: Mark existing audio as stale when text is modified
- **Visual Indicators**: Show "Stale" badge with amber/orange color for lines needing regeneration

## Impact

### Affected Specs
- **file-management** (MODIFIED): Add text editing capability to line items
- **ui-components** (MODIFIED): Add edit button, edit mode UI, and stale status display
- **audio-management** (MODIFIED): Add stale status handling and visual indicators

### Affected Code
- `types/index.ts`: Add `stale` to LineStatus type union
- `components/LineItem.tsx`: Add edit button, edit mode toggle, save/cancel handlers
- `lib/status-helpers.ts`: Add status config for `stale` state
- `app/page.tsx`: Add `onLineUpdate` callback handler to update line text
- `components/LinesList.tsx`: Pass `onLineUpdate` prop to LineItem components

### Technical Considerations
- Edit mode uses controlled textarea with focus management
- Text changes preserve audio blob but mark it as stale (status change)
- Stale audio can still be played but shows visual indicator
- Character count updates in real-time during editing
- Edit mode disabled during audio generation (processing state)
- Cancel button reverts to original text without changes
