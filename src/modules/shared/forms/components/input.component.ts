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
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';

import { InputLengthLimitType, INPUT_LENGTH_LIMIT } from '../engine/config/form-engine.config';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

@Component({
  selector: 'theme-form-input',
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent extends ControlValueAccessorComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('input', { static: true }) inputRef?: ElementRef<HTMLInputElement>;

  @Input() id?: string;
  @Input() type?: 'text' | 'number' | 'hidden' | 'password';
  @Input() label?: string;
  @Input() description?: string;
  @Input() placeholder?: string;
  @Input() lengthLimit?: InputLengthLimitType;
  @Input() isEditable?: boolean;
  @Input() pageUniqueField? = true;
  @Input() width?: 'one-third' | 'two-thirds' | 'three-quarters' | 'full';
  @Input() cssOverride?: string;

  private fieldChangeSubscription = new Subscription();

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  lengthLimitCharacters?: number;
  currentAvailableCharacters?: number;

  inputCssClass = '';
  divCssOverride = '';

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
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();
    this.type = this.type || 'text';
    this.placeholder = this.placeholder || '';

    if (this.lengthLimit) {
      this.lengthLimitCharacters = this.currentAvailableCharacters = INPUT_LENGTH_LIMIT[this.lengthLimit];

      const validators = this.fieldControl.validator ? [this.fieldControl.validator] : [];
      validators.push(Validators.maxLength(this.lengthLimitCharacters));
      this.fieldControl.setValidators(validators);

      // // This makes sure that counter is updated when user is typing, even with form onUpdate: 'blur'.
      if (this.inputRef) {
        this.fieldChangeSubscription.add(
          fromEvent(this.inputRef.nativeElement, 'keyup')
            .pipe(
              distinctUntilChanged(),
              debounceTime(100),
              map((event: Event) => (event.target as HTMLInputElement).value)
            )
            .subscribe(value => {
              this.fieldControl.setValue(value);
              this.currentAvailableCharacters = this.lengthLimitCharacters! - value.length;
              this.cdr.markForCheck();
            })
        );
      }

      // // This makes sure that counter is updated when value is changed from parent component.
      // // Note: This will take into account the form onUpdate strategy.
      this.fieldChangeSubscription.add(
        this.fieldControl.valueChanges.subscribe(value => {
          this.currentAvailableCharacters = this.lengthLimitCharacters! - value.length;
        })
      );
    }

    this.inputCssClass = this.width ? `nhsuk-u-width-${this.width}` : 'nhsuk-u-width-two-thirds';
    this.divCssOverride = this.cssOverride || ''; // nhsuk-u-padding-top-4

    this.fieldChangeSubscription.add(this.fieldControl.statusChanges.subscribe(i => this.onStatusChange()));
  }

  ngDoCheck(): void {
    this.onStatusChange();
  }

  onStatusChange(): void {
    if (this.lengthLimit && this.fieldControl.value?.length > 0) {
      this.currentAvailableCharacters = this.lengthLimitCharacters! - this.fieldControl.value.length;
    }

    this.hasError = this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty);
    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldControl.errors)
      : { message: '', params: {} };
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.fieldChangeSubscription.unsubscribe();
  }
}
