import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { WizardModel, WizardStepModel } from '@app/base/models';
import { MappedObjectType, WizardStepEventType } from '@app/base/types';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { WizardTaskNewMessageStepComponent } from './steps/message-step.component';
import { MessageStepInputType, MessageStepOutputType } from './steps/message-step.types';
import { WizardTaskNewSectionStepComponent } from './steps/section-step.component';
import { SectionStepInputType, SectionStepOutputType } from './steps/section-step.types';

@Component({
  selector: 'shared-pages-innovation-task-new',
  templateUrl: './task-new.component.html'
})
export class PageInnovationTaskNewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  sectionId: string;

  taskUrl: string;
  sectionUrl: string;

  sections: { value: string; label: string }[];

  wizard = new WizardModel<{
    sectionStep: { section: null | string };
    messageStep: { message: string };
  }>({});

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.sectionId = this.activatedRoute.snapshot.queryParams.section;

    this.taskUrl = `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/tasks`;

    this.sectionUrl = `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/record/sections/${this.sectionId}`;

    this.sections = this.ctx.schema.getIrSchemaNumberedSubSectionsList();

    this.wizard.data = {
      sectionStep: { section: null },
      messageStep: { message: '' }
    };
  }

  ngOnInit() {
    if (this.sectionId) {
      // Check if is a valid sectionId
      const section = this.ctx.schema.getIrSchemaSectionIdentificationV3(this.sectionId);

      if (section) {
        this.wizard.data.sectionStep.section = this.sectionId;
      } else {
        this.redirectTo(`${this.taskUrl}/new`);
        return;
      }
    } else {
      this.wizard.addStep(
        new WizardStepModel<SectionStepInputType, SectionStepOutputType>({
          id: 'sectionStep',
          title: 'Which section of the innovation record would you like the innovator to update?',
          component: WizardTaskNewSectionStepComponent,
          data: {
            sections: this.sections,
            selectedSection: null
          },
          outputs: {
            previousStepEvent: data => this.onPreviousStep(data),
            nextStepEvent: data => this.onNextStep(data, this.onSectionStepOut, this.onMessageStepIn),
            cancelEvent: () => this.redirectTo(this.taskUrl)
          }
        })
      );
    }

    this.wizard.addStep(
      new WizardStepModel<MessageStepInputType, MessageStepOutputType>({
        id: 'messageStep',
        title: '',
        component: WizardTaskNewMessageStepComponent,
        data: {
          selectedSection: this.wizard.data.sectionStep.section,
          message: ''
        },
        outputs: {
          previousStepEvent: data => this.onPreviousStep(data, this.onMessageStepOut, this.onSectionStepIn),
          submitEvent: data => this.onSubmitStep(data, this.onMessageStepOut),
          cancelEvent: () => (this.sectionId ? this.redirectTo(this.sectionUrl) : this.redirectTo(this.taskUrl))
        }
      })
    );

    this.setPageStatus('READY');
  }

  onPreviousStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    if (this.wizard.currentStepNumber() === 1) {
      if (this.sectionId) {
        this.redirectTo(this.sectionUrl);
      } else {
        this.redirectTo(this.taskUrl);
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

  onSubmitStep<T extends WizardStepEventType<MappedObjectType>>(stepData: T, ...args: ((data: T) => void)[]): void {
    this.resetAlert();

    args.forEach(element => element.bind(this)(stepData));
    this.onSubmit();
  }

  // Steps mappings.
  onSectionStepIn(): void {
    this.wizard.setStepData<SectionStepInputType>('sectionStep', {
      sections: this.sections,
      selectedSection: this.wizard.data.sectionStep.section
    });
  }

  onSectionStepOut(stepData: WizardStepEventType<SectionStepOutputType>): void {
    this.wizard.data.sectionStep = {
      section: stepData.data.section
    };
  }

  onMessageStepIn(): void {
    this.wizard.setStepData<MessageStepInputType>('messageStep', {
      selectedSection: this.wizard.data.sectionStep.section,
      message: this.wizard.data.messageStep.message
    });
  }

  onMessageStepOut(stepData: WizardStepEventType<MessageStepOutputType>): void {
    this.wizard.data.messageStep = {
      message: stepData.data.message
    };
  }

  onSubmit(): void {
    const body = {
      section: this.wizard.data.sectionStep.section!,
      description: this.wizard.data.messageStep.message
    };

    this.innovationsService.createAction(this.innovationId, body).subscribe({
      next: response => {
        this.setRedirectAlertSuccess('You have assigned a task', {
          message: 'The innovator will be notified and it will be added to their to do list.'
        });
        this.redirectTo(`${this.taskUrl}/${response.id}`, { sectionId: this.sectionId });
      },
      error: () =>
        this.setAlertError('An error occurred when creating an action. Please try again or contact us for further help')
    });
  }
}
