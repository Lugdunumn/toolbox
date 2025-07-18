# Custom Multiselect Component Testing Guide

This document outlines test cases for the Custom Multiselect component to ensure it works correctly in all scenarios.

## Automated Tests

Run the automated tests with:

```bash
ng test --include=src/app/custom-multiselect/custom-multiselect.component.spec.ts --no-watch
```

For zoneless mode testing, use:

```bash
ng test --include=src/app/custom-multiselect/custom-multiselect.component.spec.ts --no-watch --configuration=zoneless
```

### Notes for Zoneless Mode

The tests are designed to work in zoneless mode:

- No use of `fakeAsync` or `tick()`
- No use of `fixture.detectChanges()`
- Tests focus on component logic rather than DOM interactions
- Signal-based reactivity is tested directly

## Manual Testing with Test Harness

The test harness provides a UI for testing the component with different data sets. Access it at:

```
http://localhost:4200/test
```

### Test Cases

#### Basic Functionality

1. **Opening the dropdown**
   - Click on the select field
   - Verify that the dropdown opens and displays available items
   - Verify that items are properly categorized (Selected Items at top, Available Items below)

2. **Selecting items**
   - Click on an available item without children
   - Verify that it moves to the Selected Items section
   - Verify that a chip appears below the dropdown
   - Verify that the form value updates correctly

3. **Selecting items with children**
   - Click on an available item with children
   - Verify that a dialog opens showing the child items
   - Select a child item
   - Verify that the child item is added to Selected Items
   - Verify that the parent item is no longer available

4. **Removing items via chips**
   - Select several items
   - Click the remove button (x) on a chip
   - Verify that the item is removed from Selected Items
   - Verify that it reappears in Available Items
   - Verify that the form value updates correctly

5. **Removing items via dropdown**
   - Select several items
   - Open the dropdown
   - Click on an item in the Selected Items section
   - Verify that it's removed from Selected Items
   - Verify that it reappears in Available Items
   - Verify that the form value updates correctly

#### Form Integration

6. **Setting values programmatically**
   - Click "Test Case 1: Parent Items"
   - Verify that the specified parent items are selected
   - Verify that chips appear for these items
   - Verify that the form value shows the correct IDs

7. **Setting child values programmatically**
   - Click "Test Case 2: Child Items"
   - Verify that the specified child items are selected
   - Verify that chips appear for these items
   - Verify that the parent items of these children are no longer available
   - Verify that the form value shows the correct IDs

8. **Setting mixed values programmatically**
   - Click "Test Case 3: Mixed Items"
   - Verify that both parent and child items are selected correctly
   - Verify that chips appear for all items
   - Verify that the form value shows the correct IDs

9. **Clearing values**
   - Select several items
   - Click "Clear Values"
   - Verify that all selected items are removed
   - Verify that all chips disappear
   - Verify that all items are available again
   - Verify that the form value is an empty array

#### Edge Cases

10. **Checkbox state after deselection**
    - Select a parent item
    - Open the dropdown
    - Click on the item in Selected Items to remove it
    - Verify that when it reappears in Available Items, its checkbox is unchecked

11. **Multiple selections without closing dropdown**
    - Open the dropdown
    - Select an item
    - Verify that the dropdown remains open
    - Select another item
    - Verify that both items are selected correctly
    - Verify that the dropdown remains open

12. **Deselecting the last item**
    - Select only one item
    - Remove it (either via chip or dropdown)
    - Verify that the Selected Items section disappears
    - Verify that all items are available again
    - Verify that the form value is an empty array

## Browser Compatibility

Test the component in the following browsers:
- Chrome
- Firefox
- Safari
- Edge

## Responsive Testing

Test the component at different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## Accessibility Testing

- Verify that the component can be navigated using keyboard only
- Verify that screen readers can properly announce the component state
- Verify that the component has proper focus management