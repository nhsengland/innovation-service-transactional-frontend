import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { SimpleChange } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '../forms.module';

import { FormEngineComponent } from './form-engine.component';

import { ALL_PARAMETER_TYPES_EMPTY, PARAMETERS_WITH_VALIDATIONS } from '../tests/form-engine.mock';


describe('FormEngineComponent', () => {

  let component: FormEngineComponent;
  let fixture: ComponentFixture<FormEngineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        TranslateModule.forRoot(),
        FormsModule
      ]
    });

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
      checkboxArrayField: [],
      fieldsGroupField: []
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

  it('should form control field be valid when parameters change', () => {
    fixture.detectChanges();

    component.parameters = ALL_PARAMETER_TYPES_EMPTY;
    component.ngOnChanges({
      parameters: new SimpleChange(null, ALL_PARAMETER_TYPES_EMPTY, false)
    });
    component.removeFieldGroupRow('fieldsGroupField', 0);
    component.addFieldGroupRow(ALL_PARAMETER_TYPES_EMPTY.find(p => p.id === 'fieldsGroupField') as any, { field01: 'value 1', field02: 'value 2' });
    fixture.detectChanges();

    const expected = {
      textField: null,
      radioGroupField: null,
      checkboxGroupField: {},
      checkboxArrayField: [],
      fieldsGroupField: [{ field01: 'value 1', field02: 'value 2' }]
    };

    expect(component.form.valid).toBe(true);
    expect(component.form.value).toEqual(expected);

  });

});
