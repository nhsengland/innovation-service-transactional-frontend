import {
  Component,
  Input,
  OnInit,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
  PLATFORM_ID,
  Output,
  EventEmitter
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AbstractControl, ControlContainer, FormArray, FormControl } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

import { FormEngineParameterModel } from '../engine/models/form-engine.models';

@Component({
  selector: 'theme-form-checkbox-array',
  templateUrl: './checkbox-array.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormCheckboxArrayComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() items: FormEngineParameterModel['items'] = [];
  @Input() size?: 'small' | 'normal';
  @Input() pageUniqueField? = true;
  @Input() disabledItems?: string[] = [];

  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };

  cssClass = '';

  isRunningOnBrowser: boolean;
  isRunningOnServer: boolean;

  exclusiveItem: string | undefined = undefined;

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  get fieldArrayControl(): FormArray {
    return this.parentFieldControl?.get(this.arrayName) as FormArray;
  }
  get fieldArrayValues(): string[] {
    return this.fieldArrayControl.value as string[];
  }

  // Accessibility.
  get ariaDescribedBy(): null | string {
    let s = '';
    if (this.description) {
      s += `hint-${this.id}`;
    }
    if (this.hasError) {
      s += `${s ? ' ' : ''}error-${this.id}`;
    }
    return s || null;
  }

  conditionalFormControl(f: string): FormControl {
    return this.parentFieldControl?.get(f) as FormControl;
  }

  isConditionalFieldVisible(conditionalFieldId: string): boolean {
    return (
      (this.items || []).filter(
        item => this.fieldArrayValues.includes(item.value) && item.conditional?.id === conditionalFieldId
      ).length > 0
    );
  }

  isConditionalFieldError(f: string): boolean {
    const control = this.conditionalFormControl(f);
    return control.invalid && (control.touched || control.dirty);
  }

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    this.isRunningOnBrowser = isPlatformBrowser(injector.get(PLATFORM_ID));
    this.isRunningOnServer = isPlatformServer(injector.get(PLATFORM_ID));
  }

  ngOnInit(): void {
    this.lookForAndSetExclusive();

    this.id = this.id || RandomGeneratorHelper.generateRandom();
    this.cssClass = this.size === 'small' ? 'form-checkboxes-small' : '';

    // This will filter any value not available on the items variable.
    const itemsValues = (this.items || []).map(item => item.value);
    this.fieldArrayValues.forEach(item => {
      if (!itemsValues.includes(item)) {
        const index = (this.fieldArrayControl.value as string[]).indexOf(item);
        this.fieldArrayControl.removeAt(index);
      }
    });
  }

  ngDoCheck(): void {
    this.hasError = this.fieldArrayControl.invalid && (this.fieldArrayControl.touched || this.fieldArrayControl.dirty);
    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldArrayControl.errors)
      : { message: '', params: {} };

    this.items
      ?.filter(item => item.conditional)
      .forEach(item => {
        if (item.conditional) {
          if (item.conditional.isVisible && this.isConditionalFieldVisible(item.conditional.id)) {
            this.conditionalFormControl(item.conditional.id).setValidators(
              FormEngineHelper.getParameterValidators(item.conditional)
            );
          } else {
            this.conditionalFormControl(item.conditional.id).setValidators(null);
            this.conditionalFormControl(item.conditional.id).reset();
          }
          this.conditionalFormControl(item.conditional.id).updateValueAndValidity();
        }
      });

    this.cdr.detectChanges();
  }

  isChecked(value: string): boolean {
    return this.fieldArrayValues.includes(value);
  }

  onChanged(e: Event): void {
    const event = e.target as HTMLInputElement;
    const valueIndex = (this.fieldArrayControl.value as string[]).indexOf(event.value);

    if (event.checked && valueIndex === -1) {
      if (this.isItemExclusive(event.value) || this.isExclusiveChecked()) {
        this.fieldArrayControl.clear();
      }

      this.fieldArrayControl.push(new FormControl(event.value));
    }

    if (!event.checked && valueIndex > -1) {
      this.fieldArrayControl.removeAt(valueIndex);
    }
  }

  private isItemExclusive(value: string): boolean {
    return this.exclusiveItem === value;
  }

  private isExclusiveChecked(): boolean {
    return this.exclusiveItem !== undefined && (this.fieldArrayControl.value as string[]).includes(this.exclusiveItem);
  }

  private lookForAndSetExclusive() {
    this.items?.forEach(item => item.exclusive && (this.exclusiveItem = item.value));
  }
}
