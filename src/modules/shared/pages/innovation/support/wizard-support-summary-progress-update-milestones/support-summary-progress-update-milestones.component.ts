import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';
import { SUPPORT_SUMMARY_MILESTONES_ARRAYS } from './constants';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesCategoriesStepComponent } from './steps/categories-step.component';
import { CategoriesStepInputType, CategoriesStepOutputType } from './steps/categories-step.types';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesDateStepComponent } from './steps/date-step.component';
import { DateStepInputType, DateStepOutputType } from './steps/date-step.types';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesDescriptionStepComponent } from './steps/description-step.component';
import { DescriptionStepInputType, DescriptionStepOutputType } from './steps/description-step.types';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesSubcategoriesStepComponent } from './steps/subcategories-step.component';
import { SubcategoriesStepInputType, SubcategoriesStepOutputType } from './steps/subcategories-step.types';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesSummaryStepComponent } from './steps/summary-step.component';
import { SummaryStepInputType } from './steps/summary-step.types';

type MilestoneData = {
  categoriesStep: {
    categories: { name: string; description: string }[];
    otherCategory: string | null;
  };
  subcategoriesStep: {
    subcategories: { name: string; description: string }[];
  };
  descriptionStep: {
    description: string;
    file: null | File;
    fileName: string;
  };
  dateStep: {
    day: string;
    month: string;
    year: string;
  };
};

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-milestones',
  templateUrl: './support-summary-progress-update-milestones.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateMilestonesComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  milestonesType: 'ONE_LEVEL' | 'TWO_LEVEL';

  userOrgAcronym;

  wizard = new WizardModel<MilestoneData>({});

  constructor() {
    super();

    this.innovation = this.stores.context.getInnovation();

    this.userOrgAcronym = this.stores.authentication.getUserContextInfo()?.organisation?.acronym!;

    this.milestonesType = SUPPORT_SUMMARY_MILESTONES_ARRAYS[this.userOrgAcronym].some(
      org => org.subcategories !== undefined
    )
      ? 'TWO_LEVEL'
      : 'ONE_LEVEL';

    this.wizard.data = {
      categoriesStep: {
        categories: [],
        otherCategory: null
      },
      subcategoriesStep: {
        subcategories: []
      },
      descriptionStep: {
        description: '',
        file: null,
        fileName: ''
      },
      dateStep: {
        day: '',
        month: '',
        year: ''
        //dateISOString: '',
      }
    };
  }

  ngOnInit(): void {
    this.wizard.addStep(
      new WizardStepModel<CategoriesStepInputType, CategoriesStepOutputType>({
        id: 'categoriesStep',
        title: 'Add a progress update',
        component: WizardInnovationSupportSummaryProgressUpdateMilestonesCategoriesStepComponent,
        data: {
          userOrgAcronym: this.userOrgAcronym,
          milestonesType: this.milestonesType,
          categories: this.getOrgCategories(),
          otherCategory: null,
          selectedCategories: []
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data),
          nextStepEvent: data =>
            this.onNextStep(data, this.onCategoriesStepOut, this.onSubcategoriesStepIn, this.onDescriptionStepIn)
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<DescriptionStepInputType, DescriptionStepOutputType>({
        id: 'descriptionStep',
        title: `Add a description to your progress update`,
        component: WizardInnovationSupportSummaryProgressUpdateMilestonesDescriptionStepComponent,
        data: {
          selectedCategories: this.wizard.data.categoriesStep.categories,
          otherCategory: this.wizard.data.categoriesStep.otherCategory,
          selectedSubcategories: this.wizard.data.subcategoriesStep.subcategories,
          description: this.wizard.data.descriptionStep.description,
          file: this.wizard.data.descriptionStep.file,
          fileName: this.wizard.data.descriptionStep.fileName
        },
        outputs: {
          previousStepEvent: data =>
            this.onPreviousStep(data, this.onDescriptionStepOut, this.onSubcategoriesStepIn, this.onCategoriesStepIn),
          nextStepEvent: data => this.onNextStep(data, this.onDescriptionStepOut, this.onDateStepIn)
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<DateStepInputType, DateStepOutputType>({
        id: 'dateStep',
        title: `Select a date for this progress update`,
        component: WizardInnovationSupportSummaryProgressUpdateMilestonesDateStepComponent,
        data: {
          day: this.wizard.data.dateStep.day,
          month: this.wizard.data.dateStep.month,
          year: this.wizard.data.dateStep.year
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onDateStepOut, this.onDescriptionStepIn),
          nextStepEvent: data => this.onNextStep(data, this.onDateStepOut, this.onSummaryStepIn)
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<SummaryStepInputType, null>({
        id: 'summaryStep',
        title: `Check your progress update`,
        component: WizardInnovationSupportSummaryProgressUpdateMilestonesSummaryStepComponent,
        data: {
          categoriesStep: this.wizard.data.categoriesStep,
          subcategoriesStep: this.wizard.data.subcategoriesStep,
          descriptionStep: this.wizard.data.descriptionStep,
          dateStep: this.wizard.data.dateStep
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onDateStepIn),
          submitEvent: data => this.onSubmit(data),
          goToStepEvent: stepId => this.onGoToStep(stepId)
        }
      })
    );

    this.setPageStatus('READY');
  }

  getOrgCategories(): {
    name: string;
    description: string;
  }[] {
    return SUPPORT_SUMMARY_MILESTONES_ARRAYS[this.userOrgAcronym].map(org => {
      return {
        name: org.name,
        description: org.description
      };
    });
  }

  getCategorySubcategories(): {
    name: string;
    description: string;
  }[] {
    return (
      SUPPORT_SUMMARY_MILESTONES_ARRAYS[this.userOrgAcronym].filter(
        org => org.name === this.wizard.data.categoriesStep.categories[0]?.name
      )[0]?.subcategories ?? []
    );
  }

  // Steps mappings.
  onCategoriesStepIn(): void {
    this.wizard.setStepData<CategoriesStepInputType>('categoriesStep', {
      userOrgAcronym: this.userOrgAcronym,
      milestonesType: this.milestonesType,
      categories: this.getOrgCategories(),
      otherCategory: this.wizard.data.categoriesStep.otherCategory,
      selectedCategories: this.wizard.data.categoriesStep.categories
    });
  }

  onCategoriesStepOut(stepData: WizardStepEventType<CategoriesStepOutputType>): void {
    if (
      this.milestonesType === 'TWO_LEVEL' &&
      stepData.data.categories[0].name !== this.wizard.data.categoriesStep.categories[0]?.name
    ) {
      this.wizard.data.subcategoriesStep.subcategories = [];
    }

    this.wizard.data.categoriesStep = {
      categories: stepData.data.categories,
      otherCategory: stepData.data.otherCategory
    };

    if (this.milestonesType === 'TWO_LEVEL') {
      this.manageSubcategoriesStep();
    }
  }

  onSubcategoriesStepIn(): void {
    this.wizard.setStepData<SubcategoriesStepInputType>('subcategoriesStep', {
      userOrgAcronym: this.userOrgAcronym,
      subcategories: this.getCategorySubcategories(),
      selectedCategories: this.wizard.data.categoriesStep.categories,
      selectedSubcategories: this.wizard.data.subcategoriesStep.subcategories
    });
  }

  onSubcategoriesStepOut(stepData: WizardStepEventType<SubcategoriesStepOutputType>): void {
    this.wizard.data.subcategoriesStep = {
      subcategories: stepData.data.subcategories
    };
  }

  onDescriptionStepIn(): void {
    this.wizard.setStepData<DescriptionStepInputType>('descriptionStep', {
      selectedCategories: this.wizard.data.categoriesStep.categories,
      otherCategory: this.wizard.data.categoriesStep.otherCategory,
      selectedSubcategories: this.wizard.data.subcategoriesStep.subcategories,
      description: this.wizard.data.descriptionStep.description,
      file: this.wizard.data.descriptionStep.file,
      fileName: this.wizard.data.descriptionStep.fileName
    });
  }

  onDescriptionStepOut(stepData: WizardStepEventType<DescriptionStepOutputType>): void {
    this.wizard.data.descriptionStep = {
      description: stepData.data.description,
      file: stepData.data.file,
      fileName: stepData.data.fileName
    };
  }

  onDateStepIn(): void {
    this.wizard.setStepData<DateStepInputType>('dateStep', {
      day: this.wizard.data.dateStep.day,
      month: this.wizard.data.dateStep.month,
      year: this.wizard.data.dateStep.year
    });
  }

  onDateStepOut(stepData: WizardStepEventType<DateStepOutputType>): void {
    this.wizard.data.dateStep = {
      day: stepData.data.day,
      month: stepData.data.month,
      year: stepData.data.year
    };
  }

  onSummaryStepIn(): void {
    this.wizard.setStepData<SummaryStepInputType>('summaryStep', {
      categoriesStep: this.wizard.data.categoriesStep,
      subcategoriesStep: this.wizard.data.subcategoriesStep,
      descriptionStep: this.wizard.data.descriptionStep,
      dateStep: this.wizard.data.dateStep
    });
  }

  onPreviousStep<T extends WizardStepEventType<MappedObjectType | null>>(
    stepData: T,
    ...args: ((data: T) => void)[]
  ): void {
    this.resetAlert();

    if (this.wizard.currentStepNumber() === 1) {
      this.redirectToSupportSummaryList();
      return;
    }

    args.forEach(element => element.bind(this)(stepData));
    this.wizard.gotoPreviousStep();
  }

  onNextStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));

    this.wizard.gotoNextStep();
  }

  onSubmit<T extends WizardStepEventType<MappedObjectType | null>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));
    this.onWizardSubmit();
  }

  onGoToStep(stepId: string): void {
    switch (stepId) {
      case 'categoriesStep':
        this.onCategoriesStepIn();
        break;
      case 'subcategoriesStep':
        this.onSubcategoriesStepIn();
        break;
      case 'descriptionStep':
        this.onDescriptionStepIn();
        break;
      case 'dateStep':
        this.onDateStepIn();
        break;
      default:
        return;
    }

    const stepNumber = this.wizard.steps.findIndex(step => step.id === stepId) + 1;

    if (stepNumber === undefined) {
      return;
    }

    this.wizard.gotoStep(stepNumber);
  }

  manageSubcategoriesStep(): void {
    const categorySubcategories = this.getCategorySubcategories();

    if (categorySubcategories.length) {
      this.wizard.addStep(
        new WizardStepModel<SubcategoriesStepInputType, SubcategoriesStepOutputType>({
          id: 'subcategoriesStep',
          title: '',
          component: WizardInnovationSupportSummaryProgressUpdateMilestonesSubcategoriesStepComponent,
          data: {
            userOrgAcronym: this.userOrgAcronym,
            subcategories: categorySubcategories,
            selectedCategories: this.wizard.data.categoriesStep.categories,
            selectedSubcategories: this.wizard.data.subcategoriesStep.subcategories
          },
          outputs: {
            previousStepEvent: data => this.onPreviousStep(data, this.onSubcategoriesStepOut, this.onCategoriesStepIn),
            nextStepEvent: data => this.onNextStep(data, this.onSubcategoriesStepOut, this.onDescriptionStepIn)
          }
        }),
        1
      );
    } else {
      this.wizard.removeStep('subcategoriesStep');
    }
  }

  onWizardSubmit(): void {
    console.log('onWizardSubmit');
  }

  private redirectToSupportSummaryList(): void {
    this.redirectTo(
      `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/support-summary`
    );
  }
}
