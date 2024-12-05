import {
  Component,
  Input,
  OnInit,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  Injector,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

@Component({
  selector: 'theme-form-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckboxComponent),
      multi: true
    }
  ]
})
export class FormCheckboxComponent extends ControlValueAccessorComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input() size?: 'small' | 'normal';

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };
  cssClass = '';

  isRunningOnBrowser: boolean;
  isRunningOnServer: boolean;

  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);

    this.isRunningOnBrowser = isPlatformBrowser(injector.get(PLATFORM_ID));
    this.isRunningOnServer = isPlatformServer(injector.get(PLATFORM_ID));
  }

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();

    this.cssClass = this.size === 'small' ? 'form-checkboxes-small' : '';
  }

  ngDoCheck(): void {
    this.hasError = this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty);
    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldControl.errors)
      : { message: '', params: {} };
    this.cdr.detectChanges();
  }
}
