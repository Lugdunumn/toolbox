import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { CustomMultiselectComponent } from '../custom-multiselect.component';
import { CustomMultiselectHarness } from './custom-multiselect-harness';
import { Item } from '../../model';
import { HarnessLoader } from '@angular/cdk/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';

// Test host component to simulate real usage
@Component({
  template: `
    <form [formGroup]="form">
      <app-custom-multiselect [items]="items" formControlName="selectedItems"></app-custom-multiselect>
    </form>
  `,
  imports: [CustomMultiselectComponent, ReactiveFormsModule],
})
class TestHostComponent {
  form: FormGroup;
  items: Item[] = [
    {
      id: 1,
      name: 'Category A',
      children: [
        { id: 11, name: 'Item A1', children: [] },
        { id: 12, name: 'Item A2', children: [] }
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
        { id: 31, name: 'Item C1', children: [] }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedItems: [[]]
    });
  }

  setSelectedItems(ids: number[]): void {
    this.form.get('selectedItems')?.setValue(ids);
  }

  getSelectedItems(): number[] {
    return this.form.get('selectedItems')?.value;
  }
}

describe('CustomMultiselectHarness', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let loader: HarnessLoader;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatChipsModule,
        CustomMultiselectComponent,
        TestHostComponent
      ],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable()
  });

  it('should load harness for custom multiselect', async () => {
    const multiselectHarness = await loader.getHarness(CustomMultiselectHarness);
    expect(multiselectHarness).toBeTruthy();
  });

  it('should be able to open and close the dropdown', async () => {
    const multiselectHarness = await loader.getHarness(CustomMultiselectHarness);

    // Initially closed
    expect(await multiselectHarness.isOpen()).toBe(false);

    // Open
    await multiselectHarness.open();
    expect(await multiselectHarness.isOpen()).toBe(true);

    // Close
    await multiselectHarness.close();
    expect(await multiselectHarness.isOpen()).toBe(false);
  });

  it('should be able to select an item', async () => {
    const multiselectHarness = await loader.getHarness(CustomMultiselectHarness);

    // Select Category B
    await multiselectHarness.selectItemByName('Category B');

    // Check if it was selected
    const selectedIds = await multiselectHarness.getSelectedIds();
    expect(selectedIds).toContain(2);

    // Check if chip was created
    const selectedNames = await multiselectHarness.getSelectedItemNames();
    expect(selectedNames).toContain('Category B');
  });

  it('should be able to remove an item by chip', async () => {
    const multiselectHarness = await loader.getHarness(CustomMultiselectHarness);

    // First select an item
    testHost.setSelectedItems([2]); // Category B
    await fixture.whenStable();

    // Check if it was selected
    expect(await multiselectHarness.getSelectedItemCount()).toBe(1);

    // Remove it
    await multiselectHarness.removeItemByChip('Category B');

    // Check if it was removed
    expect(await multiselectHarness.getSelectedItemCount()).toBe(0);
    expect(testHost.getSelectedItems().length).toBe(0);
  });

  it('should be able to remove an item from dropdown', async () => {
    const multiselectHarness = await loader.getHarness(CustomMultiselectHarness);

    // First select multiple items
    testHost.setSelectedItems([2, 11]); // Category B and Item A1
    await fixture.whenStable();

    // Check if they were selected
    expect(await multiselectHarness.getSelectedItemCount()).toBe(2);

    // Remove Category B from dropdown
    await multiselectHarness.removeItemFromDropdown('Category B');

    // Check if it was removed
    const selectedNames = await multiselectHarness.getSelectedItemNames();
    expect(selectedNames).not.toContain('Category B');
    expect(selectedNames).toContain('Item A1');

    // Check form value
    const formValue = testHost.getSelectedItems();
    expect(formValue).not.toContain(2);
    expect(formValue).toContain(11);
  });

  it('should be able to clear all items', async () => {
    const multiselectHarness = await loader.getHarness(CustomMultiselectHarness);

    // First select multiple items
    testHost.setSelectedItems([2, 11, 31]); // Category B, Item A1, Item C1
    await fixture.whenStable();

    // Check if they were selected
    expect(await multiselectHarness.getSelectedItemCount()).toBe(3);

    // Clear all
    await multiselectHarness.clearAll();

    // Check if all were removed
    expect(await multiselectHarness.getSelectedItemCount()).toBe(0);
    expect(testHost.getSelectedItems().length).toBe(0);
  });
});
