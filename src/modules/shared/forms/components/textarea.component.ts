import { Component, Input, OnInit, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { ControlValueAccessorConnector } from '../base/control-value-accessor.connector';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';


@Component({
  selector: 'theme-form-textarea',
  templateUrl: './textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormTextareaComponent),
    multi: true
  }]
})
export class FormTextareaComponent extends ControlValueAccessorConnector implements OnInit, DoCheck {

  @Input() id?: string;
  @Input() type?: 'text' | 'number' | 'hidden' | 'password';
  @Input() label?: string;
  @Input() description?: string;
  @Input() placeholder?: string;
  @Input() lengthLimit?: 'small' | 'medium' | 'large';
  @Input() pageUniqueField = true;
  @Input() cssOverride?: string;

  hasError = false;
  error: { message: string, params: { [key: string]: string } } = { message: '', params: {} };

  lengthLimitCharacters = 200;

  divCssOverride = '';

  // Accessibility.
  get ariaDescribedBy(): null | string {
    let s = '';
    if (this.description) { s += `hint-${this.id}`; }
    if (this.hasError) { s += `${s ? ' ' : ''}error-${this.id}`; }
    return s || null;
  }


  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {

    super(injector);

  }

  ngOnInit(): void {

    this.id = this.id || RandomGeneratorHelper.generateRandom();
    this.type = this.type || 'text';
    this.placeholder = this.placeholder || '';

    this.lengthLimit = this.lengthLimit || 'small';
    switch (this.lengthLimit) {
      case 'large':
        this.lengthLimitCharacters = 2000;
        break;
      case 'medium':
        this.lengthLimitCharacters = 500;
        break;
      case 'small':
      default:
        this.lengthLimitCharacters = 200;
        break;
    }

    const validators = this.fieldControl.validator ? [this.fieldControl.validator] : [];
    validators.push(Validators.maxLength(this.lengthLimitCharacters));
    this.fieldControl.setValidators(validators);

    this.divCssOverride = this.cssOverride || '';

  }

  ngDoCheck(): void {

    this.hasError = (this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty));
    this.error = this.hasError ? FormEngineHelper.getValidationMessage(this.fieldControl.errors) : { message: '', params: {} };
    this.cdr.detectChanges();

  }

}
