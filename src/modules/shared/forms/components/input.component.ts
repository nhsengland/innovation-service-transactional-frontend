import { Component, Input, OnInit, DoCheck, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ControlValueAccessorConnector } from '../base/control-value-accessor.connector';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

import { RandomGeneratorHelper } from '@modules/core';

@Component({
  selector: 'theme-form-input',
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormInputComponent),
    multi: true
  }]
})
export class FormInputComponent extends ControlValueAccessorConnector implements OnInit, DoCheck, OnDestroy {

  @Input() id?: string;
  @Input() type?: 'text' | 'number' | 'hidden' | 'password';
  @Input() label?: string;
  @Input() description?: string;
  @Input() placeholder?: string;
  @Input() pageUniqueField = true;
  @Input() width?: 'one-third' | 'two-thirds' | 'three-quarters' | 'full';
  @Input() cssOverride?: string;

  private fieldChangeSubscription = new Subscription();

  hasError = false;
  error: { message: string, params: { [key: string]: string } } = { message: '', params: {} };

  inputCssClass = '';
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

    this.inputCssClass = this.width ? `nhsuk-u-width-${this.width}` : 'nhsuk-u-width-two-thirds';
    this.divCssOverride = this.cssOverride || ''; // nhsuk-u-padding-top-4

    this.fieldChangeSubscription.add(
      this.fieldControl.statusChanges.subscribe(i => this.onStatusChange())
    );

  }

  ngDoCheck(): void {
    this.onStatusChange();
  }


  onStatusChange(): void {

    this.hasError = (this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty));
    this.error = this.hasError ? FormEngineHelper.getValidationMessage(this.fieldControl.errors) : { message: '', params: {} };
    this.cdr.detectChanges();

  }


  ngOnDestroy(): void {
    this.fieldChangeSubscription.unsubscribe();
  }

}
