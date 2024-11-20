import {
  Component,
  Input,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

import { FormEngineParameterModel } from '../engine/models/form-engine.models';

@Component({
  selector: 'theme-form-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormCheckboxGroupComponent implements DoCheck {
  @Input() id?: string;
  @Input({ required: true }) groupName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() items: FormEngineParameterModel['items'] = [];
  @Input() pageUniqueField? = true;

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  isRunningOnBrowser: boolean;
  isRunningOnServer: boolean;

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  get fieldGroupControl(): FormGroup {
    return this.parentFieldControl?.get(this.groupName) as FormGroup;
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

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    this.isRunningOnBrowser = isPlatformBrowser(injector.get(PLATFORM_ID));
    this.isRunningOnServer = isPlatformServer(injector.get(PLATFORM_ID));

    this.id = this.id || RandomGeneratorHelper.generateRandom();
  }

  ngDoCheck(): void {
    this.hasError = this.fieldGroupControl.invalid && (this.fieldGroupControl.touched || this.fieldGroupControl.dirty);
    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldGroupControl.errors)
      : { message: '', params: {} };
    this.cdr.detectChanges();
  }

  isChecked(value: string): boolean {
    return !!this.fieldGroupControl.get(value)?.value;
  }
}
