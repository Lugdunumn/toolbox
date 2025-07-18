import { ChangeDetectionStrategy, Component, Input, OnInit, signal, computed, effect, input, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { Item } from '../model';
import { ChildSelectorDialogComponent } from './child-selector-dialog.component';

@Component({
  selector: 'app-custom-multiselect',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule,
    MatOptionModule
  ],
  templateUrl: './custom-multiselect.component.html',
  styleUrls: ['./custom-multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomMultiselectComponent,
      multi: true
    }
  ]
})
export class CustomMultiselectComponent implements ControlValueAccessor, OnInit {
  items = input.required<Item[]>();
  private _selectedIds = signal<number[]>([]);

  selectedItems = computed(() => this.findItemsByIds(this._selectedIds()));
  availableItems = computed(() => this.items().filter(item =>
    !this._selectedIds().includes(item.id) &&
    !item.children.some(child => this._selectedIds().includes(child.id))
  ));

  private _disabled = signal(false);
  disabled = computed(() => this._disabled());

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private dialog: MatDialog) {
    // Effect to notify form control when selected IDs change
    effect(() => {
      const ids = this._selectedIds();
      // Always notify the form control, even when the array is empty
      this.onChange(ids);
      this.onTouched();
    });
  }

  ngOnInit() {
    // No need to call updateDisplayItems as it's now handled by computed signals
  }

  onSelectionChange(event: any) {
    // Check if the item is already selected (should not happen with our current setup)
    if (event.value && event.value.some((item: Item) => this._selectedIds().includes(item.id))) {
      return;
    }
    // In multiple mode, we get the most recently selected item
    const selectedItem = event.value?.[event.value.length - 1] as Item;

    // Check if selectedItem exists before accessing its properties
    if (!selectedItem) {
      return;
    }

    if (selectedItem.children.length === 0) {
      // If item has no children, add it directly
      this.addItem(selectedItem);
    } else {
      // If item has children, open dialog
      this.openChildSelectionDialog(selectedItem);
    }

    // Clear the selection but don't close the dropdown
    setTimeout(() => {
      event.source.options.forEach((option: any) => option.deselect());
    });
  }

  isSelected(item: Item): boolean {
    return this._selectedIds().includes(item.id);
  }

  openChildSelectionDialog(parentItem: Item) {
    const dialogRef = this.dialog.open(ChildSelectorDialogComponent, {
      width: '300px',
      data: { parentItem }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addItem(result);
      }
    });
  }

  addItem(item: Item) {
    this._selectedIds.update(ids => [...ids, item.id]);
  }

  removeItem(item: Item) {
    this._selectedIds.update(ids => ids.filter(id => id !== item.id));
  }
  


  // ControlValueAccessor methods
  writeValue(ids: number[]): void {
    // Handle both null/undefined and empty arrays
    if (ids === null || ids === undefined) {
      this._selectedIds.set([]);
    } else {
      this._selectedIds.set(ids);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  private findItemsByIds(ids: number[]): Item[] {
    const result: Item[] = [];
    const items = this.items();

    for (const id of ids) {
      // Check in parent items
      const parentItem = items.find(item => item.id === id);
      if (parentItem) {
        result.push(parentItem);
        continue;
      }

      // Check in children items
      for (const parent of items) {
        const childItem = parent.children.find(child => child.id === id);
        if (childItem) {
          result.push(childItem);
          break;
        }
      }
    }

    return result;
  }
}
