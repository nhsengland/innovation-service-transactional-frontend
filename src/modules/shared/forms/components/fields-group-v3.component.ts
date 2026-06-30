import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Injector, Input } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormGroup } from '@angular/forms';
import { FormEngineHelperV3 } from '../engine/helpers/form-engine-v3.helper';
import { FormEngineParameterModelV3 } from '..';

@Component({
  selector: 'theme-form-fields-group-v3',
  templateUrl: './fields-group-v3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldsGroupV3Component implements DoCheck {
  @Input({ required: true }) fieldArrayControl!: FormArray;
  @Input({ required: true }) parameter!: FormEngineParameterModelV3;
  @Input() addNewLabel?: string;
  @Input() onlyOneField = true;

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  get parentControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  ngDoCheck(): void {
    const fieldArray = this.fieldArrayControl;

    this.hasError = fieldArray.invalid && (fieldArray.touched || fieldArray.dirty);
    this.error = this.hasError
      ? FormEngineHelperV3.getValidationMessage(fieldArray.errors)
      : { message: '', params: {} };

    this.cdr.markForCheck();
  }
  addFieldGroupRow(): void {
    this.fieldArrayControl.push(FormEngineHelperV3.addFieldGroupRow(this.parameter));
  }

  removeFieldGroupRow(index: number): void {
    this.fieldArrayControl.removeAt(index);
  }

  trackFieldGroupRowsChanges(index: number): number {
    return index;
  }
}
