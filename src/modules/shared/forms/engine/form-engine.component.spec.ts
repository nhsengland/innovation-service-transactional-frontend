import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { TranslateModule } from '@ngx-translate/core';

import { FormEngineComponent } from './form-engine.component';
import { FormCheckboxComponent } from '../components/checkbox.component';
import { FormCheckboxArrayComponent } from '../components/checkbox-array.component';
import { FormCheckboxGroupComponent } from '../components/checkbox-group.component';
import { FormInputComponent } from '../components/input.component';
import { FormRadioGroupComponent } from '../components/radio-group.component';
import { FormTextareaComponent } from '../components/textarea.component';

import { ALL_PARAMETER_TYPES_EMPTY, PARAMETERS_WITH_VALIDATIONS } from '../tests/form-engine.mock';

describe('FormEngineComponent', () => {

  let component: FormEngineComponent;
  let fixture: ComponentFixture<FormEngineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE, timestampFormat: 'mediumTime' }),
        TranslateModule.forRoot()
      ],
      declarations: [
        FormEngineComponent,
        FormCheckboxComponent,
        FormCheckboxArrayComponent,
        FormCheckboxGroupComponent,
        FormInputComponent,
        FormRadioGroupComponent,
        FormTextareaComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormEngineComponent);
    component = fixture.componentInstance;

  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should form control field be valid when parameters change', () => {
    fixture.detectChanges();

    component.parameters = ALL_PARAMETER_TYPES_EMPTY;
    component.ngOnChanges({
      parameters: new SimpleChange(null, ALL_PARAMETER_TYPES_EMPTY, false)
    });
    fixture.detectChanges();

    const expected = {
      textField: null,
      radioGroupField: null,
      checkboxGroupField: {},
      checkboxArrayField: []
    };

    expect(component.form.valid).toBe(true);
    expect(component.form.value).toEqual(expected);

  });


  it('should form control field be invalid and with error', () => {
    fixture.detectChanges();

    component.parameters = PARAMETERS_WITH_VALIDATIONS;
    component.values = { textField1: 'Some value' };
    component.ngOnChanges({
      parameters: new SimpleChange(null, component.parameters, false),
      values: new SimpleChange(null, component.values, false)
    });
    fixture.detectChanges();

    const expected = {
      valid: false,
      data: {
        textField1: 'Some value',
        textField2: null,
        textField3: null,
        textField4: null,
        textField5: null,
        checkboxArrayField: [],
        checkboxGroupField: { 'value 1': false, 'value 2': false, 'value 3': false },
        radioGroupField: null
      }
    };

    expect(component.getFormValues()).toEqual(expected);

  });

});
