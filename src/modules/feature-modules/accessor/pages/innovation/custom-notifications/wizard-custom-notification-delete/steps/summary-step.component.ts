import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { SummaryStepInputType } from './summary-step.types';
import { UtilsHelper } from '@app/base/helpers';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-delete-summary-step',
  templateUrl: './summary-step.component.html'
})
export class WizardInnovationCustomNotificationDeleteSummaryStepComponent
  extends CoreComponent
  implements WizardStepComponentType<SummaryStepInputType, null>, OnInit
{
  @Input() title = '';
  @Input() data: SummaryStepInputType = {
    selectedNotificationsPerInnovation: []
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
    this.data.selectedNotificationsPerInnovation = this.data.selectedNotificationsPerInnovation.map(innovation => {
      return {
        ...innovation,
        subscriptions: innovation.subscriptions?.map(subscription => {
          if (subscription.eventType === 'SUPPORT_UPDATED') {
            return {
              ...subscription,
              displayTitle: UtilsHelper.getNotifyMeSubscriptionText(subscription),
              displayOrganisations: subscription.organisations
                .flatMap(org => (org.units.length === 1 ? [org.name] : org.units.map(unit => unit.name)))
                .sort()
            };
          } else {
            return subscription;
          }
        })
      };
    });

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
