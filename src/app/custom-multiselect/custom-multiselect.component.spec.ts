import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { CustomMultiselectComponent } from './custom-multiselect.component';
import { Item } from '../model';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CustomMultiselectComponent', () => {
  let component: CustomMultiselectComponent;
  let fixture: ComponentFixture<CustomMultiselectComponent>;
  let formBuilder: FormBuilder;

  // Mock data for testing
  const mockItems: Item[] = [
    {
      id: 1,
      name: 'Parent 1',
      children: [
        { id: 11, name: 'Child 1.1', children: [] },
        { id: 12, name: 'Child 1.2', children: [] }
      ]
    },
    {
      id: 2,
      name: 'Parent 2',
      children: []
    },
    {
      id: 3,
      name: 'Parent 3',
      children: [
        { id: 31, name: 'Child 3.1', children: [] }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        CustomMultiselectComponent
      ],
      providers: [
        FormBuilder,
        provideNoopAnimations(),
        provideRouter([]),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(CustomMultiselectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockItems);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct available items', () => {
    // Check if all items are available initially
    expect(component.availableItems().length).toBe(3);

    const availableIds = component.availableItems().map(item => item.id);
    expect(availableIds).toContain(1);
    expect(availableIds).toContain(2);
    expect(availableIds).toContain(3);
  });

  it('should add an item correctly', () => {
    // Add Parent 2
    component.addItem({ id: 2, name: 'Parent 2', children: [] });

    // Check if the item was added to selectedIds
    expect(component['_selectedIds']()).toContain(2);

    // Check if the item appears in selectedItems
    const selectedItems = component.selectedItems();
    expect(selectedItems.length).toBe(1);
    expect(selectedItems[0].id).toBe(2);

    // Check if the item is no longer available
    const availableIds = component.availableItems().map(item => item.id);
    expect(availableIds).not.toContain(2);
  });

  it('should remove an item correctly', () => {
    // First add an item
    component.addItem({ id: 2, name: 'Parent 2', children: [] });

    // Then remove it
    component.removeItem({ id: 2, name: 'Parent 2', children: [] });

    // Check if the item was removed from selectedIds
    expect(component['_selectedIds']()).not.toContain(2);

    // Check if the item is available again
    const availableIds = component.availableItems().map(item => item.id);
    expect(availableIds).toContain(2);
  });

  it('should handle dialog opening for items with children', () => {
    // Spy on the dialog open method
    const dialogSpy = spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => ({ subscribe: (fn: any) => fn(null) })
    } as any);

    // Call openChildSelectionDialog
    component.openChildSelectionDialog({
      id: 1,
      name: 'Parent 1',
      children: [
        { id: 11, name: 'Child 1.1', children: [] }
      ]
    });

    // Check if the dialog was opened with correct data
    expect(dialogSpy).toHaveBeenCalled();
    const dialogConfig = dialogSpy.calls.mostRecent().args[1];
    expect((dialogConfig?.data as any)?.parentItem?.id).toBe(1);
  });

  it('should handle form control setValue correctly', () => {
    // Set values using writeValue (simulating form control setValue)
    component.writeValue([2, 11]);

    // Check if the IDs were set correctly
    expect(component['_selectedIds']()).toContain(2);
    expect(component['_selectedIds']()).toContain(11);

    // Check if the correct items were selected
    const selectedItems = component.selectedItems();
    expect(selectedItems.length).toBe(2);
    expect(selectedItems.map(item => item.id)).toContain(2);
    expect(selectedItems.map(item => item.id)).toContain(11);
  });

  it('should update available items when selections change', () => {
    // First check all items are available
    expect(component.availableItems().length).toBe(3);

    // Add Parent 1
    component.addItem({ id: 1, name: 'Parent 1', children: [] });

    // Parent 1 should no longer be available
    expect(component.availableItems().length).toBe(2);
    expect(component.availableItems().map(item => item.id)).not.toContain(1);

    // Add Child 3.1
    component.addItem({ id: 31, name: 'Child 3.1', children: [] });

    // Parent 3 should no longer be available because its child is selected
    expect(component.availableItems().length).toBe(1);
    expect(component.availableItems().map(item => item.id)).not.toContain(3);
    expect(component.availableItems()[0].id).toBe(2);
  });

  it('should handle empty/null values correctly', () => {
    // First add some items
    component.addItem({ id: 2, name: 'Parent 2', children: [] });

    // Set null value
    component.writeValue(null!);

    // Check if selectedIds is empty
    expect(component['_selectedIds']().length).toBe(0);

    // Add some items again
    component.addItem({ id: 2, name: 'Parent 2', children: [] });

    // Set empty array
    component.writeValue([]);

    // Check if selectedIds is still empty
    expect(component['_selectedIds']().length).toBe(0);
  });

  it('should handle removing items from the upper part of the dropdown', () => {
    // First add some items
    component.addItem({ id: 2, name: 'Parent 2', children: [] });
    component.addItem({ id: 11, name: 'Child 1.1', children: [] });
    
    // Verify items are added
    expect(component['_selectedIds']()).toContain(2);
    expect(component['_selectedIds']()).toContain(11);
    
    // Simulate clicking on an item in the upper part (Selected Items section)
    // This is what happens when a user clicks on a custom-option in the dropdown
    component.removeItem({ id: 2, name: 'Parent 2', children: [] });
    
    // Verify the item was removed
    expect(component['_selectedIds']()).not.toContain(2);
    expect(component['_selectedIds']()).toContain(11); // Other item should remain
    
    // Verify the item is available again
    expect(component.availableItems().map(item => item.id)).toContain(2);
  });
  
  it('should handle selection change event', () => {
    // Create a mock event
    const mockEvent = {
      value: [{ id: 2, name: 'Parent 2', children: [] }],
      source: {
        options: [{
          deselect: jasmine.createSpy('deselect')
        }]
      }
    };

    // Call onSelectionChange
    component.onSelectionChange(mockEvent);

    // Check if the item was added
    expect(component['_selectedIds']()).toContain(2);
  });
});
