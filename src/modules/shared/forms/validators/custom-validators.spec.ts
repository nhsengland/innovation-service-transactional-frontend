import { FormArray, FormControl, FormGroup, UntypedFormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomValidators } from './custom-validators';

describe('CustomValidators', () => {
  let formGroup: FormGroup;
  let formControl: FormControl;
  let formArray: FormArray;
  let validatorFn: ValidatorFn;
  let validator: ValidationErrors | null;

  describe('CustomValidators.required()', () => {
    beforeAll(() => {
      formControl = new FormControl();
      validatorFn = CustomValidators.required();
    });

    it('should return error when required field value is null', () => {
      formControl.setValue(null);
      validator = validatorFn(formControl);
      expect(validator).toEqual({ required: true });
    });

    it('should return error when required field value is empty (with message)', () => {
      formControl.setValue(null);
      validator = CustomValidators.required('is required')(formControl);
      expect(validator).toEqual({ required: { message: 'is required' } });
    });

    it('should return null when required field value is present', () => {
      formControl.setValue('test');
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });
  });

  describe('CustomValidators.requiredCheckboxArray()', () => {
    beforeAll(() => {
      formArray = new UntypedFormArray([]);
      validatorFn = CustomValidators.requiredCheckboxArray();
    });

    it('should return error when field value is an empty array', () => {
      validator = validatorFn(formArray);
      expect(validator).toEqual({ required: true });
    });

    it('should return error when field value is an empty array (with message)', () => {
      validator = CustomValidators.requiredCheckboxArray('is required')(formArray);
      expect(validator).toEqual({ required: { message: 'is required' } });
    });

    it('should return null when field value is a non empty array', () => {
      formArray.push(new FormControl('1'));
      validator = validatorFn(formArray);
      expect(validator).toBeNull();
    });
  });

  describe('CustomValidators.requiredCheckboxGroup()', () => {
    beforeAll(() => {
      formGroup = new FormGroup({
        item1: new FormControl(false),
        item2: new FormControl(false)
      });
      validatorFn = CustomValidators.requiredCheckboxGroup();
    });

    it('should return error when all of the children field controls values are false', () => {
      validator = validatorFn(formGroup);
      expect(validator).toEqual({ required: true });
    });

    it('should return null when at least one of the children field controls is true', () => {
      formGroup.get('item1')?.setValue(true);
      validator = validatorFn(formArray);
      expect(validator).toBeNull();
    });
  });

  describe('CustomValidators.pattern()', () => {
    beforeAll(() => {
      formControl = new FormControl();
      validatorFn = CustomValidators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
    });

    it('should return null with a valid basic email address', () => {
      formControl.setValue('test@example.com');
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return error with an empty email', () => {
      formControl.setValue(null);
      validator = validatorFn(formControl);
      expect(validator).toEqual({ pattern: true });
    });

    it('should return error with a malformed email (spaces)', () => {
      formControl.setValue('test @ example.com');
      validator = validatorFn(formControl);
      expect(validator).toEqual({ pattern: true });
    });

    it('should return error with a malformed email (no @)', () => {
      formControl.setValue('test_example');
      validator = validatorFn(formControl);
      expect(validator).toEqual({ pattern: true });
    });
  });

  describe('CustomValidators.hexadecimalFormatValidator()', () => {
    beforeAll(() => {
      formControl = new FormControl();
      validatorFn = CustomValidators.hexadecimalFormatValidator();
    });

    it('should return null when control value is null', () => {
      formControl.setValue(null);
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return null when control value is hexadecimal (number type)', () => {
      formControl.setValue(0x74);
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return null when control value is hexadecimal (string type)', () => {
      formControl.setValue('0x74');
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return error when when control value is not hexadecimal', () => {
      formControl.setValue('test');
      validator = validatorFn(formControl);
      expect(validator).toEqual({ hexadecimalFormat: true });
    });
  });

  describe('CustomValidators.minHexadecimalValidator()', () => {
    beforeAll(() => {
      formControl = new FormControl();
      validatorFn = CustomValidators.minHexadecimalValidator(5);
    });

    it('should return null when control value is null', () => {
      formControl.setValue(null);
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return hexadecimal true when control value is hexadecimal (passed like number)', () => {
      formControl.setValue(0x10);
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return hexadecimal true when control value is hexadecimal (passed like string)', () => {
      formControl.setValue(0x02);
      validator = validatorFn(formControl);
      expect(validator).toEqual({ minHexadecimal: { min: 5 } });
    });
  });

  describe('CustomValidators.maxHexadecimalValidator()', () => {
    beforeAll(() => {
      formControl = new FormControl();
      validatorFn = CustomValidators.maxHexadecimalValidator(5);
    });

    it('should return null when control value is null', () => {
      formControl.setValue(null);
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return hexadecimal true when control value is hexadecimal (passed like number)', () => {
      formControl.setValue(0x02);
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return hexadecimal true when control value is hexadecimal (passed like string)', () => {
      formControl.setValue('0x10');
      validator = validatorFn(formControl);
      expect(validator).toEqual({ maxHexadecimal: { max: 5 } });
    });
  });

  describe('CustomValidators.parsedDateStringValidator()', () => {
    beforeAll(() => {
      formControl = new FormControl();
      validatorFn = CustomValidators.parsedDateStringValidator();
    });

    it('should return null when control value is null', () => {
      formControl.setValue(null);
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return error when control value is invalid date', () => {
      formControl.setValue('24//24');
      validator = validatorFn(formControl);
      expect(validator).toEqual({ parsedDateString: true });
    });

    it('should return null when control value is valid date', () => {
      formControl.setValue('12/12');
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });
  });

  describe('postcodeFormatValidator', () => {
    beforeAll(() => {
      formControl = new FormControl();
      validatorFn = CustomValidators.postcodeFormatValidator();
    });

    it('should return error when control value is null', () => {
      formControl.setValue(null);
      validator = validatorFn(formControl);
      expect(validator).toEqual({ postcodeFormat: true });
    });

    it('should return error when control value is invalid postcode', () => {
      formControl.setValue('1234');
      validator = validatorFn(formControl);
      expect(validator).toEqual({ postcodeFormat: true });
    });

    it('should return null when control value is valid postcode SW1W 0NY', () => {
      formControl.setValue('SW1W 0NY');
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return null when control value is valid postcode PO16 7GZ', () => {
      formControl.setValue('PO16 7GZ');
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });

    it('should return null when control value is valid half postcode SW1W', () => {
      formControl.setValue('SW1W');
      validator = validatorFn(formControl);
      expect(validator).toBeNull();
    });
  });
});
