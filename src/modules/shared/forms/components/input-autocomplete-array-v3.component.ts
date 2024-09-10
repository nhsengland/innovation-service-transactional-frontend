/* istanbul ignore file */
// TODO: create tests.

import { Component, Input, OnInit, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';
import { UtilsHelper } from '@modules/core/helpers/utils.helper';

import { FormEngineHelperV3 } from '../engine/helpers/form-engine-v3.helper';

import { FormEngineParameterModelV3 } from '../engine/models/form-engine.models';

@Component({
  selector: 'theme-form-input-autocomplete-array-v3',
  templateUrl: './input-autocomplete-array-v3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormInputAutocompleteArrayV3Component implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() items: FormEngineParameterModelV3['items'] = [];
  @Input() pageUniqueField = true;

  searchableItems: { id: string; label: string; isVisible: boolean }[] = [];
  chosenItems: { id: string; label: string }[] = [];
  filteredItems$: Observable<{ id: string; label: string }[]> = of([]);

  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }

  get fieldArrayControl(): FormArray {
    return this.parentFieldControl?.get(this.arrayName) as FormArray;
  }

  searchFieldControl = new FormControl('');

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  private _filter(value: null | string): { id: string; label: string }[] {
    value = value ?? '';

    if (value.length < 2) {
      return [];
    }

    const filteredValues = UtilsHelper.arrayFullTextSearch(
      this.searchableItems.filter(item => item.isVisible).map(i => i.label),
      value
    );
    return (this.items ?? [])
      .filter(i => filteredValues.includes(i.label ?? ''))
      .map(item => ({ id: item.id!, label: item.label! }));
  }

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();

    this.searchableItems = (this.items || []).map(item => ({
      id: item.id ?? '',
      label: item.label ?? '',
      isVisible: !this.fieldArrayControl.value.includes(item.id)
    }));

    this.chosenItems = (this.fieldArrayControl.value as string[]).map(value => ({
      id: value,
      label: this.searchableItems.find(item => item.id === value)?.label || ''
    }));

    this.filteredItems$ = this.searchFieldControl.valueChanges.pipe(map(value => this._filter(value)));
  }

  ngDoCheck(): void {
    this.hasError = this.fieldArrayControl.invalid && (this.fieldArrayControl.touched || this.fieldArrayControl.dirty);
    this.error = this.hasError
      ? FormEngineHelperV3.getValidationMessage(this.fieldArrayControl.errors)
      : { message: '', params: {} };
    this.cdr.detectChanges();
  }

  onAddItem(event: MatAutocompleteSelectedEvent): void {
    const eventValue = event.option.value;
    const searchableItemsItem = this.searchableItems.find(item => item.label === eventValue);

    if (searchableItemsItem) {
      this.fieldArrayControl.push(new FormControl(searchableItemsItem.id));
      searchableItemsItem.isVisible = false;
      this.chosenItems.push({ id: searchableItemsItem.id, label: searchableItemsItem.label });
      this.searchFieldControl.setValue('');
    }

    this.cdr.detectChanges();
  }

  onRemoveItem(value: string): void {
    // Handle selected items array.
    const fieldControlIndex = this.fieldArrayControl.controls.findIndex(item => item.value === value);
    if (fieldControlIndex > -1) {
      this.fieldArrayControl.removeAt(fieldControlIndex);
    }
    // Handle chosen items array.
    const chosenItemsIndex = this.chosenItems.findIndex(item => item.id === value);
    if (chosenItemsIndex > -1) {
      this.chosenItems.splice(chosenItemsIndex, 1);
    }
    // Handle searchable items array.
    const searchableItemsItem = this.searchableItems.find(item => item.id === value);
    if (searchableItemsItem) {
      searchableItemsItem.isVisible = true;
    } else {
      console.log('Error when removing item.');
    }

    this.searchFieldControl.setValue('');
  }
}
