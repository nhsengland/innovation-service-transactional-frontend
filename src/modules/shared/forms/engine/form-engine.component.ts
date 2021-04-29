import { Component, OnInit, OnChanges, Input, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

import { FormEngineHelper } from './helpers/form-engine.helper';

import { FormEngineParameterModel } from './models/form-engine.models';

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
  selector: 'theme-form-engine',
  templateUrl: './form-engine.component.html',
  styleUrls: ['./form-engine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormEngineComponent implements OnInit, OnChanges {

  @Input() formId = '';
  @Input() action = '';

  @Input() parameters: FormEngineParameterModel[] = [];
  @Input() values?: { [key: string]: any } = {};

  private loggerContext = 'Catalog::FormsModule::EngineComponent::';

  public form: FormGroup = new FormGroup({});

  public contentReady = false;

  constructor(
    private readonly logger: NGXLogger,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.values = this.values || {};

    this.buildForm();

    // this.logger.debug(this.loggerContext + 'ngOnInit', this.form.valid);

    this.contentReady = true;
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {

    // When any of the input change (after component initialization), form gets updated!
    if (!changes.parameters?.isFirstChange() && !changes.values?.isFirstChange()) {
      // this.logger.debug(this.loggerContext + 'OnChanges: Parameters', this.parameters);
      // this.logger.debug(this.loggerContext + 'OnChanges: Values', this.values);
      this.buildForm();
    }

  }


  buildForm(): void {

    this.form = new FormGroup({}); // This will ensure that previous information is cleared!

    this.form = FormEngineHelper.buildForm(this.parameters, this.values);

    this.cdr.detectChanges();

  }


  addFieldGroupRow(parameter: FormEngineParameterModel, value?: { [key: string]: any }): void {
    (this.form.get(parameter.id) as FormArray).push(FormEngineHelper.addFieldGroupRow(parameter, value));
  }

  removeFieldGroupRow(parameterId: string, index: number): void {
    (this.form.get(parameterId) as FormArray).removeAt(index);
  }

  trackFieldGroupRowsChanges(index: number, item: { [key: string]: any }): number {
    return index;
  }


  getFormValues(): { valid: boolean, data: { [key: string]: any } } {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
    }

    return FormEngineHelper.getFormValues(this.form, this.parameters);

  }

}
