import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormEngineParameterModel } from '@app/base/forms';

import { FormInputComponent } from '../components/input.component';
import { FormRadioGroupComponent } from './radio-group.component';

@Component({
  template: `
  <form [formGroup]="form">
    <theme-form-radio-group [id]="id" [controlName]="controlName" [items]="items"></theme-form-radio-group>
  </form>`
})
class HostComponent {

  @ViewChild(FormRadioGroupComponent) childComponent?: FormRadioGroupComponent;

  form = new FormGroup({
    testField: new FormControl('', Validators.required),
    testFieldConditional: new FormControl('')
  });

  id = 'FormInputId';
  controlName = 'testField';
  items = [
    { value: 'value 1', label: 'label 1' },
    { value: 'value 2', label: 'label 2' },
    {
      value: 'value 3',
      label: 'value 3',
      conditional: new FormEngineParameterModel({ id: 'testFieldConditional', dataType: 'text', label: 'First part of your postcode', description: 'For example SW1', validations: { isRequired: true } })
    },
  ];

}


describe('FormRadioGroupComponent', () => {

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
        FormRadioGroupComponent,
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
    hostComponent.items = undefined as any;
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });

  it('should form control field be invalid and with error', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsTouched();
    hostFixture.detectChanges();
    expect(hostComponent.childComponent?.hasError).toBe(true);
    expect(hostComponent.childComponent?.error.message).toBe('shared.forms_module.validations.required');
  });

  it('should form control field be disabled, hence valid', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsTouched();
    hostComponent.form.get('testField')?.disable();
    hostFixture.detectChanges();
    expect(hostComponent.childComponent?.hasError).toBe(false);
    expect(hostComponent.childComponent?.error.message).toBe('');
  });

  it('should conditional field be visible', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.setValue('value 3');
    hostFixture.detectChanges();
    expect(hostComponent.childComponent?.isConditionalFieldVisible('testFieldConditional')).toBe(true);
  });

});
