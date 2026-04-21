# Reactive Forms with FormArray

This folder contains reusable components and services for working with Angular Reactive Forms and FormArray using standard Angular form controls.

## Files Overview

### Components

1. **DynamicFormComponent** (`dynamic-form/`)
   - Basic example of reactive form with FormArray
   - Add/remove dynamic form items (name/email)
   - Basic validation (required, email, minlength)
   - Suitable for simple use cases

2. **AdvancedFormArrayComponent** (`advanced-form-array/`)
   - Advanced example using the ReactiveFormService
   - Skills management with proficiency levels
   - Min/max items validation
   - Suitable for production use

### Services

**ReactiveFormService** (`shared/services/reactive-form.service.ts`)
- Service for creating and managing FormArray with standard Angular forms
- Provides helper methods for common form operations
- Includes custom validators for min/max items
- Full test coverage

## Usage Examples

### Basic Usage - DynamicFormComponent

```typescript
import { DynamicFormComponent } from '@shared/forms/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-my-form',
  template: `<app-dynamic-form></app-dynamic-form>`,
  imports: [DynamicFormComponent],
})
export class MyFormComponent {}
```

### Advanced Usage - Using ReactiveFormService

```typescript
import { ReactiveFormService } from '@shared/services/reactive-form.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-my-advanced-form',
  template: `<app-advanced-form-array></app-advanced-form-array>`,
  imports: [AdvancedFormArrayComponent],
})
export class MyAdvancedFormComponent {
  form: FormGroup;

  constructor(private formService: ReactiveFormService) {
    // Create form with skills array
    this.form = this.formService.createFormWithArray(
      'skills',
      1, // Start with 1 skill
      () => this.createSkillGroup(),
      [
        this.formService.minItemsValidator(1),
        this.formService.maxItemsValidator(10)
      ]
    );
  }

  private createSkillGroup(): FormGroup {
    return this.formService.createFormGroup({
      skillName: ['', [Validators.required, Validators.minLength(2)]],
      proficiency: ['intermediate', [Validators.required]],
      yearsOfExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
    });
  }
}
```

## Service Methods

### Creating Forms

```typescript
// Create form with FormArray
const form = service.createFormWithArray(
  'items',        // FormArray name
  1,              // Initial items count
  () => createItemGroup(), // Function to create each item
  [validators]    // Optional FormArray validators
);

// Create standalone FormArray
const formArray = service.createFormArray(
  2,              // Initial items
  () => createItemGroup(),
  [validators]
);

// Create FormGroup
const group = service.createFormGroup({
  name: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]]
});
```

### Pre-built Form Groups

```typescript
// Name and email group
const nameEmailGroup = service.createNameEmailGroup();

// Skill management group
const skillGroup = service.createSkillGroup();

// Job experience group
const jobGroup = service.createJobExperienceGroup();
```

### Managing FormArray Items

```typescript
// Add item
service.addItemToArray(formArray, () => createNewGroup());

// Remove item
service.removeItemFromArray(formArray, index);

// Clear and reset
service.clearFormArray(formArray, () => createDefaultGroup());
```

### Validation

```typescript
// Min/max item validators
const minValidator = service.minItemsValidator(1);
const maxValidator = service.maxItemsValidator(10);

// Check errors
const errors = service.getFormArrayErrors(formArray);
const hasErrors = service.hasFormArrayErrors(formArray);
```

## Template Best Practices

### Using @for Instead of *ngFor

```html
<div formArrayName="items">
  @for (item of items.controls; track $index; let i = $index) {
    <div [formGroupName]="i">
      <!-- form controls here -->
    </div>
  }
</div>
```

### Accessing FormControl Errors

```html
@if (items.at(i).get('name')?.invalid && items.at(i).get('name')?.touched) {
  <span class="error-message">This field is required</span>
}
```

### Conditional Button States

```html
<button
  type="button"
  (click)="removeItem(i)"
  [disabled]="items.length === 1"
>
  Remove
</button>
```

## FormArray Operations

### Adding Items

```typescript
const skills = form.get('skills') as FormArray;
service.addItemToArray(skills, () => service.createSkillGroup());
```

### Removing Items

```typescript
service.removeItemFromArray(skills, index);
```

### Clearing Array

```typescript
service.clearFormArray(skills, () => service.createSkillGroup());
```

### Validating FormArray

```typescript
// Check if array has minimum/maximum items
const hasMinError = skills.hasError('minItems');
const hasMaxError = skills.hasError('maxItems');

// Get all errors
const errors = service.getFormArrayErrors(skills);
console.log(errors); // [{ index: 0, errors: {...} }, ...]
```

## Common Validators

```typescript
import { Validators } from '@angular/forms';

// Required field
Validators.required

// Minimum length for strings
Validators.minLength(2)

// Maximum length for strings
Validators.maxLength(50)

// Email validation
Validators.email

// Pattern matching (regex)
Validators.pattern(/^\d+$/)

// Minimum number value
Validators.min(0)

// Maximum number value
Validators.max(100)
```

## Example: Job Application Form

```typescript
export class JobApplicationComponent {
  form: FormGroup;

  constructor(private formService: ReactiveFormService) {
    this.form = this.formService.createFormWithArray(
      'experiences',
      1,
      () => this.createExperienceGroup(),
      [
        this.formService.minItemsValidator(1),
        this.formService.maxItemsValidator(5)
      ]
    );
  }

  private createExperienceGroup(): FormGroup {
    return this.formService.createFormGroup({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }
}
```

## Testing

The ReactiveFormService includes comprehensive unit tests. Run tests with:

```bash
ng test
```

## See Also

- [Angular Reactive Forms Documentation](https://angular.dev/guide/forms/reactive-forms)
- [FormArray Reference](https://angular.dev/api/forms/FormArray)
- [FormBuilder Reference](https://angular.dev/api/forms/FormBuilder)
  selector: 'app-my-advanced-form',
  template: `<app-advanced-form-array></app-advanced-form-array>`,
  imports: [AdvancedFormArrayComponent],
})
export class MyAdvancedFormComponent {
  constructor(private formService: ReactiveFormService) {
    const config: FormArrayConfig = {
      formArrayName: 'items',
      fields: [
        {
          name: 'itemName',
          validators: [Validators.required, Validators.minLength(2)],
        },
        {
          name: 'itemValue',
          validators: [Validators.required, Validators.pattern(/^\d+$/)],
        },
      ],
      minItems: 1,
      maxItems: 5,
    };

    const form = this.formService.createFormWithArray(config);
  }
}
```

## FormArray Operations

### Adding Items

```typescript
const skills = form.get('skills') as FormArray;
this.formService.addItemToArray(skills, fieldConfig);
```

### Removing Items

```typescript
this.formService.removeItemFromArray(skills, index);
```

### Clearing Array

```typescript
this.formService.clearFormArray(skills, fieldConfig);
```

### Validating FormArray

```typescript
// Check if array has minimum/maximum items
const hasErrors = skills.hasError('minItems');

// Get all errors
const errors = this.formService.getFormArrayErrors(skills);
```

## Template Best Practices

### Using @for Instead of *ngFor

```html
<div formArrayName="items">
  @for (item of items.controls; track $index; let i = $index) {
    <div [formGroupName]="i">
      <!-- form controls here -->
    </div>
  }
</div>
```

### Accessing FormControl Errors

```html
@if (items.at(i).get('name')?.invalid && items.at(i).get('name')?.touched) {
  <span class="error-message">This field is required</span>
}
```

### Conditional Button States

```html
<button
  type="button"
  (click)="removeItem(i)"
  [disabled]="items.length === 1"
>
  Remove
</button>
```

## FormFieldConfig Options

```typescript
interface FormFieldConfig {
  name: string;                          // Field name
  validators?: any[];                    // Sync validators
  asyncValidators?: AsyncValidatorFn[]; // Async validators
  value?: any;                           // Initial value
}
```

## FormArrayConfig Options

```typescript
interface FormArrayConfig {
  formArrayName: string;    // Name of the FormArray in the form
  fields: FormFieldConfig[]; // Array of field configurations
  minItems?: number;        // Minimum number of items allowed
  maxItems?: number;        // Maximum number of items allowed
}
```

## Common Validators

```typescript
import { Validators } from '@angular/forms';

// Required field
Validators.required

// Minimum length for strings
Validators.minLength(2)

// Maximum length for strings
Validators.maxLength(50)

// Email validation
Validators.email

// Pattern matching (regex)
Validators.pattern(/^\d+$/)

// Minimum number value
Validators.min(0)

// Maximum number value
Validators.max(100)
```

## Example: Job Application Form

```typescript
const jobApplicationConfig: FormArrayConfig = {
  formArrayName: 'experiences',
  fields: [
    {
      name: 'jobTitle',
      validators: [Validators.required, Validators.minLength(3)],
    },
    {
      name: 'company',
      validators: [Validators.required],
    },
    {
      name: 'startDate',
      validators: [Validators.required],
    },
    {
      name: 'endDate',
      validators: [Validators.required],
    },
  ],
  minItems: 1,
  maxItems: 10,
};

const form = this.formService.createFormWithArray(jobApplicationConfig);
```

## Testing

The ReactiveFormService includes comprehensive unit tests. Run tests with:

```bash
ng test
```

## See Also

- [Angular Reactive Forms Documentation](https://angular.dev/guide/forms/reactive-forms)
- [FormArray Reference](https://angular.dev/api/forms/FormArray)
- [FormBuilder Reference](https://angular.dev/api/forms/FormBuilder)
