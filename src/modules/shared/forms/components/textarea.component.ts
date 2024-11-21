import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';
import { TEXTAREA_LENGTH_LIMIT, TextareaLengthLimitType } from '../engine/config/form-engine.config';

@Component({
  selector: 'theme-form-textarea',
  templateUrl: './textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent extends ControlValueAccessorComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('textArea', { static: true }) textAreaRef?: ElementRef<HTMLTextAreaElement>;

  @Input() id?: string;
  @Input() type?: 'text' | 'number' | 'hidden' | 'password';
  @Input() label?: string;
  @Input() description?: string;
  @Input() placeholder?: string;
  @Input() lengthLimit?: TextareaLengthLimitType;
  @Input() pageUniqueField? = true;
  @Input() cssOverride?: string;

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  lengthLimitCharacters = 200;
  currentAvailableCharacters = 0;

  divCssOverride = '';

  private fieldChangeSubscription = new Subscription();

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
    this.type = this.type ?? 'text';
    this.placeholder = this.placeholder ?? '';

    this.lengthLimit = this.lengthLimit ?? 'xs';
    this.lengthLimitCharacters = this.currentAvailableCharacters = TEXTAREA_LENGTH_LIMIT[this.lengthLimit ?? 'xs'];

    this.divCssOverride = this.cssOverride ?? '';

    const validators = this.fieldControl.validator ? [this.fieldControl.validator] : [];
    validators.push(Validators.maxLength(this.lengthLimitCharacters));
    this.fieldControl.setValidators(validators);

    // Characters countdown behaviors.
    // // This makes sure that counter is updated when user is typing, even with form onUpdate: 'blur'.
    if (this.textAreaRef) {
      this.fieldChangeSubscription.add(
        fromEvent(this.textAreaRef.nativeElement, 'keyup')
          .pipe(
            distinctUntilChanged(),
            debounceTime(100),
            map((event: Event) => (event.target as HTMLTextAreaElement).value)
          )
          .subscribe(value => {
            this.fieldControl.setValue(value);
            this.currentAvailableCharacters = this.lengthLimitCharacters - value.length;
            this.cdr.markForCheck();
          })
      );
    }

    // // This makes sure that counter is updated when value is changed from parent component.
    // // Note: This will take into account the form onUpdate strategy.
    this.fieldChangeSubscription.add(
      this.fieldControl.valueChanges.subscribe(value => {
        this.currentAvailableCharacters = this.lengthLimitCharacters - value.length;
      })
    );
  }

  ngDoCheck(): void {
    if (this.fieldControl.value?.length > 0) {
      this.currentAvailableCharacters = this.lengthLimitCharacters - this.fieldControl.value.length;
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
