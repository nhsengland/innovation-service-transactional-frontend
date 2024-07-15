import {
  Component,
  Input,
  OnInit,
  DoCheck,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  Injector,
  ViewChild,
  ElementRef
} from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';
import { DatesHelper } from '@app/base/helpers';

@Component({
  selector: 'theme-form-date-input',
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDateInputComponent),
      multi: true
    }
  ]
})
export class FormDateInputComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('input', { static: true }) inputRef?: ElementRef<HTMLInputElement>;

  @Input() id?: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() placeholder?: string;
  @Input() pageUniqueField = true;
  @Input() width?: 'one-third' | 'two-thirds' | 'three-quarters' | 'full';
  @Input() cssOverride?: string;

  private fieldChangeSubscription = new Subscription();

  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };

  inputCssClass = '';
  divCssOverride = '';

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  get formGroup(): FormGroup<{
    day: FormControl;
    month: FormControl;
    year: FormControl;
  }> {
    return this.parentFieldControl?.get('date') as FormGroup;
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
  ) {}

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();
    this.placeholder = this.placeholder || '';

    this.inputCssClass = this.width ? `nhsuk-u-width-${this.width}` : 'nhsuk-u-width-two-thirds';
    this.divCssOverride = this.cssOverride || ''; // nhsuk-u-padding-top-4

    this.fieldChangeSubscription.add(this.formGroup.valueChanges.subscribe(i => this.onValueChange()));
  }

  ngDoCheck(): void {
    this.onValueChange();
  }

  onValueChange(): void {
    this.hasError = this.formGroup.invalid && (this.formGroup.touched || this.formGroup.dirty);
    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.formGroup.errors)
      : { message: '', params: {} };

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.fieldChangeSubscription.unsubscribe();
  }
}
