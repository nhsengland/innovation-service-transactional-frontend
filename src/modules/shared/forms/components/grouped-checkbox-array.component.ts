import { Component, Input, OnInit, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, Injector, OnChanges } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormControl } from '@angular/forms';

import { RandomGeneratorHelper } from '@modules/core';

import { FormEngineHelper } from '../engine/helpers/form-engine.helper';

import { FormEngineParameterModel } from '../engine/models/form-engine.models';

/*
 In before any rant about implementing both DoCheck and OnChanges:

 The linter is incorrect.

 The documentation _used_ to state that DoCheck would override OnChanges, hence not recommended to implement
 both.

 This is not correct and the Angular docs have been updated to reflect this:

 https://github.com/angular/angular/commit/3a62023260e59dafcb57ec12c3be1e3643639347

 So, making it perfectly viable and normal to implement both DoCheck and OnChanges. On extends the other.
 The latter is required to check for changes on the bound inputs.
 This is needed on this component because `groupedItems` are asyncronously fed by the parent component.
 Before, the logic on this input was being done on ngOnInit. This led to a race condition. If the parent resolved
 the groupedItems first, then all would be fine. However, if ngOnInit on this component was executed before the inputs
 were resolved, then nothing would be rendered. This forced the user to hit F5 on the browser. When F5 is hit, the resolved
 promise is cached, so when ngOnInit on this component is executed, the groupedItems are available and everything works as expected.

 I have changed this logic to the ngOnChanges hook so that when the groupedItems are _resolved_ on the parent,
 the changes are reflected on this component.

 It would be a good idea to go through this solution and assess if other similar cases exist.

 Thanks, <3
*/

@Component({
  selector: 'theme-form-grouped-checkbox-array',
  templateUrl: './grouped-checkbox-array.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupedCheckboxArrayComponent implements OnInit, DoCheck, OnChanges {

  @Input() id?: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() groupedItems: FormEngineParameterModel['groupedItems'] = [];

  hasError = false;
  errorMessage = '';

  filteredGI: {
    gItem: { value: string; label: string; description?: string; items: { value: string; label: string; description?: string; }[]; };
    selectedChildren: number;
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
  }[] = [];


  // Return parent FormGroup (or FormArray) instance.
  get parentFieldControl(): AbstractControl | null { return this.injector.get(ControlContainer).control; }
  get fieldArrayControl(): FormArray { return this.parentFieldControl?.get(this.arrayName) as FormArray; }
  get fieldArrayValues(): string[] { return this.fieldArrayControl.value as string[]; }


  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.id = this.id || RandomGeneratorHelper.generateRandom();
  }

  ngOnChanges(): void {

    // If Group Item has only one child item, then show the child only.

    this.filteredGI = (this.groupedItems || []).map(groupItem => {
      if (groupItem.items.length === 1) {
        return { gItem: { ...groupItem.items[0], ...{ items: [] } }, showHideStatus: 'hidden', showHideText: null, selectedChildren: 0 };
      } else {
        return { gItem: groupItem, showHideStatus: 'closed', showHideText: `Show ${groupItem.items.length} units`, selectedChildren: groupItem.items.filter(a => this.fieldArrayValues.includes(a.value)).length };
      }
    });

  }

  ngDoCheck(): void {

    this.hasError = (this.fieldArrayControl.invalid && (this.fieldArrayControl.touched || this.fieldArrayControl.dirty));
    this.errorMessage = this.hasError ? FormEngineHelper.getValidationMessage(this.fieldArrayControl.errors) : '';

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
        break;
      case 'closed':
        filteredGI.showHideStatus = 'opened';
        filteredGI.showHideText = `Hide ${filteredGI.gItem.items.length} units`;
        break;
      default:
        break;
    }

  }


  onChanged(e: Event): void {

    const event = e.target as HTMLInputElement;

    const filteredGI = this.filteredGI.find(i => i.gItem.value === event.value);
    if (filteredGI) { // Is a FIRST level item.

      if (filteredGI.gItem.items.length > 0) {  // ... and it has childrens.

        filteredGI.gItem.items.forEach(item => {
          this.checkUncheckCheckbox(item.value, event.checked);
        });

        filteredGI.selectedChildren = filteredGI.gItem.items.filter(a => this.fieldArrayValues.includes(a.value)).length;

        if (filteredGI.selectedChildren === 0) {
          event.checked = false;
        }

      } else { // Is a first level item without childrens.

        this.checkUncheckCheckbox(event.value, event.checked);

      }

    } else { // Is a SECOND level item.

      this.checkUncheckCheckbox(event.value, event.checked);

      const parentFilteredGI = this.filteredGI.find(gi => gi.gItem.items.find(i => i.value === event.value));
      if (parentFilteredGI) {
        parentFilteredGI.selectedChildren = parentFilteredGI.gItem.items.filter(a => this.fieldArrayValues.includes(a.value)).length;
        (document.getElementById(`${this.id}${parentFilteredGI?.gItem.value}`) as HTMLInputElement).checked = parentFilteredGI.selectedChildren > 0;
      }

    }

  }


}
