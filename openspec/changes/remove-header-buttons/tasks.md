# Implementation Tasks

## 1. Specification Updates ✅
- [x] 1.1 Create proposal.md with change justification and impact analysis
- [x] 1.2 Create design.md with architectural decisions and migration plan
- [x] 1.3 Create spec delta in specs/ui-components/spec.md
- [x] 1.4 Create tasks.md with implementation checklist

## 2. Header Component Modification
- [ ] 2.1 Remove center navigation section from Header.tsx
  - [ ] 2.1.1 Delete the div containing Dashboard and Upgrade buttons
  - [ ] 2.1.2 Maintain flex layout with justify-between for logo and avatar
  - [ ] 2.1.3 Ensure proper spacing remains between elements
- [ ] 2.2 Clean up unused imports if any
  - [ ] 2.2.1 Check if any button-related imports can be removed
  - [ ] 2.2.2 Keep lucide-react User import for avatar functionality
- [ ] 2.3 Verify header styling remains consistent
  - [ ] 2.3.1 Ensure dark background styling is preserved
  - [ ] 2.3.2 Confirm border-bottom and backdrop-blur styling intact
  - [ ] 2.3.3 Validate header height (h-16) is maintained

## 3. Character Counter Simplification
- [ ] 3.1 Remove progress bar from character counter in SettingsSidebar.tsx
  - [ ] 3.1.1 Delete the progress bar div with rounded-full styling
  - [ ] 3.1.2 Remove progress fill div with dynamic width styling
  - [ ] 3.1.3 Keep character status logic for color-coded warnings
- [ ] 3.2 Simplify character counter layout
  - [ ] 3.2.1 Change from space-y-2 to simple flex justify-between layout
  - [ ] 3.2.2 Keep Character Count label and numeric display
  - [ ] 3.2.3 Maintain color-coded warning functionality
- [ ] 3.3 Test character counter functionality
  - [ ] 3.3.1 Verify character count updates in real-time
  - [ ] 3.3.2 Test color changes at 8,000+ (warning) and 10,000+ (error) thresholds
  - [ ] 3.3.3 Ensure proper formatting with locale string (e.g., "1,254 / 10,000")

## 4. Testing and Validation
- [ ] 4.1 Visual testing on different viewport sizes
  - [ ] 4.1.1 Test on mobile (< 768px width)
  - [ ] 4.1.2 Test on tablet (768px - 1024px width)
  - [ ] 4.1.3 Test on desktop (> 1024px width)
  - [ ] 4.1.4 Verify logo and avatar maintain proper spacing
  - [ ] 4.1.5 Verify character counter displays properly without progress bar
- [ ] 4.2 Interaction testing
  - [ ] 4.2.1 Test user avatar button click functionality
  - [ ] 4.2.2 Verify hover states work properly
  - [ ] 4.2.3 Test keyboard navigation (Tab key)
  - [ ] 4.2.4 Ensure focus management works correctly
- [ ] 4.3 Dark theme validation
  - [ ] 4.3.1 Confirm header uses correct dark background colors
  - [ ] 4.3.2 Verify text colors remain readable
  - [ ] 4.3.3 Check border and backdrop styling consistency
  - [ ] 4.3.4 Verify character counter color coding works with dark theme
- [ ] 4.4 Accessibility testing
  - [ ] 4.4.1 Verify ARIA labels are present for logo
  - [ ] 4.4.2 Test screen reader compatibility
  - [ ] 4.4.3 Validate proper semantic HTML structure
  - [ ] 4.4.4 Ensure color contrast meets accessibility standards

## 5. Final Validation
- [ ] 5.1 Run OpenSpec validation
  - [ ] 5.1.1 Execute `openspec validate remove-header-buttons --strict`
  - [ ] 5.1.2 Resolve any validation errors
  - [ ] 5.1.3 Ensure all requirements are properly addressed
- [ ] 5.2 Cross-browser testing
  - [ ] 5.2.1 Test in Chrome browser
  - [ ] 5.2.2 Test in Firefox browser
  - [ ] 5.2.3 Test in Safari browser (if available)
  - [ ] 5.2.4 Verify consistent behavior across browsers
- [ ] 5.3 Integration testing
  - [ ] 5.3.1 Test header and character counter within full application context
  - [ ] 5.3.2 Verify no conflicts with other components
  - [ ] 5.3.3 Test responsive layout with main content area
  - [ ] 5.3.4 Ensure header doesn't interfere with content scrolling
  - [ ] 5.3.5 Test character counter with different file sizes and edge cases

## 6. Documentation and Cleanup
- [ ] 6.1 Update any inline comments if needed
- [ ] 6.2 Verify component exports are correct
- [ ] 6.3 Check for any console warnings or errors
- [ ] 6.4 Prepare change summary for commit message