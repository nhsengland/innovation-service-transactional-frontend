import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';

import { Subscription, debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';
import { TEXTAREA_LENGTH_LIMIT, TextareaLengthLimitType } from '../engine/config/form-engine.config';


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
export class FormTextareaComponent extends ControlValueAccessorComponent implements OnInit, DoCheck, OnDestroy {

  @ViewChild('textArea', { static: true }) textAreaRef?: ElementRef<HTMLTextAreaElement>;

  @Input() id?: string;
  @Input() type?: 'text' | 'number' | 'hidden' | 'password';
  @Input() label?: string;
  @Input() description?: string;
  @Input() placeholder?: string;
  @Input() lengthLimit?: TextareaLengthLimitType;
  @Input() pageUniqueField = true;
  @Input() cssOverride?: string;

  hasError = false;
  error: { message: string, params: { [key: string]: string } } = { message: '', params: {} };

  lengthLimitCharacters = 200;

  divCssOverride = '';

  textAreaValue = '';

  private fieldChangeSubscription = new Subscription();

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

    this.lengthLimit = this.lengthLimit ?? 'xs';
    this.lengthLimitCharacters = TEXTAREA_LENGTH_LIMIT[this.lengthLimit ?? 'xs'];

    const validators = this.fieldControl.validator ? [this.fieldControl.validator] : [];
    validators.push(Validators.maxLength(this.lengthLimitCharacters));
    this.fieldControl.setValidators(validators);

    this.divCssOverride = this.cssOverride || '';

    if (this.textAreaRef) {
      this.fieldChangeSubscription.add(
        fromEvent(this.textAreaRef.nativeElement, 'keyup')
          .pipe(
            map((event: Event) => (event.target as HTMLTextAreaElement).value),
            debounceTime(1000),
            distinctUntilChanged()
          )
          .subscribe(value => {
            this.textAreaValue = value;
            this.cdr.markForCheck();
          })
      );
    }

  }

  ngDoCheck(): void {

    if (this.fieldControl.value !== null && this.textAreaValue === '') {
      this.textAreaValue = this.fieldControl.value;
    }

    this.hasError = (this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty));
    this.error = this.hasError ? FormEngineHelper.getValidationMessage(this.fieldControl.errors) : { message: '', params: {} };
    this.cdr.detectChanges();

  }

  ngOnDestroy(): void {
    this.fieldChangeSubscription.unsubscribe();
  }

}
