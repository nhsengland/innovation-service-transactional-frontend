import {
  AbstractControlOptions,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { FormEngineParameterModel } from '../models/form-engine.models';

import { CustomValidators } from '../../validators/custom-validators';
import { TranslateService } from '@ngx-translate/core';
import { AppInjector } from '@modules/core/injectors/app-injector';

export class FormEngineHelper {
  static buildForm(
    parameters: FormEngineParameterModel[],
    values: Record<string, any> = {},
    formValidations?: ValidatorFn[]
  ): FormGroup {
    parameters = parameters.map(p => new FormEngineParameterModel(p)); // Making sure all defaults are present.

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
        case 'checkbox-array':
        case 'grouped-checkbox-array':
          form.addControl(parameter.id, new FormArray([], { updateOn: 'change' }));
          ((parameterValue as string[]) || []).forEach(v => {
            (form.get(parameter.id) as FormArray).push(new FormControl(v));
          });
          break;

        case 'checkbox-group': // Creates an FormGroup with one FormControl per item. Form will be something like: ParameterId = { ItemValue1: boolean, ItemValue2: boolean, ... }
          form.addControl(parameter.id, new FormGroup({}, { updateOn: 'change' }));
          parameter.items?.forEach(item => {
            const itemValue = parameterValue ? (parameterValue as Record<string, boolean>)[item.value] : false;
            (form.get(parameter.id) as FormGroup).addControl(
              item.value,
              FormEngineHelper.createParameterFormControl(parameter, itemValue)
            );
          });
          break;

        case 'ir-selectable-filters':
          form.addControl(parameter.id, new FormArray([]));

          break;

        case 'fields-group':
          form.addControl(parameter.id, new FormArray([]));

          let arrayValue: Record<string, any>[];
          if (Array.isArray(parameterValue)) {
            arrayValue = parameterValue as Record<string, any>[];
          } else {
            arrayValue = [];
          }

          arrayValue.forEach((parameterValueRow, i) => {
            (form.get(parameter.id) as FormArray).push(FormEngineHelper.addFieldGroupRow(parameter, parameterValueRow));
          });

          break;

        // case 'autocomplete-value':
        case 'radio-group':
          form.addControl(
            parameter.id,
            FormEngineHelper.createParameterFormControl(parameter, parameterValue, { updateOn: 'change' })
          );
          break;

        case 'file-upload': // Creates a FormGroup and pushes defaultValues into it.
          form.addControl(parameter.id, new FormGroup({}, { updateOn: 'change' }));
          Object.entries(parameterValue ?? {}).forEach(([key, value]) => {
            (form.get(parameter.id) as FormGroup).addControl(key, new FormControl(value));
          });
          break;

        case 'select-component':
          form.addControl(
            parameter.id,
            FormEngineHelper.createParameterFormControl(parameter, parameterValue, { updateOn: 'change' })
          );
          break;

        case 'file-upload-array': // Creates an FormArray and pushes defaultValues into it.
          form.addControl(parameter.id, new FormArray([], { updateOn: 'change' }));
          ((parameterValue as { id: string; name: string; url: string }[]) || []).forEach(v => {
            (form.get(parameter.id) as FormArray).push(
              new FormGroup({ id: new FormControl(v.id), name: new FormControl(v.name), url: new FormControl(v.url) })
            );
          });
          break;

        case 'date-input':
          form.addControl(
            parameter.id,
            new FormGroup(
              {
                day: new FormControl(parameterValue?.day),
                month: new FormControl(parameterValue?.month),
                year: new FormControl(parameterValue?.year)
              },
              { updateOn: 'blur' }
            )
          );
          break;

        default: // Creates a standard FormControl.
          form.addControl(
            parameter.id,
            FormEngineHelper.createParameterFormControl(parameter, parameterValue, { updateOn: 'blur' })
          );
          break;
      }

      // Adds existing conditional fields to the form.
      conditionalFields.forEach(item => {
        if (item.conditional) {
          const itemValue = values[item.conditional.id] || null;
          form.addControl(
            item.conditional.id,
            FormEngineHelper.createParameterFormControl(item.conditional, itemValue)
          );
        }
      });

      // Adds existing additional fields to the form.
      additionalFields.forEach(item => {
        const itemValue = values[item.id] || null;
        form.addControl(item.id, FormEngineHelper.createParameterFormControl(item, itemValue));
      });

      // Apply validators only if parameter is visible!
      if (parameter.isVisible) {
        form.get(parameter.id)?.setValidators(FormEngineHelper.getParameterValidators(parameter));
        if (parameter.validations?.async) {
          form.get(parameter.id)?.setAsyncValidators(parameter.validations?.async);
        }
        form.get(parameter.id)?.updateValueAndValidity();
      }
    });

    return form;
  }

  static addFieldGroupRow(parameter: FormEngineParameterModel, value?: Record<string, any>): FormGroup {
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

  static getFormValues(
    form: FormGroup,
    parameters: FormEngineParameterModel[]
  ): { valid: boolean; data: Record<string, any> } {
    const returnForm: { valid: boolean; data: Record<string, any> } = { valid: form.valid, data: {} };

    Object.keys(form.getRawValue()).forEach(key => {
      // getRawValues is needed to return also disabled fields!
      returnForm.data[key] = form.getRawValue()[key];
    });

    return returnForm;
  }

  static getErrors(form: FormGroup, translateErrorMessage?: boolean): Record<string, string | null> {
    let result: Record<string, string | null> = {};

    Object.keys(form.controls).forEach(key => {
      const formProperty = form.get(key) || null;
      if (formProperty instanceof FormGroup) {
        result = { ...result, ...FormEngineHelper.getErrors(formProperty) };
      }
      const controlErrors: ValidationErrors | null | undefined = formProperty?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          const validationMessage = FormEngineHelper.getValidationMessage({ [keyError]: controlErrors[keyError] });
          let errorMessage = validationMessage.message;
          if (translateErrorMessage) {
            const injector = AppInjector.getInjector();
            const translatorService = injector.get(TranslateService);
            errorMessage = translatorService.instant(validationMessage.message, validationMessage.params);
          }
          result = {
            ...result,
            ...{ [key]: errorMessage }
          };
        });
      }
    });

    return result;
  }

  static getValidationMessage(error: ValidationErrors | null): { message: string; params: Record<string, string> } {
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
    if (error.requiredDateInput) {
      return { message: error.requiredDateInput.message, params: {} };
    }
    if (error.dateInputFormat) {
      return {
        message: error.dateInputFormat.message || 'shared.forms_module.validations.invalid_date_input_format',
        params: {}
      };
    }
    if (error.futureDateInput) {
      return { message: error.futureDateInput.message, params: {} };
    }
    if (error.endDateInputGreaterThanStartDateInput) {
      return { message: error.endDateInputGreaterThanStartDateInput.message, params: {} };
    }
    if (error.endDateInputGreaterThanStartDate) {
      return { message: error.endDateInputGreaterThanStartDate.message, params: {} };
    }
    if (error.customError) {
      return { message: error.message, params: {} };
    }
    return { message: '', params: {} };
  }

  static createParameterFormControl(
    parameter: FormEngineParameterModel,
    value?: any,
    options?: AbstractControlOptions
  ): FormControl {
    return new FormControl(
      { value: typeof value !== 'boolean' && !value && value !== 0 ? null : value, disabled: !parameter.isEditable },
      options
    );
  }

  static getParameterValidators(parameter: FormEngineParameterModel): ValidatorFn[] {
    const validators = [];

    let validation: [boolean | number | string | string[], string | null];

    if (parameter.validations?.isRequired) {
      validation =
        typeof parameter.validations.isRequired === 'boolean'
          ? [parameter.validations.isRequired, null]
          : parameter.validations.isRequired;
      if (validation[0]) {
        switch (parameter.dataType) {
          case 'autocomplete-array':
          case 'checkbox-array':
          case 'fields-group':
          case 'file-upload-array':
            validators.push(CustomValidators.requiredCheckboxArray(validation[1]));
            break;
          case 'checkbox-group':
            validators.push(CustomValidators.requiredCheckboxGroup(validation[1]));
            break;
          case 'date-input':
            validators.push(CustomValidators.requiredDateInputValidator(validation[1]));
            break;
          default:
            validators.push(CustomValidators.required(validation[1]));
            break;
        }
      }
    }

    if (parameter.validations?.pattern) {
      validation =
        typeof parameter.validations.pattern === 'string'
          ? [parameter.validations.pattern, null]
          : parameter.validations.pattern;
      if (validation[0]) {
        validators.push(CustomValidators.pattern(validation[0] as string, validation[1]));
      }
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
      validation =
        typeof parameter.validations.min === 'number' ? [parameter.validations.min, null] : parameter.validations.min;
      if (validation[0]) {
        switch (parameter.dataType) {
          case 'autocomplete-array':
          case 'checkbox-array':
          case 'fields-group':
          case 'file-upload-array':
            validators.push(CustomValidators.minCheckboxArray(validation[0] as number, validation[1] as string));
            break;
          default:
            validators.push(Validators.min(validation[0] as number));
            break;
        }
      }
    }

    if (parameter.validations?.max) {
      validation =
        typeof parameter.validations.max === 'number' ? [parameter.validations.max, null] : parameter.validations.max;
      if (validation[0]) {
        switch (parameter.dataType) {
          case 'autocomplete-array':
          case 'checkbox-array':
          case 'fields-group':
          case 'file-upload-array':
            validators.push(CustomValidators.maxCheckboxArray(validation[0] as number, validation[1] as string));
            break;
          default:
            validators.push(Validators.max(validation[0] as number));
            break;
        }
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
      validation =
        typeof parameter.validations.equalTo === 'string'
          ? [parameter.validations.equalTo, null]
          : (parameter.validations.equalTo as [string, string]);
      if (validation[0]) {
        validators.push(CustomValidators.equalTo(validation[0] as string, validation[1] as string));
      }
    }

    if (parameter.validations?.validEmail) {
      validation =
        typeof parameter.validations.validEmail === 'boolean'
          ? [parameter.validations.validEmail, null]
          : parameter.validations.validEmail;
      if (validation[0]) {
        validators.push(CustomValidators.validEmailValidator(validation[1]));
      }
    }

    if (parameter.validations?.postcodeFormat) {
      validation =
        typeof parameter.validations.postcodeFormat === 'boolean'
          ? [parameter.validations.postcodeFormat, null]
          : parameter.validations.postcodeFormat;
      if (validation[0]) {
        validators.push(CustomValidators.postcodeFormatValidator(validation[1]));
      }
    }

    if (parameter.validations?.urlFormat) {
      validators.push(CustomValidators.urlFormatValidator(parameter.validations.urlFormat));
    }

    // Specific types field validations.
    if (parameter.dataType === 'date') {
      validators.push(CustomValidators.parsedDateStringValidator());
    } else if (parameter.dataType === 'date-input') {
      if (parameter.validations?.requiredDateInput) {
        validators.push(CustomValidators.requiredDateInputValidator(parameter.validations?.requiredDateInput.message));
      }
      if (parameter.validations?.dateInputFormat) {
        validators.push(CustomValidators.dateInputFormatValidator(parameter.validations?.dateInputFormat.message));
      }
      if (parameter.validations?.futureDateInput) {
        const futureDateInput = parameter.validations.futureDateInput;
        validators.push(
          CustomValidators.futureDateInputValidator(futureDateInput.includeToday, futureDateInput.message)
        );
      }
      if (parameter.validations?.endDateInputGreaterThanStartDate) {
        const endDateInputGreaterThanStartDate = parameter.validations.endDateInputGreaterThanStartDate;
        validators.push(
          CustomValidators.endDateInputGreaterThanStartDateValidator(
            endDateInputGreaterThanStartDate.startDate,
            endDateInputGreaterThanStartDate.message
          )
        );
      }
    }

    return validators;
  }
}
