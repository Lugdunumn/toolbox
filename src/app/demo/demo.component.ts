import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Item } from '../model';
import { mockItems } from '../mocks';
import { CustomMultiselectComponent } from '../custom-multiselect/custom-multiselect.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    CustomMultiselectComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Custom Multiselect Demo</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form">
          <app-custom-multiselect [items]="items()" formControlName="selectedItems"></app-custom-multiselect>
        </form>
        
        <div class="selected-values">
          <h3>Selected Values (IDs):</h3>
          <pre>{{ form.get('selectedItems')?.value | json }}</pre>
        </div>
        
        <div class="demo-buttons">
          <button mat-raised-button color="primary" (click)="setPresetValues()">Set Preset Values</button>
          <button mat-raised-button color="accent" (click)="clearValues()">Clear Values</button>
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
    
    .demo-buttons {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
  `]
})
export class DemoComponent implements OnInit {
  form: FormGroup;
  items = signal<Item[]>(mockItems);

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
  
  setPresetValues(): void {
    // Set a mix of parent and child IDs
    this.form.setValue({
      selectedItems: [3, 11, 42, 91]
    });
  }
  
  clearValues(): void {
    this.form.get('selectedItems')?.setValue([]);
  }
}