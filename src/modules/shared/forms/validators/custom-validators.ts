import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatesHelper, UtilsHelper } from '@app/base/helpers';
import { first, omit, isEmpty } from 'lodash';
import { INPUT_LENGTH_LIMIT } from '../engine/config/form-engine.config';

export class CustomFormGroupValidators {
  static mustMatch(fieldName: string, confirmationFieldName: string, errorMessage: string | null): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const field = group.get(fieldName);
      const confirmationField = group.get(confirmationFieldName);

      if (!field || !confirmationField) {
        return null;
      }

      if (confirmationField.errors && !confirmationField.errors.mustMatch) {
        return null;
      }

      if (field.value !== confirmationField.value) {
        confirmationField.setErrors({ mustMatch: true, message: errorMessage });
      } else {
        confirmationField.setErrors(null);
      }

      return null;
    };
  }
}
export class CustomValidators {
  static required(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      !UtilsHelper.isEmpty(control.value) ? null : { required: message ? { message } : true };
  }

  static requiredCheckboxArray(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      ((control.value as string[]) || []).length > 0 ? null : { required: message ? { message } : true };
  }

  static minCheckboxArray(min: number, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      ((control.value as string[]) || []).length >= min ? null : { min: message ? { message, min } : { min } };
  }

  static maxCheckboxArray(max: number, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      ((control.value as string[]) || []).length <= max ? null : { max: message ? { message, max } : { max } };
  }

  static requiredCheckboxGroup(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      Object.entries(control.value as { [key: string]: boolean }).filter(item => item[1]).length > 0
        ? null
        : { required: message ? { message } : true };
  }

  static pattern(pattern: string, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      new RegExp(pattern).test(control.value) ? null : { pattern: message ? { message } : true };
  }

  static equalTo(value: string, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      control.value === value ? null : { equalTo: message ? { message } : true };
  }

  static equalToLength(length: number, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      (control.value ?? '').length === length ? null : { equalToLength: message ? { message, length } : { length } };
  }

  static hexadecimalFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      if (typeof control.value === 'number') {
        return null;
      } // If a number is received, it may be passed liked 0x01 format.
      return /^(0[xX])?[0-9a-fA-F]+$/i.test(control.value) ? null : { hexadecimalFormat: true };
    };
  }

  static minHexadecimalValidator(minValue: string | number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return parseInt(control.value, 16) >= parseInt(minValue as string, 16)
        ? null
        : { minHexadecimal: { min: minValue } };
    };
  }

  static maxHexadecimalValidator(maxValue: string | number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return parseInt(control.value, 16) <= parseInt(maxValue as string, 16)
        ? null
        : { maxHexadecimal: { max: maxValue } };
    };
  }

  static existsInValidator(existsIn: string[], message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return !existsIn.includes(control.value) ? null : { existsIn: message ? { message } : true };
    };
  }

  static parsedDateStringValidator(message?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return DatesHelper.parseIntoValidFormat(control.value) !== null
        ? null
        : { parsedDateString: message ? { message } : true };
    };
  }

  static validEmailValidator(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return new RegExp(/^[a-zA-Z0-9.!#$%&'^_`{}~-]{1,64}@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(control.value)
        ? null
        : { validEmail: message ? { message } : true };
    };
  }

  static postcodeFormatValidator(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return new RegExp(
        /^(([A-Z][A-HJ-Y]?\d[A-Z\d]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA)( \d[A-Z]{2}|BFPO \d{1,4}|(KY\d|MSR|VG|AI)[ -]?\d{4}|[A-Z]{2} \d{2}|GE CX|GIR 0A{2}|SAN TA1)?)$/gim
      ).test(control.value)
        ? null
        : { postcodeFormat: message ? { message } : true };
    };
  }

  static urlFormatValidator(data?: { message?: string | null; maxLength?: number }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      if (data?.maxLength && control.value.length > data.maxLength) {
        return { urlFormat: data };
      }

      const pattern = new RegExp(
        '^(https?:\\/\\/)' + // protocol (mandator)
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
      );

      if (pattern.test(control.value)) {
        return null;
      }

      return { urlFormat: data };
    };
  }

  static emptyFileValidator(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return control.value.size > 0 ? null : { emptyFile: message ? { message } : true };
    };
  }

  static maxFileSizeValidator(maxFileSize: number, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return control.value.size <= maxFileSize * 1000000
        ? null
        : { maxFileSize: message ? { message, maxFileSize } : { maxFileSize } };
    };
  }

  static requiredDateInputValidator(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      if (!control.value.day && !control.value.month && !control.value.year) {
        return { requiredDateInput: message ? { message } : true };
      }
      return null;
    };
  }

  static dateInputFormatValidator(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      if (!control.value.day && !control.value.month && !control.value.year) {
        return null;
      }

      const inputDateString = DatesHelper.getDateString(control.value.year, control.value.month, control.value.day);

      if (DatesHelper.parseIntoValidFormat(inputDateString) !== null) {
        return null;
      } else {
        return { dateInputFormat: message ? { message } : true };
      }
    };
  }

  static futureDateInputValidator(includeToday: boolean, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDateString = DatesHelper.getDateString(control.value.year, control.value.month, control.value.day);
      if (DatesHelper.parseIntoValidFormat(inputDateString) === null) {
        return null;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputDate = new Date(`${control.value.year}-${control.value.month}-${control.value.day}`);
      inputDate.setHours(0, 0, 0, 0);

      if (includeToday) {
        if (inputDate < today) {
          return { futureDateInput: message ? { message } : true };
        }
      } else {
        if (inputDate <= today) {
          return { futureDateInput: message ? { message } : true };
        }
      }

      return null;
    };
  }

  static endDateInputGreaterThanStartDateInputValidator(
    startDateFieldName: string,
    endDateFieldName: string,
    message?: string | null
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const startDateField = control.get(startDateFieldName);
      const endDateField = control.get(endDateFieldName);

      if (!startDateField || !endDateField) {
        return null;
      }

      if (!startDateField?.value || !endDateField?.value) {
        return null;
      }

      if (startDateField?.errors) {
        return null;
      }

      if (endDateField.errors?.dateInputFormat) {
        return null;
      }

      const dateDiffInDays = DatesHelper.dateDiff(
        `${startDateField.value.year}-${startDateField.value.month}-${startDateField.value.day}`,
        `${endDateField.value.year}-${endDateField.value.month}-${endDateField.value.day}`
      );

      if (dateDiffInDays <= 0) {
        endDateField.setErrors({
          endDateInputGreaterThanStartDateInput: { message: message ?? 'The end date must be after the start date' }
        });
      } else {
        endDateField.setErrors(null);
      }

      return null;
    };
  }

  static endDateInputGreaterThanStartDateValidator(
    startDate: { day: string; month: string; year: string },
    message?: string | null
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const dateDiffInDays = DatesHelper.dateDiff(
        `${startDate.year}-${startDate.month}-${startDate.day}`,
        `${control.value.year}-${control.value.month}-${control.value.day}`
      );

      if (dateDiffInDays <= 0) {
        return { endDateInputGreaterThanStartDate: message ? { message } : true };
      }

      if (control.errors?.dateInputFormat) {
        return null;
      }

      return null;
    };
  }

  static makeTwoControlsAsRequiredWhenAtLeastOneIsFilledValidator(
    firstField: { name: string; message?: string },
    secondField: { name: string; message?: string }
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const firstControl = control.get(firstField.name);
      const firstControlRemainingErrors = omit(firstControl?.errors, ['required']);
      const firstControlErrors = isEmpty(firstControlRemainingErrors) ? null : firstControlRemainingErrors;

      const secondControl = control.get(secondField.name);
      const secondControlRemainingErrors = omit(secondControl?.errors, ['required']);
      const secondControlErrors = isEmpty(secondControlRemainingErrors) ? null : secondControlRemainingErrors;

      if (!firstControl || !secondControl) {
        return null;
      }

      if (!firstControl?.value && !secondControl?.value) {
        firstControl?.setErrors(firstControlErrors);
        secondControl?.setErrors(secondControlErrors);

        return null;
      }

      if (firstControl?.value) {
        if (!secondControl?.value) {
          secondControl?.setErrors({ required: secondField.message ? { message: secondField.message } : true });
        } else {
          secondControl?.setErrors(secondControlErrors);
        }
        return null;
      }

      if (secondControl?.value) {
        if (!firstControl?.value) {
          firstControl?.setErrors({ required: firstField.message ? { message: firstField.message } : true });
        } else {
          firstControl?.setErrors(firstControlErrors);
        }
        return null;
      }

      return null;
    };
  }

  // May be used in the future.
  // static passwordFieldsMatchValidator(formGroup: FormGroup): ValidationErrors | null {
  //   return formGroup.controls.password.value === formGroup.controls.confirmPassword.value ? null : { passwordFieldsMatch: true };
  // }

  // static jsonFormatValidator(control: AbstractControl): ValidationErrors | null {
  //   try {
  //     JSON.parse(control.value);
  //     return null;
  //   }
  //   catch (error) {
  //     return { jsonFormat: true };
  //   }
  // }

  // static urlFormatValidator(control: AbstractControl): ValidationErrors | null {

  //   if (!control.value) { return null; }

  //   const regex = /(https?):\/\/([\w-]+(\.[\\w-]+)*\.([a-z]+))(([\w.,@?^=%&amp;:\/~+#()!-]*)([\w@?^=%&amp;\/~+#()!-]))?/ig;
  //   return regex.test(control.value) ? null : { urlFormat: true };

  // }

  // static(control: AbstractControl): ValidationErrors | null {
  //   const regex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
  //   return regex.test(control.value) ? { passwordFormat: true } : null;
  // }
}
