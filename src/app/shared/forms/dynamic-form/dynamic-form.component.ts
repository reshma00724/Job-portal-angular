import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { ReactiveFormService } from '../../services/reactive-form.service';

interface FormItem {
  name: string;
  email: string;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formService: ReactiveFormService
  ) {
    // Create form with items array
    this.form = this.formService.createFormWithArray(
      'items',
      1, // Start with 1 item
      () => this.createItem()
    );
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.formService.createFormGroup({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addItem(): void {
    this.formService.addItemToArray(this.items, () => this.createItem());
  }

  removeItem(index: number): void {
    this.formService.removeItemFromArray(this.items, index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Value:', this.form.value);
      const data: FormItem[] = this.form.value.items;
      console.log('Items:', data);
      // Process the form data
    } else {
      console.log('Form is invalid');
    }
  }

  resetForm(): void {
    this.formService.clearFormArray(this.items, () => this.createItem());
  }
}
