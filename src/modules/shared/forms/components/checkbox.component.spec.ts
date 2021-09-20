import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormCheckboxComponent } from './checkbox.component';

@Component({
  template: `
  <form [formGroup]="form">
    <theme-form-checkbox [id]="id" [controlName]="controlName"></theme-form-checkbox>
  </form>`
})
class HostComponent {

  @ViewChild(FormCheckboxComponent) childComponent?: FormCheckboxComponent;

  form = new FormGroup({
    testField: new FormControl(false)
  });

  id = 'FormInputId';
  controlName = 'testField';

}


describe('FormCheckboxComponent', () => {

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
        FormCheckboxComponent,
      ],
    });

    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;

  });

  it('should create the component', () => {
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });

  it('should form control field be invalid and field touched', () => {

    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.setErrors({ someErrorToMakeFieldInvalid: true });
    hostComponent.form.get('testField')?.markAsTouched();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(true);

  });

  it('should form control field be invalid and field dirty', () => {

    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.setErrors({ someErrorToMakeFieldInvalid: true });
    hostComponent.form.get('testField')?.markAsDirty();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(true);

  });

  it('should form control field be valid', () => {

    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsTouched();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(false);

  });

  it('should form control field be valid', () => {

    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsDirty();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(false);

  });

  it('should form control field be disabled, hence valid', () => {

    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsTouched();
    hostComponent.form.get('testField')?.disable();
    hostFixture.detectChanges();

    expect(hostComponent.childComponent?.hasError).toBe(false);

  });

});
