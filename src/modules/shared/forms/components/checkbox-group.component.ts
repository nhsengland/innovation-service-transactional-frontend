import { Component, Input, OnInit, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

import { FormEngineParameterModel } from '../engine/models/form-engine.models';


@Component({
  selector: 'theme-form-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormCheckboxGroupComponent implements OnInit, DoCheck {

  @Input() id?: string;
  @Input() groupName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() items: FormEngineParameterModel['items'] = [];
  @Input() pageUniqueField = true;

  hasError = false;
  errorMessage = '';

  isRunningOnBrowser: boolean;
  isRunningOnServer: boolean;

  // Return parent FormGroup (or FormArray) instance.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }

  // Get hold of the control being used.
  get fieldGroupControl(): FormGroup {
    return this.parentFieldControl?.get(this.groupName) as FormGroup;
  }


  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {

    this.isRunningOnBrowser = isPlatformBrowser(injector.get(PLATFORM_ID));
    this.isRunningOnServer = isPlatformServer(injector.get(PLATFORM_ID));

    this.id = this.id || RandomGeneratorHelper.generateRandom();

  }


  ngOnInit(): void { }

  ngDoCheck(): void {

    this.hasError = (this.fieldGroupControl.invalid && (this.fieldGroupControl.touched || this.fieldGroupControl.dirty));
    this.errorMessage = this.hasError ? FormEngineHelper.getValidationMessage(this.fieldGroupControl.errors) : '';
    this.cdr.detectChanges();

  }

  isChecked(value: string): boolean {
    return !!this.fieldGroupControl.get(value)?.value;
  }

}
