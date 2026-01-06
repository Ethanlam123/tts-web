# Design: Add Text Editing Capability

## Overview
This design enables users to edit text of individual lines after file upload, with automatic stale status marking for existing audio.

## Architecture Decisions

### 1. Status State Machine Extension
**Decision**: Extend LineStatus with `stale` state
**Rationale**: Provides clear visual feedback that audio no longer matches text
**Trade-offs**: Adds state complexity vs. clear user communication

```
idle -> processing -> ready
              \         |
               \        v
                \-> stale (on text edit when ready)
```

### 2. Edit Mode Pattern
**Decision**: Use local component state for edit mode
**Rationale**: Simple implementation, no global state management needed
**Trade-offs**: Edit state lost on unmount vs. simpler implementation

### 3. Audio Handling Strategy
**Decision**: Keep audio blob but mark as stale
**Rationale**: Allows playing old audio while warning it's outdated
**Trade-offs**: Potential confusion vs. flexibility for comparison

### 4. Button Placement
**Decision**: Add edit button next to existing action buttons
**Rationale**: Consistent with current UI patterns
**Trade-offs**: More buttons vs. discoverability

## Data Flow

### Edit Flow
```
1. User clicks Edit button
2. LineItem enters edit mode (local state)
3. Textarea replaces text display with current line.text
4. User edits text
5. User clicks Save or Cancel

Save path:
6a. Validation: text not empty, within limits
7a. Call onLineUpdate(lineId, newText)
8a. Parent updates line in state
9b. If line.status === 'ready', change to 'stale'
10a. Exit edit mode

Cancel path:
6b. Revert to original text
7b. Exit edit mode
```

### Regeneration Flow
```
1. User clicks Regenerate on stale line
2. Existing audio blob revoked (URL.revokeObjectURL)
3. Status changes: stale -> processing -> ready
4. New audio generated and stored
```

## Component Structure

### LineItem Component Changes
```typescript
interface LineItemProps {
  // ... existing props
  onLineUpdate: (lineId: string, newText: string) => void; // NEW
}

const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState(line.text);

// Edit mode UI
{isEditing ? (
  <textarea
    value={editText}
    onChange={(e) => setEditText(e.target.value)}
    autoFocus
    onFocus={(e) => e.target.select()}
  />
) : (
  <p>{line.text}</p>
)}
```

### Status Config Extension
```typescript
// lib/status-helpers.ts
const STATUS_CONFIG = {
  // ... existing
  stale: {
    icon: AlertCircle,
    text: 'Stale - Regenerate',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    textColor: 'text-amber-700 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-500/30',
  }
};
```

## Security Considerations
- No XSS risk: React auto-escapes textarea content
- Text validation prevents empty submissions
- Character limit enforced (10,000 max per line)

## Performance Considerations
- Edit mode is local state only (no network calls)
- Text updates are immediate (no debouncing needed)
- Audio blob preservation avoids unnecessary regeneration

## Edge Cases Handled
1. **Empty text after edit**: Prevent save, show error
2. **Edit during processing**: Disable edit button when status === 'processing'
3. **Very long text**: Textarea grows with content, max-height with scroll
4. **Multiple rapid edits**: Each save triggers parent update, React batches updates
5. **Edit then immediate regenerate**: Sequence preserved by state updates
