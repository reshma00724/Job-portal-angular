import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl,
  Validators,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ReactiveFormService {
  constructor(private fb: FormBuilder) {}

  /**
   * Create a FormGroup with nested FormArray
   * @param formArrayName - Name of the FormArray
   * @param initialItems - Number of initial form groups to create
   * @param createItemFn - Function that creates a FormGroup for each item
   * @param validators - Optional validators for the FormArray
   * @returns FormGroup with FormArray
   */
  createFormWithArray(
    formArrayName: string,
    initialItems: number = 1,
    createItemFn: () => FormGroup,
    validators?: ValidatorFn[]
  ): FormGroup {
    const formArray = this.createFormArray(initialItems, createItemFn, validators);
    return this.fb.group({
      [formArrayName]: formArray,
    });
  }

  /**
   * Create a FormArray with specified number of items
   * @param initialItems - Number of initial form groups
   * @param createItemFn - Function that creates a FormGroup for each item
   * @param validators - Optional validators for the FormArray
   * @returns FormArray
   */
  createFormArray(
    initialItems: number = 1,
    createItemFn: () => FormGroup,
    validators?: ValidatorFn[]
  ): FormArray {
    const controls = [];
    for (let i = 0; i < initialItems; i++) {
      controls.push(createItemFn());
    }
    return this.fb.array(controls, validators);
  }

  /**
   * Create a basic form group with common fields
   * @param fields - Object with field names and their configurations
   * @returns FormGroup
   */
  createFormGroup(fields: { [key: string]: any }): FormGroup {
    return this.fb.group(fields);
  }

  /**
   * Create a form group for name and email fields
   * @returns FormGroup with name and email controls
   */
  createNameEmailGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Create a form group for skill management
   * @returns FormGroup with skill fields
   */
  createSkillGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', [Validators.required, Validators.minLength(2)]],
      proficiency: ['intermediate', [Validators.required]],
      yearsOfExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
    });
  }

  /**
   * Create a form group for job experience
   * @returns FormGroup with job experience fields
   */
  createJobExperienceGroup(): FormGroup {
    return this.fb.group({
      company: ['', [Validators.required]],
      position: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });
  }

  /**
   * Validator to ensure minimum number of items in FormArray
   */
  minItemsValidator(min: number): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (formArray instanceof FormArray) {
        return formArray.length >= min ? null : { minItems: { min, actual: formArray.length } };
      }
      return null;
    };
  }

  /**
   * Validator to ensure maximum number of items in FormArray
   */
  maxItemsValidator(max: number): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (formArray instanceof FormArray) {
        return formArray.length <= max ? null : { maxItems: { max, actual: formArray.length } };
      }
      return null;
    };
  }

  /**
   * Add a new form group to the array
   * @param formArray - The FormArray to add to
   * @param createItemFn - Function that creates the new FormGroup
   */
  addItemToArray(formArray: FormArray, createItemFn: () => FormGroup): void {
    formArray.push(createItemFn());
    formArray.updateValueAndValidity();
  }

  /**
   * Remove an item from the array
   * @param formArray - The FormArray to remove from
   * @param index - Index of the item to remove
   */
  removeItemFromArray(formArray: FormArray, index: number): void {
    if (formArray.length > 1) {
      formArray.removeAt(index);
      formArray.updateValueAndValidity();
    }
  }

  /**
   * Clear all items from the FormArray and add one default item
   * @param formArray - The FormArray to clear
   * @param createItemFn - Function that creates the default FormGroup
   */
  clearFormArray(formArray: FormArray, createItemFn: () => FormGroup): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    formArray.push(createItemFn());
    formArray.updateValueAndValidity();
  }

  /**
   * Get all errors in the FormArray
   * @param formArray - The FormArray to check
   * @returns Array of error objects with index and errors
   */
  getFormArrayErrors(formArray: FormArray): any[] {
    const errors: any[] = [];
    formArray.controls.forEach((control, index) => {
      if (control.errors) {
        errors.push({ index, errors: control.errors });
      }
    });
    return errors;
  }

  /**
   * Check if FormArray has validation errors
   * @param formArray - The FormArray to check
   * @returns True if there are errors
   */
  hasFormArrayErrors(formArray: FormArray): boolean {
    return formArray.invalid || this.getFormArrayErrors(formArray).length > 0;
  }

  /**
   * Get form data as typed object
   * @param form - The FormGroup to extract data from
   * @returns Form value
   */
  getFormData<T = any>(form: FormGroup): T {
    return form.value as T;
  }

  /**
   * Reset form with default values
   * @param form - The FormGroup to reset
   * @param defaultValues - Optional default values
   */
  resetForm(form: FormGroup, defaultValues?: any): void {
    form.reset(defaultValues);
  }
}
