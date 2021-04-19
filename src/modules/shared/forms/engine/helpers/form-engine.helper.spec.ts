import { FormEngineHelper } from './form-engine.helper';
import { ALL_PARAMETER_TYPES_EMPTY, CHOOSABLE_PARAMETER_TYPES, CHOOSABLE_PARAMETER_TYPES_WITH_CONDITIONALS, ALL_PARAMETERS_HIDDEN, PARAMETERS_WITH_VALIDATIONS, PARAMETERS_VALUES } from '../../tests/form-engine.mock';


describe('FormEngineHelper', () => {

  it('should create empty and valid form', () => {
    const expected = {};
    const form = FormEngineHelper.buildForm([]);
    expect(form.valid).toBe(true);
    expect(form.value).toEqual(expected);
  });

  it('should create a valid form with one parameter of each type empty', () => {
    const expected = {
      textField: null,
      radioGroupField: null,
      checkboxGroupField: {},
      checkboxArrayField: []
    };
    const form = FormEngineHelper.buildForm(ALL_PARAMETER_TYPES_EMPTY);
    expect(form.valid).toBe(true);
    expect(form.value).toEqual(expected);
  });

  it('should create a valid form with one "choosable" parameter of each type', () => {
    const expected = {
      radioGroupField: null,
      checkboxGroupField: { 'value 1': false, 'value 2': false, 'value 3': false },
      checkboxArrayField: []
    };
    const form = FormEngineHelper.buildForm(CHOOSABLE_PARAMETER_TYPES);
    expect(form.valid).toBe(true);
    expect(form.value).toEqual(expected);
  });

  it('should create a valid form with one conditional parameter', () => {
    const expected = {
      radioGroupField: null,
      textField: null
    };
    const form = FormEngineHelper.buildForm(CHOOSABLE_PARAMETER_TYPES_WITH_CONDITIONALS);
    expect(form.valid).toBe(true);
    expect(form.value).toEqual(expected);
  });

  it('should return isAnyVisibleField true', () => {
    expect(FormEngineHelper.isAnyVisibleField(ALL_PARAMETER_TYPES_EMPTY)).toBe(true);
  });

  it('should return isAnyVisibleField false', () => {
    expect(FormEngineHelper.isAnyVisibleField(ALL_PARAMETERS_HIDDEN)).toBe(false);
  });

  it('should return the values (empty) of one parameter of each type', () => {
    const expected = {
      valid: true,
      data: {
        textField: null,
        radioGroupField: null,
        checkboxGroupField: {},
        checkboxArrayField: []
      }
    };
    const form = FormEngineHelper.buildForm(ALL_PARAMETER_TYPES_EMPTY);
    expect(FormEngineHelper.getFormValues(form, ALL_PARAMETER_TYPES_EMPTY)).toEqual(expected);
  });

  it('should return empty and valid form values ', () => {
    const expected = {
      valid: true,
      data: {
        radioGroupField: null,
        checkboxGroupField: { 'value 1': false, 'value 2': false, 'value 3': false },
        checkboxArrayField: []
      }
    };
    const form = FormEngineHelper.buildForm(CHOOSABLE_PARAMETER_TYPES);
    expect(FormEngineHelper.getFormValues(form, CHOOSABLE_PARAMETER_TYPES)).toEqual(expected);
  });


  it('should return a few errors', () => {
    const expected = {
      // textField1: 'shared.forms_module.validations.invalid_format', // All ok with this parameter.
      textField2: 'shared.forms_module.validations.required',
      textField3: 'is required',
      textField4: 'is required',
      checkboxArrayField: 'is required',
      checkboxGroupField: 'is required',
      radioGroupField: 'is required'
    };
    const form = FormEngineHelper.buildForm(PARAMETERS_WITH_VALIDATIONS);
    expect(FormEngineHelper.getErrors(form)).toEqual(expected);
  });

  it('should return no errors', () => {
    const expected = {};
    const form = FormEngineHelper.buildForm(PARAMETERS_WITH_VALIDATIONS, PARAMETERS_VALUES);
    expect(FormEngineHelper.getErrors(form)).toEqual(expected);
  });



  it('should return empty validation message', () => {

    const validationMessageTestSuite = [

      { test: {}, expected: '' },

      { test: { required: true }, expected: 'shared.forms_module.validations.required' },
      { test: { email: true }, expected: 'shared.forms_module.validations.invalid_email' },
      { test: { min: { min: 5 } }, expected: 'shared.forms_module.validations.min (5)' },
      { test: { max: { max: 10 } }, expected: 'shared.forms_module.validations.max (10)' },
      { test: { minlength: { requiredLength: 5 } }, expected: 'shared.forms_module.validations.min_length (5)' },
      { test: { maxlength: { requiredLength: 10 } }, expected: 'shared.forms_module.validations.max_length (10)' },
      { test: { pattern: true }, expected: 'shared.forms_module.validations.invalid_format' },

      { test: { hexadecimalFormat: true }, expected: 'shared.forms_module.validations.invalid_hexadecimal_format' },
      { test: { minHexadecimal: { min: 5 } }, expected: 'shared.forms_module.validations.min_hexadecimal (5)' },
      { test: { maxHexadecimal: { max: 10 } }, expected: 'shared.forms_module.validations.max_hexadecimal (10)' },

      { test: { unknownValidation: true }, expected: '' }

    ];

    validationMessageTestSuite.forEach(v => {
      expect(FormEngineHelper.getValidationMessage(v.test)).toBe(v.expected);
    });

  });

});
