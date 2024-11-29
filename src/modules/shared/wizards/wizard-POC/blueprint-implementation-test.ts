import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { WizardBaseComponent } from './wizard-base-component';
import { WizardModelPOC, WizardStepModel } from './wizard.models-POC';
import { WizardInnovationManageArchiveOverviewStepComponent } from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/overview-step.component';
import {
  OverviewStepInputType,
  OverviewStepOutputType
} from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/overview-step.types';
import {
  ReasonStepInputType,
  ReasonStepOutputType
} from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/reason-step.types';
import { WizardInnovationManageArchiveReasonStepComponent } from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/reason-step.component';
import {
  ConfirmationStepInputType,
  ConfirmationStepOutputType
} from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/confirmation-step.types';
import { WizardInnovationManageArchiveConfirmationStepComponent } from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/confirmation-step.component';
import { InnovationArchiveReasonEnum } from '@modules/feature-modules/innovator/services/innovator.service';

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
  selector: 'blueprint-implementation-test',
  standalone: true,
  imports: [CommonModule],
  template: ` <div>
    <p>Before</p>
    <ng-template #viewtemplateRef></ng-template>
    <p>After</p>
  </div>`
})
export class WizardInheritanceTestComponent extends WizardBaseComponent implements OnInit {
  override wizard = new WizardModelPOC<WizardData>({});

  constructor(protected override viewContainer: ViewContainerRef) {
    super(viewContainer);
    this.wizard.data = { ...wizardEmptyState };
  }

  override ngOnInit(): void {
    this.stepsDefinition = {
      overviewStep: new WizardStepModel<OverviewStepInputType, OverviewStepOutputType>({
        id: 'overviewStep',
        title: `Archive ${this.innovation.name} innovation`,
        component: WizardInnovationManageArchiveOverviewStepComponent,
        data: {},
        outputs: {
          //   previousStepEvent: data => this.onPreviousStep(data),
          //   nextStepEvent: data => this.onNextStep(data, this.onOverviewStepOut, this.onReasonStepIn)
        }
      }),
      reasonStep: new WizardStepModel<ReasonStepInputType, ReasonStepOutputType>({
        id: 'reasonStep',
        title: 'Why do you want to archive your innovation?',
        component: WizardInnovationManageArchiveReasonStepComponent,
        data: {
          reason: null
        },
        outputs: {
          //   previousStepEvent: data => this.onPreviousStep(data, this.onReasonStepOut, this.onOverviewStepIn),
          //   nextStepEvent: data => this.onNextStep(data, this.onReasonStepOut, this.onConfirmationStepIn)
        }
      }),
      confirmationStep: new WizardStepModel<ConfirmationStepInputType, ConfirmationStepOutputType>({
        id: 'confirmationStep',
        title: `Archive ${this.innovation.name} innovation`,
        component: WizardInnovationManageArchiveConfirmationStepComponent,
        data: {
          email: '',
          confirmation: ''
        },
        outputs: {
          //   previousStepEvent: data => this.onPreviousStep(data, this.onConfirmationStepOut, this.onReasonStepIn),
          submitEvent: data => this.onSubmit(data)
        }
      })
    };

    this.setWizardSteps(Object.values(this.stepsDefinition));
    this.renderCurrentStep();
  }

  // Steps mappings.
  // onOverviewStepIn(): void {
  //   this.wizard.data = { ...wizardEmptyState };
  // }

  // onOverviewStepOut(): void {
  //   this.wizard.data = { ...wizardEmptyState };
  // }

  //   onReasonStepIn(): void {
  //     this.wizard.setStepData<ReasonStepInputType>('reasonStep', {
  //       reason: this.wizard.data.reasonStep.reason
  //     });
  //   }

  //   onReasonStepOut(stepData: WizardStepEventType<ReasonStepOutputType>): void {
  //     this.wizard.data.reasonStep = {
  //       reason: stepData.data.reason
  //     };
  //   }

  //   onConfirmationStepIn(): void {
  //     this.wizard.setStepData<ConfirmationStepInputType>('confirmationStep', {
  //       email: this.wizard.data.confirmationStep.email,
  //       confirmation: this.wizard.data.confirmationStep.confirmation
  //     });
  //   }

  //   onConfirmationStepOut(stepData: WizardStepEventType<ConfirmationStepOutputType>): void {
  //     this.wizard.data.confirmationStep = {
  //       email: stepData.data.email,
  //       confirmation: stepData.data.confirmation
  //     };
  //   }
}
