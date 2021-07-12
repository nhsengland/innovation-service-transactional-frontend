import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomValidators } from '../validators/custom-validators';

import { FormCheckboxGroupComponent } from './checkbox-group.component';

@Component({
  template: `
  <form [formGroup]="form">
    <theme-form-checkbox-group [id]="id" [groupName]="groupName" [items]="items"></theme-form-checkbox-group>
  </form>`
})
class HostComponent {

  @ViewChild(FormCheckboxGroupComponent) childComponent?: FormCheckboxGroupComponent;

  form = new FormGroup({
    testField: new FormGroup({
      'value 1': new FormControl(false),
      'value 2': new FormControl(false),
      'value 3': new FormControl(false),
    })
  });

  id = 'FormInputId';
  groupName = 'testField';
  items = [
    { value: 'value 1', label: 'label 1' },
    { value: 'value 2', label: 'label 2' },
    { value: 'value 3', label: 'label 3' }
  ];

}


describe('FormCheckboxGroupComponent', () => {

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
        FormCheckboxGroupComponent,
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;

  });

  it('should create the component', () => {
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });

  it('should create the component even with items undefined', () => {
    hostComponent.items = undefined as any;
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });

  it('should form control field be invalid and field touched', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.setValidators(CustomValidators.requiredCheckboxGroup());
    hostComponent.form.get('testField')?.updateValueAndValidity();
    hostComponent.form.get('testField')?.markAsTouched();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(true);
    expect(hostComponent.childComponent?.errorMessage).toBe('shared.forms_module.validations.required');
  });

  it('should form control field be invalid and field dirty', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.setValidators(CustomValidators.requiredCheckboxGroup());
    hostComponent.form.get('testField')?.updateValueAndValidity();
    hostComponent.form.get('testField')?.markAsDirty();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(true);
    expect(hostComponent.childComponent?.errorMessage).toBe('shared.forms_module.validations.required');
  });

  it('should form control field isChecked method be ok', () => {
    hostFixture.detectChanges();

    hostComponent.form.get('testField')?.get('value 1')?.setValue(true);
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.isChecked('value 1')).toBe(true);
    expect(hostComponent.childComponent?.isChecked('value 2')).toBe(false);
    expect(hostComponent.childComponent?.isChecked('value 3')).toBe(false);
    expect(hostComponent.childComponent?.isChecked('unknown values')).toBe(false);

  });

});
