import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static required(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => !!control.value ? null : { required: (message ? { message } : true) };
  }

  static requiredCheckboxArray(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => (control.value as string[] || []).length > 0 ? null : { required: (message ? { message } : true) };
  }

  static minCheckboxArray(min: number, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => (control.value as string[] || []).length >= min ? null : { min: (message ? { message, min } : { min }) };
  }

  static maxCheckboxArray(max: number, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => (control.value as string[] || []).length <= max ? null : { max: (message ? { message, max } : { max }) };
  }

  static requiredCheckboxGroup(message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => (Object.entries(control.value as { [key: string]: boolean })).filter(item => item[1]).length > 0 ? null : { required: (message ? { message } : true) };
  }

  static pattern(pattern: string, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => new RegExp(pattern).test(control.value) ? null : { pattern: (message ? { message } : true) };
  }

  static equalTo(value: string, message?: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => control.value === value ? null : { equalTo: (message ? { message } : true) };
  }

  static hexadecimalFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      if (typeof control.value === 'number') { return null; } // If a number is received, it may be passed liked 0x01 format.
      return (/^(0[xX])?[0-9a-fA-F]+$/i).test(control.value) ? null : { hexadecimalFormat: true };
    };
  }

  static minHexadecimalValidator(minValue: string | number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      return parseInt(control.value, 16) >= parseInt(minValue as string, 16) ? null : { minHexadecimal: { min: minValue } };
    };
  }

  static maxHexadecimalValidator(maxValue: string | number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      return parseInt(control.value, 16) <= parseInt(maxValue as string, 16) ? null : { maxHexadecimal: { max: maxValue } };
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
