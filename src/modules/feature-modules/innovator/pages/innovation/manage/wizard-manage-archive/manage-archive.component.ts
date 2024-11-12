import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';
import { ReasonStepInputType, ReasonStepOutputType } from './steps/reason-step.types';
import { WizardInnovationManageArchiveReasonStepComponent } from './steps/reason-step.component';
import { ConfirmationStepInputType, ConfirmationStepOutputType } from './steps/confirmation-step.types';
import { WizardInnovationManageArchiveConfirmationStepComponent } from './steps/confirmation-step.component';
import {
  InnovationArchiveReasonEnum,
  InnovatorService
} from '@modules/feature-modules/innovator/services/innovator.service';
import { OverviewStepInputType, OverviewStepOutputType } from './steps/overview-step.types';
import { WizardInnovationManageArchiveOverviewStepComponent } from './steps/overview-step.component';

type WizardData = {
  reasonStep: {
    reason: InnovationArchiveReasonEnum | null;
  };
  confirmationStep: {
    email: string;
    confirmation: string;
  };
};

const wizardEmptyState = {
  reasonStep: {
    reason: null
  },
  confirmationStep: {
    email: '',
    confirmation: ''
  }
};

@Component({
  selector: 'innovator-pages-innovation-wizard-manage-archive',
  templateUrl: './manage-archive.component.html'
})
export class WizardInnovationManageArchiveComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  wizard = new WizardModel<WizardData>({});

  constructor(private innovatorService: InnovatorService) {
    super();

    this.innovation = this.ctx.innovation.info();

    this.wizard.data = { ...wizardEmptyState };
  }

  ngOnInit(): void {
    // Set wizard steps

    this.wizard.addStep(
      new WizardStepModel<OverviewStepInputType, OverviewStepOutputType>({
        id: 'overviewStep',
        title: `Archive ${this.innovation.name} innovation`,
        component: WizardInnovationManageArchiveOverviewStepComponent,
        data: {},
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data),
          nextStepEvent: data => this.onNextStep(data, this.onOverviewStepOut, this.onReasonStepIn),
          cancelEvent: () => this.redirectToManageInnovation()
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<ReasonStepInputType, ReasonStepOutputType>({
        id: 'reasonStep',
        title: 'Why do you want to archive your innovation?',
        component: WizardInnovationManageArchiveReasonStepComponent,
        data: {
          reason: null
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onReasonStepOut, this.onOverviewStepIn),
          nextStepEvent: data => this.onNextStep(data, this.onReasonStepOut, this.onConfirmationStepIn)
        }
      })
    );

    this.wizard.addStep(
      new WizardStepModel<ConfirmationStepInputType, ConfirmationStepOutputType>({
        id: 'confirmationStep',
        title: `Archive ${this.innovation.name} innovation`,
        component: WizardInnovationManageArchiveConfirmationStepComponent,
        data: {
          email: '',
          confirmation: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onConfirmationStepOut, this.onReasonStepIn),
          submitEvent: data => this.onSubmit(data),
          cancelEvent: () => this.redirectToManageInnovation()
        }
      })
    );

    this.setPageStatus('READY');
  }

  // Steps mappings.
  onOverviewStepIn(): void {
    this.wizard.data = { ...wizardEmptyState };
  }

  onOverviewStepOut(): void {
    this.wizard.data = { ...wizardEmptyState };
  }

  onReasonStepIn(): void {
    this.wizard.setStepData<ReasonStepInputType>('reasonStep', {
      reason: this.wizard.data.reasonStep.reason
    });
  }

  onReasonStepOut(stepData: WizardStepEventType<ReasonStepOutputType>): void {
    this.wizard.data.reasonStep = {
      reason: stepData.data.reason
    };
  }

  onConfirmationStepIn(): void {
    this.wizard.setStepData<ConfirmationStepInputType>('confirmationStep', {
      email: this.wizard.data.confirmationStep.email,
      confirmation: this.wizard.data.confirmationStep.confirmation
    });
  }

  onConfirmationStepOut(stepData: WizardStepEventType<ConfirmationStepOutputType>): void {
    this.wizard.data.confirmationStep = {
      email: stepData.data.email,
      confirmation: stepData.data.confirmation
    };
  }

  onPreviousStep<T extends WizardStepEventType<MappedObjectType | null>>(
    stepData: T,
    ...args: ((data: T) => void)[]
  ): void {
    this.resetAlert();

    if (this.wizard.isFirstStep()) {
      const previousUrl = this.ctx.layout.previousUrl();
      if (previousUrl) {
        this.redirectTo(previousUrl);
      } else {
        this.redirectTo('/innovator/dashboard');
      }
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

  onSubmitWizard(): void {
    this.setPageStatus('LOADING');

    this.innovatorService.archiveInnovation(this.innovation.id, this.wizard.data.reasonStep.reason!).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('You have archived your innovation', {
          message: 'All support has ended. You cannot send or reply to messages. All open tasks have been cancelled.'
        });
        this.redirectTo(`/innovator/innovations/${this.innovation.id}/overview`);
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('READY');
      }
    });
  }

  private redirectToManageInnovation(): void {
    this.redirectTo(`/innovator/innovations/${this.innovation.id}/manage/innovation`);
  }
}
