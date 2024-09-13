import {
  AbstractControlOptions,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { FormEngineParameterModelV3 } from '../models/form-engine.models';

import { CustomValidators } from '../../validators/custom-validators';
import { InnovationRecordMinMaxValidationType } from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';

export class FormEngineHelperV3 {
  static buildForm(
    parameters: FormEngineParameterModelV3[],
    values: { [key: string]: any } = {},
    formValidations?: ValidatorFn[]
  ): FormGroup {
    const inputParameters = parameters;

    parameters = inputParameters.map(p => new FormEngineParameterModelV3(p)); // Making sure all defaults are present.

    const form = new FormGroup({}, { updateOn: 'blur', validators: formValidations });

    // Build form structure.
    // parameters = sortBy(parameters, ['rank', 'label']); // TODO: Order fields by rank!
    parameters.forEach(parameter => {
      const parameterValue = values[parameter.id];
      const conditionalFields = parameter.items?.filter(item => item.conditional?.id) || [];

      const additionalFields = parameter.additional || [];

      switch (parameter.dataType) {
        // Creates an FormArray and pushes defaultValues into it.
        case 'autocomplete-array':
          form.addControl(parameter.id, new FormArray([], { updateOn: 'change' }));

          if (parameterValue) {
            const values: string[] = Array.isArray(parameterValue) ? parameterValue : [parameterValue];
            values.forEach(v => {
              (form.get(parameter.id) as FormArray).push(new FormControl(v));
            });
          }

          break;
        case 'checkbox-array':
          form.addControl(parameter.id, new FormArray([], { updateOn: 'change' }));

          parameterValue &&
            ((parameterValue as string[]) || []).forEach(v => {
              (form.get(parameter.id) as FormArray).push(new FormControl(v));
            });
          break;

        // case 'checkbox-group': // Creates an FormGroup with one FormControl per item. Form will be something like: ParameterId = { ItemValue1: boolean, ItemValue2: boolean, ... }
        //   form.addControl(parameter.id, new FormGroup({}, { updateOn: 'change' }));
        //   parameter.items?.forEach(item => {
        //     const itemValue = parameterValue ? (parameterValue as { [key: string]: boolean })[item.id ?? ''] : false;
        //     (form.get(parameter.id) as FormGroup).addControl(
        //       item.label ?? '',
        //       FormEngineHelperV3.createParameterFormControl(parameter, itemValue)
        //     );
        //   });
        //   break;

        case 'fields-group':
          form.addControl(parameter.id, new FormArray([]));

          let arrayValue: { [key: string]: any }[];
          if (Array.isArray(parameterValue)) {
            arrayValue = parameterValue as { [key: string]: any }[];
          } else {
            arrayValue = [];
          }

          arrayValue.forEach((parameterValueRow, i) => {
            (form.get(parameter.id) as FormArray).push(
              FormEngineHelperV3.addFieldGroupRow(parameter, parameterValueRow)
            );
          });

          break;

        // case 'autocomplete-value':
        case 'radio-group':
          form.addControl(
            parameter.id,
            FormEngineHelperV3.createParameterFormControl(parameter, parameterValue, { updateOn: 'change' })
          );
          break;

        // case 'file-upload': // Creates a FormGroup and pushes defaultValues into it.
        //   form.addControl(parameter.id, new FormGroup({}, { updateOn: 'change' }));
        //   Object.entries(parameterValue ?? {}).forEach(([key, value]) => {
        //     (form.get(parameter.id) as FormGroup).addControl(key, new FormControl(value));
        //   });
        //   break;

        // case 'select-component':
        //   form.addControl(
        //     parameter.id,
        //     FormEngineHelperV3.createParameterFormControl(parameter, parameterValue, { updateOn: 'change' })
        //   );
        //   break;

        // case 'file-upload-array': // Creates an FormArray and pushes defaultValues into it.
        //   form.addControl(parameter.id, new FormArray([], { updateOn: 'change' }));
        //   ((parameterValue as { id: string; name: string; url: string }[]) || []).forEach(v => {
        //     (form.get(parameter.id) as FormArray).push(
        //       new FormGroup({ id: new FormControl(v.id), name: new FormControl(v.name), url: new FormControl(v.url) })
        //     );
        //   });
        //   break;

        default: // Creates a standard FormControl.
          form.addControl(
            parameter.id,
            FormEngineHelperV3.createParameterFormControl(parameter, parameterValue, { updateOn: 'blur' })
          );
          break;
      }

      // Adds existing conditional fields to the form.
      conditionalFields.forEach(item => {
        if (item.conditional) {
          const itemValue = values[item.conditional.id] || null;

          form.addControl(
            item.conditional.id,
            FormEngineHelperV3.createParameterFormControl(item.conditional, itemValue)
          );
        }
      });

      // Adds existing additional fields to the form.
      additionalFields.forEach(item => {
        const itemValue = values[item.id] || null;
        form.addControl(item.id, FormEngineHelperV3.createParameterFormControl(item, itemValue));
      });

      // Apply validators only if parameter is visible!
      if (!parameter.isHidden) {
        form.get(parameter.id)?.setValidators(FormEngineHelperV3.getParameterValidators(parameter));
        if (parameter.validations?.async) {
          form.get(parameter.id)?.setAsyncValidators(parameter.validations?.async);
        }
        form.get(parameter.id)?.updateValueAndValidity();
      }
    });

    return form;
  }

  static addFieldGroupRow(parameter: FormEngineParameterModelV3, value?: { [key: string]: any }): FormGroup {
    const formGroup = new FormGroup({});

    if (parameter.field) {
      const newField = FormEngineHelperV3.createParameterFormControl(
        parameter.field,
        (value || {})[parameter.field.id]
      );
      newField.setValidators(FormEngineHelperV3.getParameterValidators(parameter.field));
      newField.updateValueAndValidity();
      formGroup.addControl(parameter.field.id, newField);
    }
    if (parameter.field && parameter.addQuestion) {
      const newField = FormEngineHelperV3.createParameterFormControl(
        parameter.field,
        (value || {})[parameter.field.id]
      );
      newField.updateValueAndValidity();
      formGroup.addControl(parameter.addQuestion.id, newField);
    }

    return formGroup;
  }

  // static isAnyVisibleField(parameters: FormEngineParameterModelV3[]): boolean {
  //   return parameters.some(parameter => parameter.isVisible);
  // }

  static getFormValues(
    form: FormGroup,
    parameters: FormEngineParameterModelV3[]
  ): { valid: boolean; data: { [key: string]: any } } {
    const returnForm: { valid: boolean; data: { [key: string]: any } } = { valid: form.valid, data: {} };

    Object.keys(form.getRawValue()).forEach(key => {
      // getRawValues is needed to return also disabled fields!
      returnForm.data[key] = form.getRawValue()[key];
    });

    return returnForm;
  }

  static getErrors(form: FormGroup): { [key: string]: string | null } {
    let result: { [key: string]: string | null } = {};

    Object.keys(form.controls).forEach(key => {
      const formProperty = form.get(key) || null;
      if (formProperty instanceof FormGroup) {
        result = { ...result, ...FormEngineHelperV3.getErrors(formProperty) };
      }
      const controlErrors: ValidationErrors | null | undefined = formProperty?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result = {
            ...result,
            ...{ [key]: FormEngineHelperV3.getValidationMessage({ [keyError]: controlErrors[keyError] }).message }
          };
        });
      }
    });

    return result;
  }

  static getValidationMessage(error: ValidationErrors | null): { message: string; params: { [key: string]: string } } {
    if (!error || Object.keys(error).length === 0) {
      // if empty!
      return { message: '', params: {} };
    }

    // Available validations.
    if (error.required) {
      return { message: error.required.message || 'shared.forms_module.validations.required', params: {} };
    }
    if (error.equalTo) {
      return { message: error.equalTo.message || 'shared.forms_module.validations.equal_to', params: {} };
    }
    if (error.email) {
      return { message: 'shared.forms_module.validations.invalid_email', params: {} };
    }
    if (error.min) {
      return { message: error.min.message || 'shared.forms_module.validations.min', params: { min: error.min.min } };
    }
    if (error.max) {
      return { message: error.max.message || 'shared.forms_module.validations.max', params: { max: error.max.max } };
    }
    if (error.minlength) {
      return {
        message: 'shared.forms_module.validations.min_length',
        params: { minLength: error.minlength.requiredLength }
      };
    }
    if (error.maxlength) {
      return {
        message: 'shared.forms_module.validations.max_length',
        params: { maxLength: error.maxlength.requiredLength }
      };
    }
    if (error.equalToLength) {
      return {
        message: error.equalToLength.message || 'shared.forms_module.validations.equal_to_length',
        params: { equalToLength: error.equalToLength.length }
      };
    }
    if (error.pattern) {
      return { message: error.pattern.message || 'shared.forms_module.validations.invalid_format', params: {} };
    }
    if (error.existsIn) {
      return { message: error.existsIn.message || 'shared.forms_module.validations.existsIn', params: {} };
    }
    if (error.validEmail) {
      return { message: error.validEmail.message || 'shared.forms_module.validations.validEmail', params: {} };
    }
    if (error.postcodeFormat) {
      return {
        message: error.postcodeFormat.message || 'shared.forms_module.validations.invalid_postcode_format',
        params: {}
      };
    }
    if (error.urlFormat) {
      return {
        message:
          error.urlFormat.message || error.urlFormat.maxLength
            ? 'shared.forms_module.validations.invalid_url_format_maxLength'
            : 'shared.forms_module.validations.invalid_url_format',
        params: { maxLength: error.urlFormat.maxLength }
      };
    }

    if (error.hexadecimalFormat) {
      return { message: 'shared.forms_module.validations.invalid_hexadecimal_format', params: {} };
    }
    if (error.minHexadecimal) {
      return {
        message: 'shared.forms_module.validations.min_hexadecimal' + ` (${error.minHexadecimal.min})`,
        params: {}
      };
    }
    if (error.maxHexadecimal) {
      return {
        message: 'shared.forms_module.validations.max_hexadecimal' + ` (${error.maxHexadecimal.max})`,
        params: {}
      };
    }
    if (error.parsedDateString) {
      return {
        message: error.parsedDateString.message || 'shared.forms_module.validations.invalid_parse_date',
        params: {}
      };
    }
    if (error.maxFileSize) {
      return { message: 'shared.forms_module.validations.max_file_size', params: {} };
    }
    if (error.emptyFile) {
      return { message: 'shared.forms_module.validations.empty_file', params: {} };
    }
    if (error.wrongFileFormat) {
      return { message: 'shared.forms_module.validations.wrong_file_format', params: {} };
    }
    if (error.uploadError) {
      return { message: 'shared.forms_module.validations.upload_error', params: {} };
    }
    if (error.mustMatch) {
      return { message: error.message, params: {} };
    }
    if (error.customError) {
      return { message: error.message, params: {} };
    }
    return { message: '', params: {} };
  }

  static createParameterFormControl(
    parameter: FormEngineParameterModelV3,
    value?: any,
    options?: AbstractControlOptions
  ): FormControl {
    return new FormControl(
      {
        value: typeof value !== 'boolean' && !value && value !== 0 ? null : value,
        // disabled: !parameter.isEditable
        disabled: false
      },
      options
    );
  }

  static getParameterValidators(parameter: FormEngineParameterModelV3): ValidatorFn[] {
    const validators = [];

    let validation:
      | boolean
      | string
      | [number | string | string[], string | null]
      | InnovationRecordMinMaxValidationType;

    if (parameter.validations?.isRequired) {
      validation = parameter.validations.isRequired;

      switch (parameter.dataType) {
        case 'autocomplete-array':
        case 'checkbox-array':
        case 'fields-group':
          // case 'file-upload-array':
          validators.push(CustomValidators.requiredCheckboxArray(validation));
          break;
        // case 'checkbox-group':
        //   validators.push(CustomValidators.requiredCheckboxGroup(validation));
        //   break;
        default:
          validators.push(CustomValidators.required(validation));
          break;
      }
    }

    if (parameter.validations?.pattern) {
      validation = parameter.validations.pattern;

      validators.push(CustomValidators.pattern(validation[0] as string, validation[1]));
    }

    if (parameter.validations?.minLength) {
      validators.push(Validators.minLength(parameter.validations.minLength));
    }
    if (parameter.validations?.maxLength) {
      validators.push(Validators.maxLength(parameter.validations.maxLength));
    }
    if (parameter.validations?.equalToLength) {
      validation =
        typeof parameter.validations.equalToLength === 'number'
          ? [parameter.validations.equalToLength, null]
          : parameter.validations.equalToLength;
      validators.push(CustomValidators.equalToLength(validation[0] as number, validation[1]));
    }

    if (parameter.validations?.min) {
      validation = parameter.validations.min;

      switch (parameter.dataType) {
        case 'autocomplete-array':
        case 'checkbox-array':
        case 'fields-group':
          // case 'file-upload-array':
          validators.push(CustomValidators.minCheckboxArray(validation.length, validation.errorMessage));
          break;
        default:
          validators.push(Validators.min(validation.length as number));
          break;
      }
    }

    if (parameter.validations?.max) {
      validation = parameter.validations.max;

      switch (parameter.dataType) {
        case 'autocomplete-array':
        case 'checkbox-array':
        case 'fields-group':
          // case 'file-upload-array':
          validators.push(CustomValidators.maxCheckboxArray(validation.length, validation.errorMessage));
          break;
        default:
          validators.push(Validators.max(validation.length));
          break;
      }
    }

    if (parameter.validations?.existsIn) {
      validation = !Array.isArray(parameter.validations.existsIn)
        ? [parameter.validations.existsIn, null]
        : (parameter.validations.existsIn as [string[], string]);
      if (validation[0]) {
        validators.push(CustomValidators.existsInValidator(validation[0] as string[], validation[1] as string));
      }
    }

    if (parameter.validations?.equalTo) {
      validation = parameter.validations.equalTo as [string, string];
      validators.push(CustomValidators.equalTo(validation[0] as string, validation[1] as string));
    }

    if (parameter.validations?.validEmail) {
      validation = parameter.validations.validEmail;
      validators.push(CustomValidators.validEmailValidator(validation));
    }

    if (parameter.validations?.postcodeFormat) {
      validation = parameter.validations.postcodeFormat;
      validators.push(CustomValidators.postcodeFormatValidator());
    }

    if (parameter.validations?.urlFormat) {
      validators.push(CustomValidators.urlFormatValidator(parameter.validations.urlFormat));
    }

    // Specific types field validations.
    // if (parameter.dataType === 'date') {
    //   validators.push(CustomValidators.parsedDateStringValidator());
    // }

    return validators;
  }
}
