import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormInputComponent } from '../components/input.component';
import { FormGroupedCheckboxArrayComponent } from './grouped-checkbox-array.component';

import { CustomValidators } from '../validators/custom-validators';

@Component({
  template: `
  <form [formGroup]="form">
    <theme-form-grouped-checkbox-array [id]="id" [arrayName]="arrayName" [groupedItems]="groupedItems"></theme-form-grouped-checkbox-array>
  </form>`
})
class HostComponent {

  @ViewChild(FormGroupedCheckboxArrayComponent) childComponent?: FormGroupedCheckboxArrayComponent;

  form = new FormGroup({
    testField: new FormArray([
      new FormControl('inner value 1'),
      // new FormControl('value 2')
    ]),
    testFieldConditional: new FormControl('')
  });

  id = 'FormInputId';
  arrayName = 'testField';
  groupedItems = [
    { value: 'value 1', label: 'label 1', items: [{ value: 'inner value 1', label: 'inner label 1' }] },
    { value: 'value 2', label: 'label 2', items: [{ value: 'inner value 2', label: 'inner label 2' }] },
    { value: 'value 3', label: 'value 3', items: [{ value: 'inner value 3.1', label: 'inner label 3.1' }, { value: 'inner value 3.2', label: 'inner label 3.2' }] },
    { value: 'value 4', label: 'value 4', items: [{ value: 'inner value 4.1', label: 'inner label 4.1' }, { value: 'inner value 4.2', label: 'inner label 4.2' }] },
    { value: 'value 5', label: 'value 5', items: [{ value: 'inner value 5.1', label: 'inner label 5.1' }, { value: 'inner value 5.2', label: 'inner label 5.2' }] }
  ];

}


describe('FormGroupCheckboxArrayComponent', () => {

  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        HostComponent,
        FormInputComponent,
        FormGroupedCheckboxArrayComponent,
      ],
    });

    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;

  });

  it('should create the component', () => {
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });

  it('should create the component even with items undefined', () => {
    hostComponent.groupedItems = undefined as any;
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });

  it('should form control field be invalid and field touched', () => {
    hostFixture.detectChanges();

    hostComponent.form.get('testField')?.setValidators(CustomValidators.requiredCheckboxArray());
    hostComponent.form.get('testField')?.updateValueAndValidity();
    (hostComponent.form.get('testField') as FormArray)?.clear();
    hostComponent.form.get('testField')?.markAsTouched();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(true);
    expect(hostComponent.childComponent?.errorMessage).toBe('shared.forms_module.validations.required');
  });

  it('should form control field be invalid and field dirty', () => {
    hostFixture.detectChanges();

    hostComponent.form.get('testField')?.setValidators(CustomValidators.requiredCheckboxArray());
    hostComponent.form.get('testField')?.updateValueAndValidity();
    (hostComponent.form.get('testField') as FormArray)?.clear();
    hostComponent.form.get('testField')?.markAsDirty();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(true);
    expect(hostComponent.childComponent?.errorMessage).toBe('shared.forms_module.validations.required');
  });

  it('should form control field change values well', () => {
    hostFixture.detectChanges();

    // Simulates user clicking on checkboxes.
    hostComponent.childComponent?.onChanged({ target: { value: 'inner value 1', checked: false } } as any);
    hostComponent.childComponent?.onChanged({ target: { value: 'inner value 2', checked: true } } as any);
    hostComponent.childComponent?.onChanged({ target: { value: 'value 3', checked: true } } as any);
    hostComponent.childComponent?.onChanged({ target: { value: 'value 4', checked: false } } as any);
    hostComponent.childComponent?.onChanged({ target: { value: 'inner value 5.1', checked: true } } as any);

    hostFixture.detectChanges();

    const expected = ['inner value 2', 'inner value 3.1', 'inner value 3.2', 'inner value 5.1'];
    expect(hostComponent.childComponent?.fieldArrayControl.value).toEqual(expected);

  });

  it('should show inner items', () => {
    hostFixture.detectChanges();

    // Simulates user clicking on checkboxes.
    hostComponent.childComponent?.onShowHideClicked('value 3');
    hostComponent.childComponent?.onShowHideClicked('value 3');
    hostComponent.childComponent?.onShowHideClicked('value 3');
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.filteredGI[2].showHideStatus).toBe('opened');
  });

});
