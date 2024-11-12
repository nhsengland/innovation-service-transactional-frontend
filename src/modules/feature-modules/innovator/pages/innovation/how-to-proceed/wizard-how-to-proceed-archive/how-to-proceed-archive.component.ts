import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { ContextInnovationType, MappedObjectType, WizardStepEventType } from '@app/base/types';

import {
  InnovationArchiveReasonEnum,
  InnovatorService
} from '@modules/feature-modules/innovator/services/innovator.service';
import {
  ConfirmationStepInputType,
  ConfirmationStepOutputType
} from '../../manage/wizard-manage-archive/steps/confirmation-step.types';
import { WizardInnovationManageArchiveConfirmationStepComponent } from '../../manage/wizard-manage-archive/steps/confirmation-step.component';
import {
  OverviewStepInputType,
  OverviewStepOutputType
} from '../../manage/wizard-manage-archive/steps/overview-step.types';
import { WizardInnovationManageArchiveOverviewStepComponent } from '../../manage/wizard-manage-archive/steps/overview-step.component';
import { ActivatedRoute } from '@angular/router';

type WizardData = {
  confirmationStep: {
    email: string;
    confirmation: string;
  };
};

const wizardEmptyState = {
  confirmationStep: {
    email: '',
    confirmation: ''
  }
};

@Component({
  selector: 'innovator-pages-innovation-how-to-proceed-wizard-archive',
  templateUrl: './how-to-proceed-archive.component.html'
})
export class WizardInnovationHowToProceedArchiveComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  action: InnovationArchiveReasonEnum;

  wizard = new WizardModel<WizardData>({});

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.action = this.activatedRoute.snapshot.queryParams.action;

    this.wizard.data = { ...wizardEmptyState };
  }

  ngOnInit(): void {
    // Set wizard steps
    this.wizard.addStep(
      new WizardStepModel<OverviewStepInputType, OverviewStepOutputType>({
        id: 'overviewStep',
        title: 'We recommend you archive your innovation',
        component: WizardInnovationManageArchiveOverviewStepComponent,
        data: {},
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data),
          nextStepEvent: data => this.onNextStep(data, this.onConfirmationStepIn),
          cancelEvent: () => this.redirectToInnovationOverview()
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
          previousStepEvent: data => this.onPreviousStep(data, this.onConfirmationStepOut),
          submitEvent: data => this.onSubmit(data),
          cancelEvent: () => this.redirectToInnovationOverview()
        }
      })
    );

    this.setPageStatus('READY');
  }

  // Steps mappings.
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
        this.redirectTo(previousUrl, { action: this.action });
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

    this.innovatorService.archiveInnovation(this.innovation.id, this.action).subscribe({
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

  private redirectToInnovationOverview(): void {
    this.redirectTo(`/innovator/innovations/${this.innovation.id}`);
  }
}
