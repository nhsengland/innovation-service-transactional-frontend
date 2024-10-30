import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { SummaryStepInputType } from './summary-step.types';
import { stepsTitles } from '../support-summary-progress-update.component';

@Component({
  selector: 'shared-pages-innovation-support-wizard-support-summary-progress-update-summary-step',
  templateUrl: './summary-step.component.html'
})
export class WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SummaryStepInputType, null>, OnInit
{
  @Input() title = '';
  @Input() data: SummaryStepInputType = {
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
    date: ''
  };

  stepsTitles = stepsTitles;

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() goToStepEvent = new EventEmitter<string>();

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit(): void {
    this.setPageTitle(this.title, { width: '2.thirds' });
    this.setPageStatus('READY');
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit();
  }

  onGotoStep(stepId: string): void {
    this.goToStepEvent.emit(stepId);
  }

  onSubmit(): void {
    this.submitEvent.emit();
  }
}
