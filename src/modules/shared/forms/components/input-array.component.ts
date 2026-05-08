import { Component, Input, OnInit, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { FormEngineHelperV3 } from '../engine/helpers/form-engine-v3.helper';
import { FormEngineParameterModelV3 } from '../engine/models/form-engine.models';
import {
  InnovationRecordItemsType,
  InnovationRecordStepValidationsType,
  ItemConditionOptionsType
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';
import { CustomValidators } from '../validators/custom-validators';

export type InnovationRecordItemType = {
  id?: string;
  label?: string;
  description?: string;
  exclusive?: boolean;
  conditional?: FormEngineParameterModelV3;
  group?: string;
  type?: string;
  itemsFromAnswer?: string;
  itemConditionOptions?: ItemConditionOptionsType;
  validations?: InnovationRecordStepValidationsType;
};

@Component({
  selector: 'theme-form-input-array-v3',
  templateUrl: './input-array.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormInputArrayV3Component extends ControlValueAccessorComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() groupName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() items: FormEngineParameterModelV3['items'] = [];
  @Input() placeholder?: string;
  @Input() isEditable = true;
  @Input() pageUniqueField = true;
  @Input() width?: 'one-third' | 'two-thirds' | 'three-quarters' | 'full';
  @Input() cssOverride?: string;
  @Input() relatedAnswers?: Record<string, string> = {};

  itemHasErrorMap: Record<string, boolean> = {};
  itemErrorMap: Record<string, { message: string; params: Record<string, string> }> = {};

  inputCssClass = '';
  divCssOverride = '';

  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  get fieldGroupControl(): FormGroup {
    return this.parentFieldControl?.get(this.groupName) as FormGroup;
  }

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();
    this.placeholder = this.placeholder || '';
    this.inputCssClass = this.width ? `nhsuk-u-width-${this.width}` : 'nhsuk-u-width-two-thirds';
    this.divCssOverride = this.cssOverride || '';

    if (this.items) this.setItemsValidations(this.items!);
  }

  ngDoCheck(): void {
    this.items?.forEach(item => {
      if (!item.id) return;

      const control = this.getItemControl(item.id);
      if (!control) return;

      const hasError = control.invalid && (control.touched || control.dirty);
      this.itemHasErrorMap[item.id] = hasError;
      this.itemErrorMap[item.id] = hasError
        ? FormEngineHelperV3.getValidationMessage(control.errors)
        : { message: '', params: {} };
    });

    this.cdr.detectChanges();
  }

  getItemControl(itemId?: string): FormControl | null {
    if (!itemId) return null;
    return this.fieldGroupControl?.get(itemId) as FormControl;
  }

  setItemsValidations(items: InnovationRecordItemsType) {
    items.forEach(i => {
      const itemControl = this.getItemControl(i.id);

      const isOptional =
        i.itemConditionOptions && FormEngineHelperV3.isItemOptional(i.itemConditionOptions, this.relatedAnswers!);

      if (itemControl && i.validations) {
        const validations: ValidatorFn[] = [];
        if (!isOptional) {
          const validation = i.validations.isRequired ?? 'Is required';
          validations.push(CustomValidators.required(validation));
        }
        if (i.validations.equalToLength) {
          const validation = i.validations.equalToLength;

          if (typeof validation === 'number') {
            validations.push(CustomValidators.equalToLength(validation));
          } else if (Array.isArray(validation)) {
            validations.push(CustomValidators.equalToLength(validation[0] as number, validation[1] as string));
          } else if (typeof validation === 'object' && validation.length) {
            validations.push(CustomValidators.equalToLength(validation.length, validation.errorMessage));
          }
        }

        if (i.validations.maxLength) {
          validations.push(Validators.maxLength(i.validations.maxLength));
        }

        itemControl.setValidators(validations);
        itemControl.updateValueAndValidity();
      }
    });
  }

  trackByItem(index: number, item: InnovationRecordItemType): string {
    return item.id ?? String(index);
  }

  shouldShowItem(itemConditions: ItemConditionOptionsType): boolean {
    return FormEngineHelperV3.shouldShowItem(itemConditions, this.relatedAnswers!);
  }

  getLabel(item: InnovationRecordItemType): string {
    if (!item.itemConditionOptions) {
      return '';
    } else {
      return FormEngineHelperV3.isItemOptional(item.itemConditionOptions, this.relatedAnswers!)
        ? `${item.label} (Optional)`
        : `${item.label}`;
    }
  }
}
