import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Item } from '../model';

@Component({
  selector: 'app-child-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule
  ],
  styles: [`
    .radio-group {
      display: flex;
      flex-direction: column;
      margin: 15px 0;
    }
    .radio-button {
      margin: 5px;
    }
  `],
  template: `
    <h2 mat-dialog-title>Select a child item</h2>
    <mat-dialog-content>
      <mat-radio-group [value]="selectedChild()" (change)="onSelectionChange($event)" class="radio-group">
        <mat-radio-button *ngFor="let child of data.parentItem.children" [value]="child" class="radio-button">
          {{ child.name }}
        </mat-radio-button>
      </mat-radio-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="selectedChild()" [disabled]="!selectedChild()">
        Select
      </button>
    </mat-dialog-actions>
  `
})
export class ChildSelectorDialogComponent {
  selectedChild = signal<Item | null>(null);
  
  onSelectionChange(event: any) {
    this.selectedChild.set(event.value);
  }
  
  constructor(
    public dialogRef: MatDialogRef<ChildSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parentItem: Item }
  ) {}
}
