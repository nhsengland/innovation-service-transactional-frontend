import { Component, Input, OnInit, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormControl } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

import { FormEngineParameterModel } from '../engine/models/form-engine.models';

@Component({
  selector: 'theme-form-grouped-checkbox-array',
  templateUrl: './grouped-checkbox-array.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupedCheckboxArrayComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() set groupedItems(value: FormEngineParameterModel['groupedItems']) {
    // If Group Item has only one child item, then show the child only.
    this.filteredGI = (value || []).map(groupItem => {
      if (groupItem.items.length === 1) {
        return {
          gItem: {
            // TODO:
            // When there's only one child, this is overriding the parente with the child information.
            // It's NOT this component responsibility to do this!
            // Change this behavior when possible.
            ...groupItem.items[0],
            label: groupItem.label,
            items: []
          },
          showHideStatus: 'hidden',
          showHideText: null,
          showHideDescription: null,
          selectedChildren: 0
        };
      } else {
        return {
          gItem: groupItem,
          showHideStatus: 'closed',
          showHideText: `Show ${groupItem.items.length} units`,
          showHideDescription: `that belong to the ${groupItem.label}`,
          selectedChildren: groupItem.items.filter(a => this.fieldArrayValues.includes(a.value)).length
        };
      }
    });
  }
  @Input() pageUniqueField? = true;

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  filteredGI: {
    gItem: {
      value: string;
      label: string;
      description?: string;
      isEditable?: boolean;
      items: { value: string; label: string; description?: string; isEditable?: boolean }[];
    };
    selectedChildren: number;
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  get fieldArrayControl(): FormArray {
    return this.parentFieldControl?.get(this.arrayName) as FormArray;
  }
  get fieldArrayValues(): string[] {
    return this.fieldArrayControl.value as string[];
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
  }

  ngDoCheck(): void {
    this.hasError = this.fieldArrayControl.invalid && (this.fieldArrayControl.touched || this.fieldArrayControl.dirty);
    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldArrayControl.errors)
      : { message: '', params: {} };

    this.cdr.detectChanges();
  }

  private checkUncheckCheckbox(value: string, checked: boolean): void {
    const valueIndex = this.fieldArrayValues.indexOf(value);

    if (checked && valueIndex === -1) {
      this.fieldArrayControl.push(new FormControl(value));
    }

    if (!checked && valueIndex > -1) {
      this.fieldArrayControl.removeAt(valueIndex);
    }
  }

  isChecked(value: string): boolean {
    return this.fieldArrayValues.includes(value);
  }

  onShowHideClicked(value: string): void {
    const filteredGI = this.filteredGI.find(i => i.gItem.value === value);

    switch (filteredGI?.showHideStatus) {
      case 'opened':
        filteredGI.showHideStatus = 'closed';
        filteredGI.showHideText = `Show ${filteredGI.gItem.items.length} units`;
        filteredGI.showHideDescription = `that belong to the ${filteredGI.gItem.label}`;
        break;
      case 'closed':
        filteredGI.showHideStatus = 'opened';
        filteredGI.showHideText = `Hide ${filteredGI.gItem.items.length} units`;
        filteredGI.showHideDescription = `that belong to the ${filteredGI.gItem.label}`;
        break;
      default:
        break;
    }
  }

  onChanged(e: Event): void {
    const event = e.target as HTMLInputElement;

    const filteredGI = this.filteredGI.find(i => i.gItem.value === event.value);
    if (filteredGI) {
      // Is a FIRST level item.

      if (filteredGI.gItem.items.length > 0) {
        // ... and it has childrens.

        filteredGI.gItem.items
          .filter(i => i.isEditable === undefined || i.isEditable)
          .forEach(item => {
            this.checkUncheckCheckbox(item.value, event.checked);
          });

        filteredGI.selectedChildren = filteredGI.gItem.items.filter(a =>
          this.fieldArrayValues.includes(a.value)
        ).length;

        if (filteredGI.selectedChildren === 0) {
          event.checked = false;
        }
      } else {
        // Is a first level item without childrens.

        this.checkUncheckCheckbox(event.value, event.checked);
      }
    } else {
      // Is a SECOND level item.

      this.checkUncheckCheckbox(event.value, event.checked);

      const parentFilteredGI = this.filteredGI.find(gi => gi.gItem.items.find(i => i.value === event.value));
      if (parentFilteredGI) {
        parentFilteredGI.selectedChildren = parentFilteredGI.gItem.items.filter(a =>
          this.fieldArrayValues.includes(a.value)
        ).length;
        (document.getElementById(`${this.id}${parentFilteredGI?.gItem.value}`) as HTMLInputElement).checked =
          parentFilteredGI.selectedChildren > 0;
      }
    }
  }
}
