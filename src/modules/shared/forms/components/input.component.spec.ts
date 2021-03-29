import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormInputComponent } from './input.component';

@Component({
  template: `
  <form [formGroup]="form">
    <theme-form-input [id]="id" [formControlName]="formControlName"></theme-form-input>
  </form>`
})
class HostComponent {

  @ViewChild(FormInputComponent) childComponent?: FormInputComponent;

  form = new FormGroup({
    testField: new FormControl('', Validators.required)
  });

  id = 'FormInputId';
  formControlName = 'testField';

}


describe('InputComponent tests Suite', () => {

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
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;

  });

  it('should create the component', () => {
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });


  it('should form control field be invalid and with error', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsTouched();
    hostFixture.detectChanges();
    expect(hostComponent.childComponent?.hasError).toBe(true);
    expect(hostComponent.childComponent?.errorMessage).toBe('shared.forms_module.validations.required');
  });

  it('should form control field be disabled, hence valid', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsTouched();
    hostComponent.form.get('testField')?.disable();
    hostFixture.detectChanges();
    expect(hostComponent.childComponent?.hasError).toBe(false);
    expect(hostComponent.childComponent?.errorMessage).toBe('');
  });

});
