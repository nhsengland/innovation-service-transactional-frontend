import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { SummaryStepInputType } from './summary-step.types';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-summary-step',
  templateUrl: './summary-step.component.html'
})
export class WizardInnovationCustomNotificationNewSummaryStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SummaryStepInputType, null>, OnInit
{
  @Input() title = '';
  @Input() data: SummaryStepInputType = {
    selectedNotification: '',
    selectedOrganisations: [],
    selectedSupportStatuses: []
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<null>>();
  @Output() goToStepEvent = new EventEmitter<string>();

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
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
