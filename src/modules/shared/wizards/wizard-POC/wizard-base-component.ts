import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardModelPOC, WizardStepModel } from './wizard.models-POC';
import { ContextInnovationType, MappedObjectType } from '@app/base/types';
import { WizardStepEventType } from '../wizard.types';

import {
  ReasonStepInputType,
  ReasonStepOutputType
} from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/reason-step.types';
import { InnovationArchiveReasonEnum } from '@modules/feature-modules/innovator/services/innovator.service';
import {
  ConfirmationStepInputType,
  ConfirmationStepOutputType
} from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/confirmation-step.types';
import { Subject } from 'rxjs';
import {
  OverviewStepInputType,
  OverviewStepOutputType
} from '@modules/feature-modules/innovator/pages/innovation/manage/wizard-manage-archive/steps/overview-step.types';
import { WizardInnovationManageArchiveOverviewStepPOCComponent } from '../steps-POC/overview-step.component';
import { WizardInnovationManageArchiveConfirmationStepPOCComponent } from '../steps-POC/confirmation-step.component';
import { WizardInnovationManageArchiveReasonStepPOCComponent } from '../steps-POC/reason-step.component';

type WizardData = {
  reason: InnovationArchiveReasonEnum | null;
  email: string;
  confirmation: string;
};
// type WizardData = {
//   reasonStep: {
//     reason: InnovationArchiveReasonEnum | null;
//   };
//   confirmationStep: {
//     email: string;
//     confirmation: string;
//   };
// };

const wizardEmptyState = {
  reason: null,
  email: '',
  confirmation: ''
};
// const wizardEmptyState = {
//   reasonStep: {
//     reason: null
//   },
//   confirmationStep: {
//     email: '',
//     confirmation: ''
//   }
// };

@Component({
  selector: 'wizard-base-component',
  standalone: false,
  template: `
    <theme-content-wrapper [status]="pageStatus()">
      <div class="nhsuk-grid-row">
        <div class="nhsuk-grid-column-full">
          <div>
            <ng-container
              [ngComponentOutlet]="wizard.currentStep().component"
              [ngComponentOutletInputs]="{
                changing: this.changingValue,
                title: this.wizard.currentStep().title,
                data: this.wizard.data
              }"
              [ndcDynamicOutputs]="wizard.currentStep().outputs"
              #placeToRender
            >
            </ng-container>
            <a
              *ngIf="!this.wizard.isLastStep()"
              href="javascript:void(0)"
              class="nhsuk-button nhsuk-u-margin-top-5"
              (click)="onNextStep()"
              >Continue</a
            >
          </div>
          <a href="javascript:void()" (click)="onCancel()">Cancel</a>
        </div>
      </div>
    </theme-content-wrapper>
  `
})
export class WizardBaseComponent extends CoreComponent implements OnInit {
  @ViewChild('placeToRender', { static: true, read: ViewContainerRef }) placeToRender: ViewContainerRef;
  changingValue = new Subject<boolean>();

  stepsDefinition: Record<string, WizardStepModel> = {};
  wizard = new WizardModelPOC<WizardData>({});
  innovation: ContextInnovationType;
  baseUrl: string;
  onCancelUrl = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentRef: ComponentRef<WizardModelPOC<any>> | undefined = undefined;

  constructor(protected viewContainer: ViewContainerRef) {
    super();

    this.wizard.data = { ...wizardEmptyState };

    this.placeToRender = viewContainer;
    this.innovation = this.ctx.innovation.info();

    this.baseUrl = `${this.userUrlBasePath()}/innovations/${this.innovation.id}`;

    this.onCancelUrl = this.baseUrl;

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.stepsDefinition = {
      overviewStep: new WizardStepModel<OverviewStepInputType, OverviewStepOutputType>({
        id: 'overviewStep',
        title: `Archive ${this.innovation.name} innovation`,
        component: WizardInnovationManageArchiveOverviewStepPOCComponent,
        data: {},
        outputs: {}
      }),
      reasonStep: new WizardStepModel<ReasonStepInputType, ReasonStepOutputType>({
        id: 'reasonStep',
        title: 'Why do you want to archive your innovation?',
        component: WizardInnovationManageArchiveReasonStepPOCComponent,
        data: {
          reason: null
        },
        outputs: {
          // sendDataEvent: data => this.onEmitChild(data, this.onReasonStepOut)
          sendDataEvent: data => this.onEmitChild(data, this.onStepOut)
        }
      }),
      confirmationStep: new WizardStepModel<ConfirmationStepInputType, ConfirmationStepOutputType>({
        id: 'confirmationStep',
        title: `Archive ${this.innovation.name} innovation`,
        component: WizardInnovationManageArchiveConfirmationStepPOCComponent,
        data: {
          email: '',
          confirmation: ''
        },
        outputs: {
          submitEvent: data => this.onSubmit(data),
          sendDataEvent: data => this.onEmitChild(data, this.onStepOut)
        }
      })
    };

    this.setWizardSteps(Object.values(this.stepsDefinition));

    this.renderCurrentStep();
    this.setPageStatus('READY');
  }

  askChildComponentForData() {
    console.log('asked child for data');
    this.changingValue.next(true);
  }

  onOverviewStepOut(): void {
    this.wizard.data = { ...wizardEmptyState };
  }

  onStepOut(stepData: WizardStepEventType<any>): void {
    this.wizard.data = { ...this.wizard.data, ...stepData.data };
  }

  onEmitChild<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {
    console.log('child emitted data:', stepData);
    args.forEach(element => element.bind(this)(stepData));
  }

  onCancel(): void {
    this.redirectTo(this.onCancelUrl);
  }

  onPreviousStep(): void {
    this.resetAlert();

    if (this.wizard.isFirstStep()) {
      this.redirectTo(this.baseUrl);
    } else {
      this.askChildComponentForData();
      this.wizard.gotoPreviousStep();
      this.renderCurrentStep();
    }
  }

  onNextStep(): void {
    this.resetAlert();
    this.askChildComponentForData();

    this.wizard.gotoNextStep();

    this.renderCurrentStep();
  }

  renderCurrentStep() {
    this.placeToRender.clear();
    this.componentRef = this.placeToRender.createComponent(this.wizard.currentStep().component);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onGoToStep(stepId: string): void {
    // implement
  }

  setWizardSteps(steps: WizardStepModel[]): void {
    steps.forEach(step => this.wizard.addStep(step));
  }

  onSubmit<T extends WizardStepEventType<MappedObjectType | null>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();
    this.askChildComponentForData();
    this.onSubmitWizard();
  }

  onSubmitWizard(): void {
    console.log('SUBMITTED');
    console.log('final data', this.wizard.data);
    // implement
  }
}
