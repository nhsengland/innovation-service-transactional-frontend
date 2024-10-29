import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { DatesHelper } from '@app/base/helpers';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { FileUploadType } from '@app/base/forms';
import { TitleStepInputType, TitleStepOutputType } from './steps/title-step.types';
import { DescriptionStepInputType, DescriptionStepOutputType } from './steps/description-step.types';
import { AddDocumentStepInputType, AddDocumentStepOutputType } from './steps/add-document-step.types';
import {
  DateStepInputType,
  DateStepOutputType
} from '../wizard-support-summary-progress-update-milestones/steps/date-step.types';
import { SummaryStepInputType } from './steps/summary-step.types';
import { DocumentNameStepInputType, DocumentNameStepOutputType } from './steps/document-name-step.types';
import {
  DocumentDescriptionStepInputType,
  DocumentDescriptionStepOutputType
} from './steps/document-description-step.types';
import { DocumentFileStepInputType, DocumentFileStepOutputType } from './steps/document-file-step.types';
import { WizardInnovationSupportSummaryProgressUpdateTitleStepComponent } from './steps/title-step.component';
import { WizardInnovationSupportSummaryProgressUpdateDescriptionStepComponent } from './steps/description-step.component';
import { WizardInnovationSupportSummaryProgressUpdateAddDocumentStepComponent } from './steps/add-document-step.component';
import { WizardInnovationSupportSummaryProgressUpdateMilestonesDateStepComponent } from '../wizard-support-summary-progress-update-milestones/steps/date-step.component';
import { WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent } from './steps/summary-step.component';
import { WizardInnovationSupportSummaryProgressUpdateDocumentNameStepComponent } from './steps/document-name-step.component';
import { WizardInnovationSupportSummaryProgressUpdateDocumentDescriptionStepComponent } from './steps/document-description-step.component';
import { WizardInnovationSupportSummaryProgressUpdateDocumentFileStepComponent } from './steps/document-file-step.component';

type WizardData = {
  titleStep: {
    title: string;
  };
  descriptionStep: {
    description: string;
  };
  addDocumentStep: {
    addDocument: string;
  };
  documentNameStep: {
    documentName: string;
  };
  documentDescriptionStep: {
    documentDescription: string;
  };
  documentFileStep: {
    documentFile: FileUploadType | null;
  };
  dateStep: {
    day: string;
    month: string;
    year: string;
  };
};

const wizardEmptyState = {
  titleStep: {
    title: ''
  },
  descriptionStep: {
    description: ''
  },
  addDocumentStep: {
    addDocument: ''
  },
  documentNameStep: {
    documentName: ''
  },
  documentDescriptionStep: {
    documentDescription: ''
  },
  documentFileStep: {
    documentFile: null
  },
  dateStep: {
    day: '',
    month: '',
    year: ''
  }
};

export const stepsTitles = {
  titleStep: 'Add progress update',
  descriptionStep: 'Add a description for your progress update',
  addDocumentStep: 'Do you want to add a document to support this progress update?',
  documentNameStep: 'What do you want to name this document?',
  documentDescriptionStep: 'Write a short description for this document (optional)',
  documentFileStep: 'Upload the document',
  dateStep: 'Select a date for this progress update',
  summaryStep: 'Check your answers'
};

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update',
  templateUrl: './support-summary-progress-update.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  wizard = new WizardModel<WizardData>({});

  constructor(private innovationsService: InnovationsService) {
    super();

    this.innovation = this.ctx.innovation.info();

    this.wizard.data = { ...wizardEmptyState };
  }

  ngOnInit(): void {
    // Set wizard steps
    this.wizard.addStep(
      new WizardStepModel<TitleStepInputType, TitleStepOutputType>({
        id: 'titleStep',
        title: stepsTitles.titleStep,
        component: WizardInnovationSupportSummaryProgressUpdateTitleStepComponent,
        data: {
          title: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data),
          nextStepEvent: data => this.onNextStep(data, this.onTitleStepOut, this.onDescriptionStepIn)
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<DescriptionStepInputType, DescriptionStepOutputType>({
        id: 'descriptionStep',
        title: stepsTitles.descriptionStep,
        component: WizardInnovationSupportSummaryProgressUpdateDescriptionStepComponent,
        data: {
          description: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onDescriptionStepOut, this.onTitleStepIn),
          nextStepEvent: data => this.onNextStep(data, this.onDescriptionStepOut, this.onAddDocumentStepIn)
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<AddDocumentStepInputType, AddDocumentStepOutputType>({
        id: 'addDocumentStep',
        title: stepsTitles.addDocumentStep,
        component: WizardInnovationSupportSummaryProgressUpdateAddDocumentStepComponent,
        data: {
          addDocument: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onAddDocumentStepOut, this.onDescriptionStepIn),
          nextStepEvent: data =>
            this.onNextStep(data, this.onAddDocumentStepOut, this.onDateStepIn, this.onDocumentNameStepIn)
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<DateStepInputType, DateStepOutputType>({
        id: 'dateStep',
        title: stepsTitles.dateStep,
        component: WizardInnovationSupportSummaryProgressUpdateMilestonesDateStepComponent,
        data: {
          day: '',
          month: '',
          year: ''
        },
        outputs: {
          previousStepEvent: data =>
            this.onPreviousStep(data, this.onDateStepOut, this.onAddDocumentStepIn, this.onDocumentFileStepIn),
          nextStepEvent: data => this.onNextStep(data, this.onDateStepOut, this.onSummaryStepIn)
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<SummaryStepInputType, null>({
        id: 'summaryStep',
        title: stepsTitles.summaryStep,
        component: WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent,
        data: {
          ...wizardEmptyState,
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

  // Steps mappings.
  onTitleStepIn(): void {
    this.wizard.setStepData<TitleStepInputType>('titleStep', {
      title: this.wizard.data.titleStep.title
    });
  }

  onTitleStepOut(stepData: WizardStepEventType<TitleStepOutputType>): void {
    this.wizard.data.titleStep = {
      title: stepData.data.title
    };
  }

  onDescriptionStepIn(): void {
    this.wizard.setStepData<DescriptionStepInputType>('descriptionStep', {
      description: this.wizard.data.descriptionStep.description
    });
  }

  onDescriptionStepOut(stepData: WizardStepEventType<DescriptionStepOutputType>): void {
    this.wizard.data.descriptionStep = {
      description: stepData.data.description
    };
  }

  onAddDocumentStepIn(): void {
    this.wizard.setStepData<AddDocumentStepInputType>('addDocumentStep', {
      addDocument: this.wizard.data.addDocumentStep.addDocument
    });
  }

  onAddDocumentStepOut(stepData: WizardStepEventType<AddDocumentStepOutputType>): void {
    const previousAddDocumentValue = this.wizard.data.addDocumentStep.addDocument;

    this.wizard.data.addDocumentStep = {
      addDocument: stepData.data.addDocument
    };

    // If the value has changed, manage the document steps.
    if (previousAddDocumentValue !== stepData.data.addDocument) {
      this.manageDocumentSteps();
    }
  }

  onDocumentNameStepIn(): void {
    this.wizard.setStepData<DocumentNameStepInputType>('documentNameStep', {
      documentName: this.wizard.data.documentNameStep.documentName
    });
  }

  onDocumentNameStepOut(stepData: WizardStepEventType<DocumentNameStepOutputType>): void {
    this.wizard.data.documentNameStep = {
      documentName: stepData.data.documentName
    };
  }

  onDocumentDescriptionStepIn(): void {
    this.wizard.setStepData<DocumentDescriptionStepInputType>('documentDescriptionStep', {
      documentDescription: this.wizard.data.documentDescriptionStep.documentDescription
    });
  }

  onDocumentDescriptionStepOut(stepData: WizardStepEventType<DocumentDescriptionStepOutputType>): void {
    this.wizard.data.documentDescriptionStep = {
      documentDescription: stepData.data.documentDescription
    };
  }

  onDocumentFileStepIn(): void {
    this.wizard.setStepData<DocumentFileStepInputType>('documentFileStep', {
      documentFile: this.wizard.data.documentFileStep.documentFile
    });
  }

  onDocumentFileStepOut(stepData: WizardStepEventType<DocumentFileStepOutputType>): void {
    this.wizard.data.documentFileStep = {
      documentFile: stepData.data.documentFile
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
      titleStep: this.wizard.data.titleStep,
      descriptionStep: this.wizard.data.descriptionStep,
      addDocumentStep: this.wizard.data.addDocumentStep,
      documentNameStep: this.wizard.data.documentNameStep,
      documentDescriptionStep: this.wizard.data.documentDescriptionStep,
      documentFileStep: this.wizard.data.documentFileStep,
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

    if (this.wizard.isFirstStep()) {
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
      case 'titleStep':
        this.onTitleStepIn();
        break;
      case 'descriptionStep':
        this.onDescriptionStepIn();
        break;
      case 'addDocumentStep':
        this.onAddDocumentStepIn();
        break;
      case 'documentNameStep':
        this.onDocumentNameStepIn();
        break;
      case 'documentDescriptionStep':
        this.onDocumentDescriptionStepIn();
        break;
      case 'documentFileStep':
        this.onDocumentFileStepIn();
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

  manageDocumentSteps(): void {
    if (this.wizard.data.addDocumentStep.addDocument === 'YES') {
      this.addDocumentSteps();
    } else {
      this.clearWizardDocumentData();
      this.removeDocumentSteps();
    }
  }

  addDocumentSteps(): void {
    this.wizard.addStep(
      new WizardStepModel<DocumentNameStepInputType, DocumentNameStepOutputType>({
        id: 'documentNameStep',
        title: stepsTitles.documentNameStep,
        component: WizardInnovationSupportSummaryProgressUpdateDocumentNameStepComponent,
        data: {
          documentName: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onDocumentNameStepOut, this.onAddDocumentStepIn),
          nextStepEvent: data => this.onNextStep(data, this.onDocumentNameStepOut, this.onDocumentDescriptionStepIn)
        }
      }),
      3
    ),
      this.wizard.addStep(
        new WizardStepModel<DocumentDescriptionStepInputType, DocumentDescriptionStepOutputType>({
          id: 'documentDescriptionStep',
          title: stepsTitles.documentDescriptionStep,
          component: WizardInnovationSupportSummaryProgressUpdateDocumentDescriptionStepComponent,
          data: {
            documentDescription: ''
          },
          outputs: {
            previousStepEvent: data =>
              this.onPreviousStep(data, this.onDocumentDescriptionStepOut, this.onDocumentNameStepIn),
            nextStepEvent: data => this.onNextStep(data, this.onDocumentDescriptionStepOut, this.onDocumentFileStepIn)
          }
        }),
        4
      ),
      this.wizard.addStep(
        new WizardStepModel<DocumentFileStepInputType, DocumentFileStepOutputType>({
          id: 'documentFileStep',
          title: stepsTitles.documentFileStep,
          component: WizardInnovationSupportSummaryProgressUpdateDocumentFileStepComponent,
          data: {
            documentFile: null
          },
          outputs: {
            previousStepEvent: data =>
              this.onPreviousStep(data, this.onDocumentFileStepOut, this.onDocumentDescriptionStepIn),
            nextStepEvent: data => this.onNextStep(data, this.onDocumentFileStepOut, this.onDateStepIn)
          }
        }),
        5
      );
  }

  removeDocumentSteps(): void {
    this.wizard.removeStep('documentNameStep');
    this.wizard.removeStep('documentDescriptionStep');
    this.wizard.removeStep('documentFileStep');
  }

  clearWizardDocumentData(): void {
    this.wizard.data.documentNameStep = {
      documentName: ''
    };
    this.wizard.data.documentDescriptionStep = {
      documentDescription: ''
    };
    this.wizard.data.documentFileStep = {
      documentFile: null
    };
  }

  onSubmitWizard(): void {
    this.setPageStatus('LOADING');

    const body = {
      title: this.wizard.data.titleStep.title,
      description: this.wizard.data.descriptionStep.description,
      ...(this.wizard.data.addDocumentStep.addDocument === 'YES' && {
        document: {
          name: this.wizard.data.documentNameStep.documentName ?? '',
          ...(this.wizard.data.documentDescriptionStep.documentDescription && {
            description: this.wizard.data.documentDescriptionStep.documentDescription
          }),
          ...(this.wizard.data.documentFileStep.documentFile && {
            file: {
              id: this.wizard.data.documentFileStep.documentFile.id,
              name: this.wizard.data.documentFileStep.documentFile.name,
              size: this.wizard.data.documentFileStep.documentFile.size,
              extension: this.wizard.data.documentFileStep.documentFile.extension
            }
          })
        }
      }),
      createdAt: DatesHelper.setCurrentTimeToDate(
        new Date(+this.wizard.data.dateStep.year, +this.wizard.data.dateStep.month - 1, +this.wizard.data.dateStep.day)
      ).toISOString()
    };

    this.innovationsService.createSupportSummaryProgressUpdate(this.innovation.id, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your progress update has been added to the support summary', {
          message: 'The innovator has been notified about your update.'
        });
        this.redirectToSupportSummaryList();
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('READY');
      }
    });
  }

  private redirectToSupportSummaryList(): void {
    this.redirectTo(
      `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}/support-summary`
    );
  }
}
