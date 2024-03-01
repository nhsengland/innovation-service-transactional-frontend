import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { SubcategoriesStepInputType, SubcategoriesStepOutputType } from './subcategories-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-milestones-subcategories-step',
  templateUrl: './subcategories-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateMilestonesSubcategoriesStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SubcategoriesStepInputType, SubcategoriesStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: SubcategoriesStepInputType = {
    subcategories: [],
    selectedCategories: [],
    selectedSubcategories: []
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<SubcategoriesStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<SubcategoriesStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<SubcategoriesStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<SubcategoriesStepOutputType>>();

  form = new FormGroup(
    {
      subcategories: new FormArray<FormControl<string>>([], {
        validators: CustomValidators.requiredCheckboxArray('Choose at least one subcategory'),
        updateOn: 'change'
      })
    },
    { updateOn: 'blur' }
  );

  subcategoriesItems: Required<FormEngineParameterModel>['items'] = [];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.title = `You have selected the ${this.data.selectedCategories[0]} category`;
    this.setPageTitle(this.title);

    this.subcategoriesItems.push(
      { value: 'Select one or more subcategories', label: 'HEADING' },
      ...this.data.subcategories.map(subcategory => ({
        value: subcategory.name,
        label: subcategory.name,
        description: subcategory.description
      }))
    );

    this.data.selectedSubcategories.forEach(item => {
      (this.form.get('subcategories') as FormArray).push(new FormControl<string>(item));
    });

    this.setPageStatus('READY');
  }

  prepareOutputData(): SubcategoriesStepOutputType {
    return {
      subcategories: this.form.value.subcategories ?? []
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
