import { isPlatformBrowser } from '@angular/common';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { FormEngineParameterModelV3 } from './models/form-engine.models';
import { FormEngineHelperV3 } from './helpers/form-engine-v3.helper';

/**
 * @param parameters is an array of ParameterModel. For more info, check ParameterModel.
 * @param values is an object of objects to set the values of the parameters. This object follows the structure { parameterKey: { dataType, value } }.
 *
 * parameters will be drawn according with their rank and if none is provided, it will be displayed last, by the order they are in the array
 *
 * getFormValues() returns the value of the form and its state (valid or not). This is triggered by the components that use form engine so that they
 * can have access to the values of the form.
 */
@Component({
  selector: 'theme-form-engine-v3',
  templateUrl: './form-engine-v3.component.html',
  styleUrls: ['./form-engine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormEngineV3Component implements OnInit, OnChanges, OnDestroy {
  @Input() formId = '';
  @Input() action = '';

  @Input() parameters: FormEngineParameterModelV3[] = [];
  @Input() formValidations?: ValidatorFn[];
  @Input() values?: { [key: string]: any } = {};
  @Output() formChanges: any = new EventEmitter<{ [key: string]: any }>();

  private formChangeSubscription = new Subscription();
  private loggerContext = 'Catalog::FormsModule::EngineComponent::';

  form: FormGroup = new FormGroup({});

  contentReady = false;

  onlyOneField = true;

  csrfToken = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private tokenExtractor: HttpXsrfTokenExtractor,
    private readonly logger: NGXLogger,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.csrfToken = this.tokenExtractor.getToken() || '';
  }

  ngOnInit(): void {
    this.values = this.values || {};

    this.buildForm();

    this.contentReady = true;
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When any of the input change (after component initialization), form gets updated!
    if (!changes.parameters?.isFirstChange() && !changes.values?.isFirstChange()) {
      this.buildForm();
    }
  }

  buildForm(): void {
    this.form = new FormGroup({}); // This will ensure that previous information is cleared!

    this.form = FormEngineHelperV3.buildForm(this.parameters, this.values, this.formValidations);

    this.onlyOneField = this.parameters.length === 1;

    this.formChangeSubscription.unsubscribe();
    this.formChangeSubscription = new Subscription();
    this.formChangeSubscription.add(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.formChanges.emit(this.form.value))
    );

    // To avoid missing vital information for SR, position the focus at the top of newly generated content
    if (isPlatformBrowser(this.platformId) && this.onlyOneField) {
      setTimeout(() => {
        const h = document.getElementById(this.formId) as HTMLFormElement;
        if (h) {
          h.setAttribute('tabIndex', '-1');
          h.focus();
          h.addEventListener('blur', e => {
            e.preventDefault();
            h.removeAttribute('tabIndex');
          });
        }
      });
    }

    this.cdr.detectChanges();
  }

  addFieldGroupRow(parameter: FormEngineParameterModelV3, value?: { [key: string]: any }): void {
    (this.form.get(parameter.id) as FormArray).push(FormEngineHelperV3.addFieldGroupRow(parameter, value));
  }

  removeFieldGroupRow(parameterId: string, index: number): void {
    (this.form.get(parameterId) as FormArray).removeAt(index);
  }

  trackFieldGroupRowsChanges(index: number, item: { [key: string]: any }): number {
    return index;
  }

  isFormPending(): boolean {
    return this.form.pending;
  }

  getFormValues(triggerFormChanges?: boolean): { valid: boolean; data: { [key: string]: any } } {
    const shouldTriggerChanges = triggerFormChanges !== undefined ? triggerFormChanges : true;

    if (shouldTriggerChanges && !this.form.valid) {
      this.form.markAllAsTouched();

      if (isPlatformBrowser(this.platformId)) {
        // Try to focus the first invalid field available.
        setTimeout(() => {
          // Await for the html injection if needed.
          const h = document.querySelector(
            'input[aria-invalid="true"], fieldset.nhsuk-fieldset, textarea[aria-invalid="true"]'
          ) as HTMLInputElement;
          if (h) {
            h.setAttribute('tabIndex', '-1');
            h.focus();
            h.addEventListener('blur', e => {
              e.preventDefault();
              h.removeAttribute('tabIndex');
            });
          }
        });
      }

      this.cdr.detectChanges();
    }

    return FormEngineHelperV3.getFormValues(this.form, this.parameters);
  }

  ngOnDestroy(): void {
    this.formChangeSubscription.unsubscribe();
  }
}
