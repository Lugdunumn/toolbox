import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Item } from '../../model';
import { CustomMultiselectComponent } from '../custom-multiselect.component';

@Component({
  selector: 'app-test-harness',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    CustomMultiselectComponent
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Custom Multiselect Test Harness</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form">
          <app-custom-multiselect [items]="items" formControlName="selectedItems"></app-custom-multiselect>
        </form>
        
        <div class="selected-values">
          <h3>Selected Values (IDs):</h3>
          <pre>{{ form.get('selectedItems')?.value | json }}</pre>
        </div>
        
        <div class="test-buttons">
          <h3>Test Cases:</h3>
          <div class="button-group">
            <button mat-raised-button color="primary" (click)="setTestCase1()">Test Case 1: Parent Items</button>
            <button mat-raised-button color="accent" (click)="setTestCase2()">Test Case 2: Child Items</button>
            <button mat-raised-button color="warn" (click)="setTestCase3()">Test Case 3: Mixed Items</button>
            <button mat-raised-button (click)="clearValues()">Clear Values</button>
          </div>
          
          <h3>Dropdown Removal Tests:</h3>
          <div class="button-group">
            <button mat-raised-button color="primary" (click)="setUpDropdownRemovalTest()">Setup Dropdown Removal Test</button>
            <button mat-raised-button color="accent" (click)="testRemoveParentFromDropdown()">Test: Remove Parent from Dropdown</button>
            <button mat-raised-button color="warn" (click)="testRemoveChildFromDropdown()">Test: Remove Child from Dropdown</button>
          </div>
          
          <h3>Edge Cases:</h3>
          <div class="button-group">
            <button mat-raised-button color="primary" (click)="testLastItemRemoval()">Test: Remove Last Item</button>
            <button mat-raised-button color="accent" (click)="testMultipleSelections()">Test: Multiple Selections</button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .selected-values {
      margin-top: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    pre {
      white-space: pre-wrap;
    }
    
    .test-buttons {
      margin-top: 20px;
    }
    
    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    h3 {
      margin-top: 20px;
      margin-bottom: 10px;
    }
  `]
})
export class TestHarnessComponent implements OnInit {
  form: FormGroup;
  
  // Test data with various scenarios
  items: Item[] = [
    {
      id: 1,
      name: 'Category A',
      children: [
        { id: 11, name: 'Item A1', children: [] },
        { id: 12, name: 'Item A2', children: [] },
        { id: 13, name: 'Item A3', children: [] }
      ]
    },
    {
      id: 2,
      name: 'Category B',
      children: []
    },
    {
      id: 3,
      name: 'Category C',
      children: [
        { id: 31, name: 'Item C1', children: [] },
        { id: 32, name: 'Item C2', children: [] }
      ]
    },
    {
      id: 4,
      name: 'Category D',
      children: [
        { id: 41, name: 'Item D1', children: [] }
      ]
    },
    {
      id: 5,
      name: 'Category E',
      children: []
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedItems: [[]]
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(value => {
      console.log('Form value changed:', value);
    });
  }

  // Test case 1: Select parent items only
  setTestCase1(): void {
    this.form.setValue({
      selectedItems: [2, 5]
    });
  }

  // Test case 2: Select child items only
  setTestCase2(): void {
    this.form.setValue({
      selectedItems: [11, 31, 41]
    });
  }

  // Test case 3: Select a mix of parent and child items
  setTestCase3(): void {
    this.form.setValue({
      selectedItems: [2, 11, 32]
    });
  }

  clearValues(): void {
    this.form.get('selectedItems')?.setValue([]);
  }
  
  // Setup for dropdown removal test
  setUpDropdownRemovalTest(): void {
    // Set a mix of parent and child items for testing dropdown removal
    this.form.setValue({
      selectedItems: [2, 5, 11, 31]
    });
    console.log('Setup complete: Added items [2, 5, 11, 31] for dropdown removal testing');
  }
  
  // Test removing a parent item from the dropdown
  testRemoveParentFromDropdown(): void {
    console.log('Test: Open the dropdown and click on "Category B" in the Selected Items section');
    console.log('Expected result: "Category B" should be removed and reappear in Available Items');
  }
  
  // Test removing a child item from the dropdown
  testRemoveChildFromDropdown(): void {
    console.log('Test: Open the dropdown and click on "Item A1" in the Selected Items section');
    console.log('Expected result: "Item A1" should be removed and "Category A" should remain unavailable');
  }
  
  // Test removing the last selected item
  testLastItemRemoval(): void {
    // Set only one item
    this.form.setValue({
      selectedItems: [2]
    });
    console.log('Setup complete: Added only item [2] for last item removal test');
    console.log('Test: Open the dropdown and remove the only selected item');
    console.log('Expected result: Selected Items section should disappear, all items should be available');
  }
  
  // Test multiple selections without closing dropdown
  testMultipleSelections(): void {
    // Clear first
    this.clearValues();
    console.log('Test: Open the dropdown and select multiple items without closing it');
    console.log('Expected result: You should be able to select multiple items while the dropdown stays open');
  }
}