# Implementation Tasks

## 1. Type Definitions ✅
- [x] 1.1 Create proposal.md with change justification and impact analysis
- [x] 1.2 Create design.md with architecture decisions and state machine
- [x] 1.3 Create spec deltas for file-management, ui-components, and audio-management
- [x] 1.4 Create tasks.md with implementation checklist

## 2. Type System Updates ✅
- [x] 2.1 Extend LineStatus type
  - [x] 2.1.1 Add 'stale' to LineStatus type union in types/index.ts
  - [x] 2.1.2 Update any type guards that check LineStatus
  - [x] 2.1.3 Verify no existing code breaks with new status

## 3. Status Helpers Enhancement ✅
- [x] 3.1 Add stale status configuration
  - [x] 3.1.1 Add stale config to getStatusConfig() in lib/status-helpers.ts
  - [x] 3.1.2 Define visual properties (bg, text, border colors)
  - [x] 3.1.3 Add AlertCircle icon for stale status
  - [x] 3.1.4 Add stale border classes to getStatusBorderClasses()

## 4. LineItem Component - Edit Mode ✅
- [x] 4.1 Add edit mode state management
  - [x] 4.1.1 Add isEditing state variable
  - [x] 4.1.2 Add editText state variable for edited text
  - [x] 4.1.3 Add handleEditStart function to enter edit mode
  - [x] 4.1.4 Add handleEditSave function to save changes
  - [x] 4.1.5 Add handleEditCancel function to cancel changes
- [x] 4.2 Add edit button to action buttons
  - [x] 4.2.1 Import Pencil icon from lucide-react
  - [x] 4.2.2 Add edit button between Regenerate and Delete
  - [x] 4.2.3 Disable edit button when status === 'processing'
  - [x] 4.2.4 Add tooltip "Edit text"
- [x] 4.3 Implement edit mode UI
  - [x] 4.3.1 Conditionally render textarea vs. text display
  - [x] 4.3.2 Add auto-focus and text selection on edit start
  - [x] 4.3.3 Style textarea with proper dimensions and borders
  - [x] 4.3.4 Add character count indicator during edit
- [x] 4.4 Add save/cancel buttons in edit mode
  - [x] 4.4.1 Add checkmark icon for Save button
  - [x] 4.4.2 Add X icon for Cancel button
  - [x] 4.4.3 Position buttons below textarea
  - [x] 4.4.4 Add proper styling and hover states
- [x] 4.5 Add edit validation
  - [x] 4.5.1 Prevent saving empty text
  - [x] 4.5.2 Enforce character limit (10,000 per line)
  - [x] 4.5.3 Show error message for invalid input
  - [x] 4.5.4 Trim whitespace before save

## 5. LinesList Component Integration ✅
- [x] 5.1 Add onLineUpdate callback
  - [x] 5.1.1 Add onLineUpdate to LinesListProps interface
  - [x] 5.1.2 Pass onLineUpdate prop to LineItem components
  - [x] 5.1.3 Add line update counter for real-time stats

## 6. Main Dashboard Integration ✅
- [x] 6.1 Implement line update handler
  - [x] 6.1.1 Create handleLineUpdate function in app/page.tsx
  - [x] 6.1.2 Update lines array with new text
  - [x] 6.1.3 Change status from 'ready' to 'stale' when text edited
  - [x] 6.1.4 Recalculate total character count
- [x] 6.2 Pass handler to LinesList
  - [x] 6.2.1 Pass handleLineUpdate as onLineUpdate prop
  - [x] 6.2.2 Verify state updates trigger re-renders

## 7. Audio State Management for Stale Status ✅
- [x] 7.1 Handle stale status in audio generation
  - [x] 7.1.1 Modify generateAudio to accept stale status
  - [x] 7.1.2 Revoke existing audio URL when regenerating from stale
  - [x] 7.1.3 Update stale -> processing -> ready flow
- [x] 7.2 Update playback handling for stale audio
  - [x] 7.2.1 Allow playback of stale audio (user choice)
  - [x] 7.2.2 Show visual indicator that audio is outdated

## 8. Visual Design and Styling ✅
- [x] 8.1 Style stale status badge
  - [x] 8.1.1 Use amber/orange color scheme for stale
  - [x] 8.1.2 Add subtle animation for stale badge
  - [x] 8.1.3 Ensure accessibility with proper contrast
- [x] 8.2 Style edit mode elements
  - [x] 8.2.1 Design textarea with focus ring
  - [x] 8.2.2 Style save/cancel buttons with proper colors
  - [x] 8.2.3 Add smooth transitions between view/edit modes
- [x] 8.3 Responsive design for edit mode
  - [x] 8.3.1 Ensure textarea works on mobile
  - [x] 8.3.2 Test button layout on small screens
  - [x] 8.3.3 Verify keyboard navigation (Enter to save, Esc to cancel)

## 9. Testing and Validation ✅
- [x] 9.1 Test edit mode functionality
  - [x] 9.1.1 Test entering edit mode
  - [x] 9.1.2 Test editing text and saving
  - [x] 9.1.3 Test canceling edit (revert)
  - [x] 9.1.4 Test edit with empty text validation
  - [x] 9.1.5 Test edit with very long text
- [x] 9.2 Test stale status behavior
  - [x] 9.2.1 Verify status changes to stale after edit
  - [x] 9.2.2 Test regenerating from stale status
  - [x] 9.2.3 Verify stale badge displays correctly
  - [x] 9.2.4 Test playback of stale audio
- [x] 9.3 Test edge cases
  - [x] 9.3.1 Test edit during audio generation (should be disabled)
  - [x] 9.3.2 Test rapid edit-save-edit sequences
  - [x] 9.3.3 Test edit on lines with error status
  - [x] 9.3.4 Test character limit enforcement
- [x] 9.4 Cross-browser testing
  - [x] 9.4.1 Test edit mode in Chrome
  - [x] 9.4.2 Test in Firefox browser
  - [x] 9.4.3 Test in Safari browser
  - [x] 9.4.4 Verify consistent behavior

## 10. Final Validation and Cleanup ✅
- [x] 10.1 Run OpenSpec validation
  - [x] 10.1.1 Execute `openspec validate add-text-edit --strict`
  - [x] 10.1.2 Resolve any validation errors
  - [x] 10.1.3 Ensure all requirements are properly addressed
- [x] 10.2 Integration testing
  - [x] 10.2.1 Test complete workflow: upload -> edit -> regenerate -> download
  - [x] 10.2.2 Verify character count updates correctly
  - [x] 10.2.3 Test with multiple lines edited in sequence
  - [x] 10.2.4 Verify no memory leaks from state changes
- [x] 10.3 Documentation and cleanup
  - [x] 10.3.1 Update inline comments if needed
  - [x] 10.3.2 Verify component exports are correct
  - [x] 10.3.3 Check for console warnings or errors
  - [x] 10.3.4 Prepare change summary for commit message
