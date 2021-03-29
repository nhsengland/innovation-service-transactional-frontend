import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormCheckboxComponent } from './checkbox.component';

@Component({
  template: `
  <form [formGroup]="form">
    <theme-form-checkbox [id]="id" [formControlName]="formControlName"></theme-form-checkbox>
  </form>`
})
class HostComponent {

  @ViewChild(FormCheckboxComponent) childComponent?: FormCheckboxComponent;

  form = new FormGroup({
    testField: new FormControl('some value')
  });

  id = 'FormInputId';
  formControlName = 'testField';

}


describe('FormCheckboxComponent tests Suite', () => {

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
    }).compileComponents();

    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;

  });

  it('should create the component', () => {
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });


  it('should form control field be valid', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsTouched();
    hostFixture.detectChanges();
    expect(hostComponent.childComponent?.hasError).toBe(false);
    expect(hostComponent.childComponent?.errorMessage).toBe('');
  });

  it('should form control field be valid', () => {
    hostFixture.detectChanges();
    hostComponent.form.get('testField')?.markAsDirty();
    hostFixture.detectChanges();
    expect(hostComponent.childComponent?.hasError).toBe(false);
    expect(hostComponent.childComponent?.errorMessage).toBe('');
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
