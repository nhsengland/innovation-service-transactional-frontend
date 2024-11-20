import { Component, Injector, Input, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective
} from '@angular/forms';

@Component({ template: '' })
// Next line exception disables rule: "ComponentClassName should end with the suffix Component"
export abstract class ControlValueAccessorComponent implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true }) formControlDirective?: FormControlDirective;

  @Input() formControl?: FormControl;
  @Input() controlName = '';

  // Return parent FormGroup (or FormArray) instance.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  // Return FormControl instance no matter formControl or controlName is given.
  get fieldControl(): FormControl {
    return this.formControl || (this.parentFieldControl?.get(this.controlName) as FormControl);
  }

  constructor(private injector: Injector) {}

  // ControlValueAccessor interface methods.
  // // Register a callback that is called every time the native form control is updated.
  registerOnChange(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnChange(fn);
  }
  // // Register a callback that is used to indicate that a user interacted with a control (Ex: touch event)
  registerOnTouched(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
  }
  // // Used by formControl to set the value to the native form control.
  writeValue(value: any): void {
    this.formControlDirective?.valueAccessor?.writeValue(value);
  }
  // // Called when the control status changes to or from DISABLED.
  setDisabledState(isDisabled: boolean): void {
    if (this.formControlDirective?.valueAccessor?.setDisabledState) {
      this.formControlDirective?.valueAccessor?.setDisabledState(isDisabled);
    }
  }
}
