import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { AdvancedFormArrayComponent } from '../advanced-form-array/advanced-form-array.component';

/**
 * Example component showing how to use reactive forms with FormArray.
 * This demonstrates integrating the shared form components into your application.
 */
@Component({
  selector: 'app-form-examples',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, AdvancedFormArrayComponent],
  template: `
    <div class="container">
      <h1>Reactive Forms with FormArray Examples</h1>

      <section>
        <h2>Basic Example - Dynamic Form</h2>
        <app-dynamic-form></app-dynamic-form>
      </section>

      <section>
        <h2>Advanced Example - Skills Management</h2>
        <app-advanced-form-array></app-advanced-form-array>
      </section>
    </div>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    section {
      margin-bottom: 40px;
      border-bottom: 2px solid #eee;
      padding-bottom: 20px;
    }

    h1 {
      color: #333;
      text-align: center;
    }

    h2 {
      color: #666;
      margin-bottom: 20px;
    }
  `,
})
export class FormExamplesComponent {}
