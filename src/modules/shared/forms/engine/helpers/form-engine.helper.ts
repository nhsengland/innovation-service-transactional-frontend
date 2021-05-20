import { FormGroup, FormControl, ValidationErrors, FormArray, Validators, ValidatorFn } from '@angular/forms';
// import { sortBy } from 'lodash';

import { FormEngineParameterModel } from '../models/form-engine.models';

import { CustomValidators } from '../../validators/custom-validators';

export class FormEngineHelper {

  static buildForm(parameters: FormEngineParameterModel[], values: { [key: string]: any } = {}): FormGroup {

    parameters = parameters.map(p => new FormEngineParameterModel(p)); // Making sure all defaults are present.

    const form = new FormGroup({});

    // Build form structure.
    // parameters = sortBy(parameters, ['rank', 'label']); // TODO: Order fields by rank!
    parameters.forEach(parameter => {

      const parameterValue = values[parameter.id];
      const conditionalFields = parameter.items?.filter(item => item.conditional?.id) || [];

      switch (parameter.dataType) {
        case 'checkbox-array': // Creates an FormArray and pushes defaultValues into it.
          form.addControl(parameter.id, new FormArray([]));
          (parameterValue as string[] || []).forEach(v => { (form.get(parameter.id) as FormArray).push(new FormControl(v)); });
          break;

        case 'checkbox-group': // Creates an FormGroup with one FormControl per item. Form will be something like: ParameterId = { ItemValue1: boolean, ItemValue2: boolean, ... }
          form.addControl(parameter.id, new FormGroup({}));
          parameter.items?.forEach(item => {
            const itemValue = parameterValue ? (parameterValue as { [key: string]: boolean })[item.value] : false;
            (form.get(parameter.id) as FormGroup).addControl(item.value, FormEngineHelper.createParameterFormControl(parameter, itemValue));
          });
          break;

        case 'fields-group':
          form.addControl(parameter.id, new FormArray([]));

          let arrayValue: { [key: string]: any }[];
          if (Array.isArray(parameterValue)) { arrayValue = parameterValue as { [key: string]: any }[]; }
          else { arrayValue = []; }

          if (arrayValue.length === 0) {
            (form.get(parameter.id) as FormArray).push(FormEngineHelper.addFieldGroupRow(parameter));
          } else {
            arrayValue.forEach((parameterValueRow, i) => {
              (form.get(parameter.id) as FormArray).push(FormEngineHelper.addFieldGroupRow(parameter, parameterValueRow));
            });
          }
          break;

        case 'file-upload': // Creates an FormArray and pushes defaultValues into it.
          form.addControl(parameter.id, new FormArray([]));
          (parameterValue as { id: string, name: string, url: string }[] || []).forEach(v => {
            (form.get(parameter.id) as FormArray).push(new FormGroup({ id: new FormControl(v.id), name: new FormControl(v.name), url: new FormControl(v.url) }));
          });
          break;

        default: // Creates a standard FormControl.
          form.addControl(parameter.id, FormEngineHelper.createParameterFormControl(parameter, parameterValue));
          break;
      }

      // Adds existing conditional fields to the form.
      conditionalFields.forEach(item => {
        if (item.conditional) {
          const itemValue = values[item.conditional.id] || null;
          form.addControl(item.conditional.id, FormEngineHelper.createParameterFormControl(item.conditional, itemValue));
        }
      });

      // Apply validators only if parameter is visible!
      if (parameter.isVisible) {
        form.get(parameter.id)?.setValidators(FormEngineHelper.getParameterValidators(parameter));
        form.get(parameter.id)?.updateValueAndValidity();
      }

    });

    return form;

  }


  static addFieldGroupRow(parameter: FormEngineParameterModel, value?: { [key: string]: any }): FormGroup {

    const formGroup = new FormGroup({});

    parameter.fieldsGroupConfig?.fields.forEach(field => {
      const newField = FormEngineHelper.createParameterFormControl(field, (value || {})[field.id]);
      newField.setValidators(FormEngineHelper.getParameterValidators(field));
      newField.updateValueAndValidity();
      formGroup.addControl(field.id, newField);
    });

    return formGroup;

  }


  static isAnyVisibleField(parameters: FormEngineParameterModel[]): boolean {
    return parameters.some(parameter => parameter.isVisible);
  }

  static getFormValues(form: FormGroup, parameters: FormEngineParameterModel[]): { valid: boolean; data: { [key: string]: any } } {

    const returnForm: { valid: boolean; data: { [key: string]: any } } = { valid: form.valid, data: {} };

    Object.keys(form.getRawValue()).forEach(key => { // getRawValues is needed to return also disabled fields!
      // const parameter = parameters.find(p => p.id === key);
      // if (parameter) {
      returnForm.data[key] = form.getRawValue()[key];
      // }
    });

    return returnForm;
  }


  static getErrors(form: FormGroup): { [key: string]: string | null } {

    let result: { [key: string]: string | null } = {};

    Object.keys(form.controls).forEach(key => {
      const formProperty = form.get(key) || null;
      if (formProperty instanceof FormGroup) {
        result = { ...result, ...FormEngineHelper.getErrors(formProperty) };
      }
      const controlErrors: ValidationErrors | null | undefined = formProperty?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result = { ...result, ...{ [key]: FormEngineHelper.getValidationMessage({ [keyError]: controlErrors[keyError] }) } };
        });
      }
    });

    return result;
  }


  static getValidationMessage(error: ValidationErrors | null): string {

    if (!error || Object.keys(error).length === 0) { // if empty!
      return '';
    }

    // Native validations.
    if ('required' in error) { return error.required.message || 'shared.forms_module.validations.required'; }
    if ('email' in error) { return 'shared.forms_module.validations.invalid_email'; }
    if ('min' in error) { return 'shared.forms_module.validations.min' + ` (${error.min.min})`; }
    if ('max' in error) { return 'shared.forms_module.validations.max' + ` (${error.max.max})`; }
    if ('minlength' in error) { return 'shared.forms_module.validations.min_length' + ` (${error.minlength.requiredLength})`; }
    if ('maxlength' in error) { return 'shared.forms_module.validations.max_length' + ` (${error.maxlength.requiredLength})`; }
    if ('pattern' in error) { return error.pattern.message || 'shared.forms_module.validations.invalid_format'; }

    // Custom validators.
    if ('hexadecimalFormat' in error) { return 'shared.forms_module.validations.invalid_hexadecimal_format'; }
    if ('minHexadecimal' in error) { return 'shared.forms_module.validations.min_hexadecimal' + ` (${error.minHexadecimal.min})`; }
    if ('maxHexadecimal' in error) { return 'shared.forms_module.validations.max_hexadecimal' + ` (${error.maxHexadecimal.max})`; }

    return '';

  }


  static createParameterFormControl(parameter: FormEngineParameterModel, value?: any): FormControl {
    return new FormControl({ value: (typeof value !== 'boolean' && !value && value !== 0 ? null : value), disabled: !parameter.isEditable });
  }

  static getParameterValidators(parameter: FormEngineParameterModel): ValidatorFn[] {

    const validators = [];

    let validation: [boolean | number | string, string | null];

    if (parameter.validations?.isRequired) {
      validation = typeof parameter.validations.isRequired === 'boolean' ? [parameter.validations.isRequired, null] : parameter.validations.isRequired;
      if (validation[0]) {

        switch (parameter.dataType) {
          case 'checkbox-array':
            validators.push(CustomValidators.requiredCheckboxArray(validation[1]));
            break;
          case 'checkbox-group':
            validators.push(CustomValidators.requiredCheckboxGroup(validation[1]));
            break;
          default:
            validators.push(CustomValidators.required(validation[1]));
            break;
        }

      }
    }

    if (parameter.validations?.pattern) {
      validation = typeof parameter.validations.pattern === 'string' ? [parameter.validations.pattern, null] : parameter.validations.pattern;
      if (validation[0]) { validators.push(CustomValidators.pattern(validation[0] as string, validation[1])); }
    }

    if (parameter.validations?.minLength) { validators.push(Validators.minLength(parameter.validations.minLength as number)); }
    if (parameter.validations?.maxLength) { validators.push(Validators.maxLength(parameter.validations.maxLength as number)); }
    if (parameter.validations?.min) { validators.push(Validators.min(parameter.validations.min as number)); }
    if (parameter.validations?.max) { validators.push(Validators.max(parameter.validations.max as number)); }

    return validators;

  }


}
