import { Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { TestHarnessComponent } from './custom-multiselect/test-harness/test-harness.component';

export const routes: Routes = [
  { path: '', component: DemoComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'test', component: TestHarnessComponent }
];
