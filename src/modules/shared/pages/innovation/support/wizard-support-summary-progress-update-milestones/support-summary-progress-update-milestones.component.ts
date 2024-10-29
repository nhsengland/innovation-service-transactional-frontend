import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { DatesHelper } from '@app/base/helpers';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';
import { FileUploadService } from '@modules/shared/services/file-upload.service';
import { CreateSupportSummaryProgressUpdateType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { omit } from 'lodash';
import { switchMap } from 'rxjs/operators';
import { SUPPORT_SUMMARY_MILESTONES } from './constants';
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

  constructor(
    private innovationsService: InnovationsService,
    private fileUploadService: FileUploadService
  ) {
    super();

    this.innovation = this.ctx.innovation.info();

    this.userOrgAcronym = this.stores.authentication.getUserContextInfo()?.organisation?.acronym!;

    this.milestonesType = SUPPORT_SUMMARY_MILESTONES[this.userOrgAcronym].some(org => org.subcategories !== undefined)
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
      }
    };
  }

  ngOnInit(): void {
    // Set wizard steps
    this.wizard.addStep(
      new WizardStepModel<CategoriesStepInputType, CategoriesStepOutputType>({
        id: 'categoriesStep',
        title: 'Add a progress update',
        component: WizardInnovationSupportSummaryProgressUpdateMilestonesCategoriesStepComponent,
        data: {
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
          selectedCategories: [],
          otherCategory: null,
          selectedSubcategories: [],
          description: '',
          file: null,
          fileName: ''
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
          day: '',
          month: '',
          year: ''
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
          date: ''
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
    return SUPPORT_SUMMARY_MILESTONES[this.userOrgAcronym].map(org => {
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
      SUPPORT_SUMMARY_MILESTONES[this.userOrgAcronym].find(
        org => org.name === this.wizard.data.categoriesStep.categories[0]?.name
      )?.subcategories ?? []
    );
  }

  // Steps mappings.
  onCategoriesStepIn(): void {
    this.wizard.setStepData<CategoriesStepInputType>('categoriesStep', {
      milestonesType: this.milestonesType,
      categories: this.getOrgCategories(),
      otherCategory: this.wizard.data.categoriesStep.otherCategory,
      selectedCategories: this.wizard.data.categoriesStep.categories
    });
  }

  onCategoriesStepOut(stepData: WizardStepEventType<CategoriesStepOutputType>): void {
    // If two level milestones and the accessor selected a different category, clean selected subcategories
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

    // If two level milestones, check if selected category has subcategories and if we need to add the subcategory step
    if (this.milestonesType === 'TWO_LEVEL') {
      this.manageSubcategoriesStep();
    }
  }

  onSubcategoriesStepIn(): void {
    this.wizard.setStepData<SubcategoriesStepInputType>('subcategoriesStep', {
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
      date: DatesHelper.getDateString(
        this.wizard.data.dateStep.year,
        this.wizard.data.dateStep.month,
        this.wizard.data.dateStep.day
      )
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
    this.onSubmitWizard();
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

    const nextStepNumber = this.wizard.steps.findIndex(step => step.id === stepId) + 1;

    if (nextStepNumber === undefined) {
      return;
    }

    this.wizard.gotoStep(nextStepNumber);
  }

  manageSubcategoriesStep(): void {
    const categorySubcategories = this.getCategorySubcategories();

    // If selected category has subcategories, add subcategory step as second step, otherwise remove subcategory step
    if (categorySubcategories.length) {
      this.wizard.addStep(
        new WizardStepModel<SubcategoriesStepInputType, SubcategoriesStepOutputType>({
          id: 'subcategoriesStep',
          title: '',
          component: WizardInnovationSupportSummaryProgressUpdateMilestonesSubcategoriesStepComponent,
          data: {
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

  onSubmitWizard(): void {
    this.setPageStatus('LOADING');

    const initialData = {
      description: this.wizard.data.descriptionStep.description,
      createdAt: DatesHelper.setCurrentTimeToDate(
        new Date(+this.wizard.data.dateStep.year, +this.wizard.data.dateStep.month - 1, +this.wizard.data.dateStep.day)
      ).toISOString()
    };

    // Get the selected categories name's
    const categories = this.wizard.data.categoriesStep.categories
      .filter(category => category.name !== 'OTHER')
      .map(category => category.name);

    // If other category was selected, push the given name to categories
    const otherCategory = this.wizard.data.categoriesStep.otherCategory;
    if (otherCategory) {
      categories.push(otherCategory);
    }

    // Create the body for the request according to milestones type
    let body: CreateSupportSummaryProgressUpdateType =
      this.milestonesType === 'ONE_LEVEL'
        ? { ...initialData, categories }
        : {
            ...initialData,
            category: categories[0],
            subCategories: this.wizard.data.subcategoriesStep.subcategories.map(subcategory => subcategory.name)
          };

    // If a file was provided, upload it and create a support summary progress update, otherwise, only create a support summary progress update
    const file = this.wizard.data.descriptionStep.file;
    if (file) {
      const httpUploadBody = { userId: this.stores.authentication.getUserId(), innovationId: this.innovation.id };

      this.fileUploadService
        .uploadFile(httpUploadBody, file)
        .pipe(
          switchMap(response => {
            const fileData = omit(response, 'url');

            body = {
              ...body,
              document: {
                name: this.wizard.data.descriptionStep.fileName,
                file: fileData
              }
            };

            return this.innovationsService.createSupportSummaryProgressUpdate(this.innovation.id, body);
          })
        )
        .subscribe({
          next: () => this.onSubmitWizardSuccess(),
          error: () => this.onSubmitWizardError()
        });
    } else {
      this.createSupportSummaryProgressUpdate(body);
    }
  }

  createSupportSummaryProgressUpdate(body: CreateSupportSummaryProgressUpdateType): void {
    this.innovationsService.createSupportSummaryProgressUpdate(this.innovation.id, body).subscribe({
      next: () => this.onSubmitWizardSuccess(),
      error: () => this.onSubmitWizardError()
    });
  }

  onSubmitWizardSuccess(): void {
    this.setRedirectAlertSuccess('Your progress update has been added to the support summary', {
      message: 'The innovator has been notified about your update.'
    });
    this.redirectToSupportSummaryList();
  }

  onSubmitWizardError(): void {
    this.setAlertUnknownError();
    this.setPageStatus('READY');
  }

  private redirectToSupportSummaryList(): void {
    this.redirectTo(
      `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/support-summary`
    );
  }
}
