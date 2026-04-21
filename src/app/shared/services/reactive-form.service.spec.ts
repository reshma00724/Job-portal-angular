import { TestBed } from '@angular/core/testing';
import {
  ReactiveFormService,
} from './reactive-form.service';
import { Validators, FormArray } from '@angular/forms';

describe('ReactiveFormService', () => {
  let service: ReactiveFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactiveFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create FormGroup with FormArray', () => {
    const form = service.createFormWithArray(
      'items',
      1,
      () => service.createNameEmailGroup()
    );
    expect(form.get('items')).toBeTruthy();
    expect(form.get('items') instanceof FormArray).toBeTruthy();
  });

  it('should create name and email form group', () => {
    const group = service.createNameEmailGroup();
    expect(group.get('name')).toBeTruthy();
    expect(group.get('email')).toBeTruthy();
    expect(group.get('name')?.validator).toBeTruthy();
    expect(group.get('email')?.validator).toBeTruthy();
  });

  it('should create skill form group', () => {
    const group = service.createSkillGroup();
    expect(group.get('skillName')).toBeTruthy();
    expect(group.get('proficiency')).toBeTruthy();
    expect(group.get('yearsOfExperience')).toBeTruthy();
  });

  it('should add item to FormArray', () => {
    const form = service.createFormWithArray(
      'items',
      1,
      () => service.createNameEmailGroup()
    );
    const items = form.get('items') as FormArray;
    const initialLength = items.length;

    service.addItemToArray(items, () => service.createNameEmailGroup());
    expect(items.length).toBe(initialLength + 1);
  });

  it('should remove item from FormArray', () => {
    const form = service.createFormWithArray(
      'items',
      2,
      () => service.createNameEmailGroup()
    );
    const items = form.get('items') as FormArray;

    service.addItemToArray(items, () => service.createNameEmailGroup());
    const lengthBeforeRemove = items.length;
    service.removeItemFromArray(items, 0);
    expect(items.length).toBe(lengthBeforeRemove - 1);
  });

  it('should not remove item if only one item remains', () => {
    const form = service.createFormWithArray(
      'items',
      1,
      () => service.createNameEmailGroup()
    );
    const items = form.get('items') as FormArray;

    service.removeItemFromArray(items, 0);
    expect(items.length).toBe(1);
  });

  it('should validate minimum items in FormArray', () => {
    const form = service.createFormWithArray(
      'items',
      1,
      () => service.createNameEmailGroup(),
      [service.minItemsValidator(2)]
    );
    const items = form.get('items') as FormArray;

    expect(items.hasError('minItems')).toBeTruthy();
    expect(items.errors?.['minItems']).toEqual({ min: 2, actual: 1 });
  });

  it('should validate maximum items in FormArray', () => {
    const form = service.createFormWithArray(
      'items',
      1,
      () => service.createNameEmailGroup(),
      [service.maxItemsValidator(1)]
    );
    const items = form.get('items') as FormArray;

    service.addItemToArray(items, () => service.createNameEmailGroup());
    expect(items.hasError('maxItems')).toBeTruthy();
    expect(items.errors?.['maxItems']).toEqual({ max: 1, actual: 2 });
  });

  it('should clear FormArray and add default item', () => {
    const form = service.createFormWithArray(
      'items',
      3,
      () => service.createNameEmailGroup()
    );
    const items = form.get('items') as FormArray;

    service.clearFormArray(items, () => service.createNameEmailGroup());
    expect(items.length).toBe(1);
  });

  it('should get form data', () => {
    const form = service.createFormWithArray(
      'items',
      1,
      () => service.createNameEmailGroup()
    );

    const data = service.getFormData(form);
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
  });
});
