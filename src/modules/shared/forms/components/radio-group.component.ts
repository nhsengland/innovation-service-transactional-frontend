import {
  Component,
  Input,
  OnInit,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  Injector,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

import { FormEngineParameterModel } from '../engine/models/form-engine.models';

@Component({
  selector: 'theme-form-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  encapsulation: ViewEncapsulation.None, // WARNING: Styles applied here are global!
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRadioGroupComponent),
      multi: true
    }
  ]
})
export class FormRadioGroupComponent extends ControlValueAccessorComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input() items?: FormEngineParameterModel['items'] = [];
  @Input() size?: 'small' | 'normal';
  @Input() pageUniqueField? = true;
  @Input() cssOverride?: string;
  @Input() additional?: FormEngineParameterModel[] = [];

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  cssClass = '';
  divCssOverride = '';

  isRunningOnBrowser: boolean;
  isRunningOnServer: boolean;

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

  // Get hold of the control being used.
  conditionalFormControl(f: string): FormControl {
    return this.parentFieldControl?.get(f) as FormControl;
  }

  isConditionalFieldVisible(conditionalFieldId: string): boolean {
    return (
      (this.items || []).filter(
        item => item.value === this.fieldControl.value && item.conditional?.id === conditionalFieldId
      ).length > 0
    );
  }

  isConditionalFieldError(f: string): boolean {
    const control = this.conditionalFormControl(f);
    return control.invalid && (control.touched || control.dirty);
  }

  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);

    this.isRunningOnBrowser = isPlatformBrowser(injector.get(PLATFORM_ID));
    this.isRunningOnServer = isPlatformServer(injector.get(PLATFORM_ID));

    this.items = Object.assign({}, this.items);
  }

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();
    this.cssClass = this.size === 'small' ? 'form-radios-small' : '';
    this.divCssOverride = this.cssOverride || 'nhsuk-u-padding-top-4';
  }

  ngDoCheck(): void {
    this.hasError = this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty);
    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldControl.errors)
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
}
