import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel, FormGroup } from '@app/base/forms';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';

import { CategoriesStepInputType, CategoriesStepOutputType } from './categories-step.types';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-milestones-categories-step',
  templateUrl: './categories-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateMilestonesCategoriesStepComponent
  extends CoreComponent
  implements WizardStepComponentType<CategoriesStepInputType, CategoriesStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: CategoriesStepInputType = {
    milestonesType: 'ONE_LEVEL',
    categories: [],
    otherCategory: null,
    selectedCategories: []
  };

  form: FormGroup<{
    oneLevelMilestoneCategories?: FormArray<FormControl<string>>;
    twoLevelMilestoneCategory?: FormControl<string | null>;
    otherCategory: FormControl<string | null>;
  }> = new FormGroup({ otherCategory: new FormControl<string>('') });

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<CategoriesStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<CategoriesStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<CategoriesStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<CategoriesStepOutputType>>();

  categoriesItems: Required<FormEngineParameterModel>['items'] = [];

  constructor() {
    super();

    this.setPageTitle(this.title);
    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    console.log('milestonesType', this.data.milestonesType);
    console.log('categories', this.data.categories);
    console.log('selectedCategories', this.data.selectedCategories);

    this.categoriesItems.push(
      ...this.data.categories.map(category => ({
        value: category.name,
        label: category.name,
        description: category.description
      })),
      {
        value: 'OTHER',
        label: 'Other',
        conditional: new FormEngineParameterModel({
          id: 'otherCategory',
          dataType: 'text',
          label: 'Enter a title with a maximum of 100 characters',
          validations: { isRequired: [true, 'Category name is required'], maxLength: 100 }
        })
      }
    );

    if (this.data.milestonesType === 'ONE_LEVEL') {
      this.form.addControl(
        'oneLevelMilestoneCategories',
        new FormArray<FormControl<string>>([], {
          validators: CustomValidators.requiredCheckboxArray('Choose at least one category'),
          updateOn: 'change'
        })
      );

      this.categoriesItems.unshift({ value: 'Select one or more progress categories', label: 'HEADING' });

      this.data.selectedCategories.forEach(item => {
        (this.form.get('oneLevelMilestoneCategories') as FormArray).push(new FormControl<string>(item));
      });
    } else {
      this.form.addControl(
        'twoLevelMilestoneCategory',
        new FormControl<null | string>(null, {
          validators: CustomValidators.required('Select one progress category'),
          updateOn: 'change'
        })
      );

      if (this.data.selectedCategories[0]) {
        this.form.get('twoLevelMilestoneCategory')?.setValue(this.data.selectedCategories[0]);
      }
    }

    this.form.get('otherCategory')?.setValue(this.data.otherCategory);

    this.setPageStatus('READY');
  }

  prepareOutputData(): CategoriesStepOutputType {
    let categories: string[] = [];
    if (this.data.milestonesType === 'ONE_LEVEL') {
      categories = [
        ...(this.form.value.oneLevelMilestoneCategories ? this.form.value.oneLevelMilestoneCategories : [])
      ];
    } else {
      categories = [...(this.form.value.twoLevelMilestoneCategory ? [this.form.value.twoLevelMilestoneCategory] : [])];
    }

    return { categories, otherCategory: this.form.value.otherCategory ?? null };
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
