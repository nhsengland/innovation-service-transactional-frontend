import {
  Component,
  Input,
  OnInit,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector
} from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { FormEngineHelperV3 } from '../engine/helpers/form-engine-v3.helper';
import { FormEngineParameterModelV3 } from '../engine/models/form-engine.models';
import { InnovationRecordStepValidationsType, ItemConditionOptionsType } from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';

export type InnovationRecordItemType = {
  id?: string;
  label?: string;
  description?: string;
  exclusive?: boolean;
  conditional?: FormEngineParameterModelV3;
  group?: string;
  type?: string;
  itemsFromAnswer?: string;
  itemConditionOptions?: {
    relativeToId?: string;
    forceExpandAndDisableToggleIf?: string[];
    displayIf?: string[];
  };
  validations?: InnovationRecordStepValidationsType
};



@Component({
  selector: 'theme-form-input-array-v3',
  templateUrl: './input-array.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormInputArrayV3Component implements OnInit, DoCheck {
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
  @Input() createdFromParentAnswerId?: undefined | string = undefined

  itemHasErrorMap: Record<string, boolean> = {};
  itemErrorMap: Record<string, { message: string; params: Record<string, string> }> = {};

  inputCssClass = '';
  divCssOverride = '';

  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }

  get fieldGroupControl(): FormGroup {
    return this.parentFieldControl?.get(this.groupName) as FormGroup;
  }

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();
    this.placeholder = this.placeholder || '';
    this.inputCssClass = this.width ? `nhsuk-u-width-${this.width}` : 'nhsuk-u-width-two-thirds';
    this.divCssOverride = this.cssOverride || '';

    console.log('id:', this.id)
    console.log('items:', this.items)
    console.log('groupName:', this.groupName)
    console.log('createdFromParentAnswerId:', this.createdFromParentAnswerId)

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

  hasError(itemId?: string): boolean {
    if (!itemId) return false;
    return this.itemHasErrorMap[itemId] ?? false;
  }

  getError(itemId?: string): { message: string; params: Record<string, string> } {
    if (!itemId) return { message: '', params: {} };
    return this.itemErrorMap[itemId] ?? { message: '', params: {} };
  }

  getAriaDescribedBy(item: InnovationRecordItemType): string | null {
    let s = '';

    if (item.description) {
      s += `hint-${item.id}`;
    }

    if (this.hasError(item.id)) {
      s += `${s ? ' ' : ''}error-${item.id}`;
    }

    return s || null;
  }

  trackByItem(index: number, item: InnovationRecordItemType): string {
    return item.id ?? String(index);
  }

  shouldShowItem(itemConditions:ItemConditionOptionsType): boolean{
    if(this.createdFromParentAnswerId){
      return itemConditions.displayIf?.includes(this.createdFromParentAnswerId) ?? false
    }
    return false
  }

  isItemOptional(itemConditions:ItemConditionOptionsType):boolean{
    if(this.createdFromParentAnswerId){
      return !itemConditions.mandatoryIf?.includes(this.createdFromParentAnswerId)
    }
    return false
  }
}