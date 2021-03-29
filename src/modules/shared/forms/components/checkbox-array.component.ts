import { Component, Input, OnInit, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ControlContainer, FormArray, FormControl } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

import { FormEngineParameterModel } from '../engine/models/form-engine.models';


@Component({
  selector: 'theme-form-checkbox-array',
  templateUrl: './checkbox-array.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormCheckboxArrayComponent implements OnInit, DoCheck {

  @Input() id?: string;
  @Input() formArrayName?: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input() items: FormEngineParameterModel['items'] = [];

  hasError = false;
  errorMessage = '';

  isRunningOnBrowser: boolean;
  isRunningOnServer: boolean;

  // Get hold of the control being used.
  get fieldArrayControl(): FormArray { return this.injector.get(ControlContainer)?.control as FormArray; }
  get fieldArrayValues(): string[] { return this.fieldArrayControl.value as string[]; }

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {

    this.isRunningOnBrowser = isPlatformBrowser(injector.get(PLATFORM_ID));
    this.isRunningOnServer = isPlatformServer(injector.get(PLATFORM_ID));

    this.id = this.id || RandomGeneratorHelper.generateRandom();

  }


  ngOnInit(): void {

    // This will filter any value not available on the items variable.
    const itemsValues = (this.items || []).map(item => item.value);
    this.fieldArrayValues.forEach((item) => {
      if (!itemsValues.includes(item)) {
        const index = (this.fieldArrayControl.value as string[]).indexOf(item);
        this.fieldArrayControl.removeAt(index);
      }
    });

  }

  ngDoCheck(): void {

    this.hasError = (this.fieldArrayControl.invalid && (this.fieldArrayControl.touched || this.fieldArrayControl.dirty));
    this.errorMessage = this.hasError ? FormEngineHelper.getValidationMessage(this.fieldArrayControl.errors) : '';
    this.cdr.detectChanges();

  }


  isChecked(value: string): boolean {
    return this.fieldArrayValues.includes(value);
  }

  onChanged(e: Event): void {

    const event = e.target as HTMLInputElement;
    const valueIndex = (this.fieldArrayControl.value as string[]).indexOf(event.value);

    if (event.checked && valueIndex === -1) {
      this.fieldArrayControl.push(new FormControl(event.value));
    }

    if (!event.checked && valueIndex > -1) {
      this.fieldArrayControl.removeAt(valueIndex);
    }

  }

}
