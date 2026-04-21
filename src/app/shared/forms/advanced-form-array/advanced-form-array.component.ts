import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormService } from '../../services/reactive-form.service';

interface SkillItem {
  skillName: string;
  proficiency: string;
  yearsOfExperience: number;
}

@Component({
  selector: 'app-advanced-form-array',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-form-array.component.html',
  styleUrls: ['./advanced-form-array.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedFormArrayComponent {
  form: FormGroup;
  showErrors = false;

  constructor(private formService: ReactiveFormService) {
    // Create form with skills array using min/max validators
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

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  // Create a skill form group
  private createSkillGroup(): FormGroup {
    return this.formService.createFormGroup({
      skillName: ['', [Validators.required, Validators.minLength(2)]],
      proficiency: ['intermediate', [Validators.required]],
      yearsOfExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
    });
  }

  addSkill(): void {
    this.formService.addItemToArray(this.skills, () => this.createSkillGroup());
  }

  removeSkill(index: number): void {
    this.formService.removeItemFromArray(this.skills, index);
  }

  onSubmit(): void {
    this.showErrors = true;

    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      const skills: SkillItem[] = this.form.value.skills;
      console.log('Skills:', skills);
      // Process form data
    } else {
      console.log('Form errors:', this.formService.getFormArrayErrors(this.skills));
    }
  }

  resetForm(): void {
    this.formService.clearFormArray(this.skills, () => this.createSkillGroup());
    this.showErrors = false;
  }
}
