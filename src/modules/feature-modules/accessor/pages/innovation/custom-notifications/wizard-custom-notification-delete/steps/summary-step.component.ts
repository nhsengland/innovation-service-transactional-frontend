import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { SummaryStepInputType } from './summary-step.types';
import { UtilsHelper } from '@app/base/helpers';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';

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

  constructor(private datePipe: DatePipe) {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    this.data.selectedNotificationsPerInnovation = this.data.selectedNotificationsPerInnovation.map(innovation => {
      return {
        ...innovation,
        subscriptions: innovation.subscriptions?.map(subscription => {
          // Determine whether to add displayOrganisations based on eventType
          const displayOrganisations =
            subscription.eventType === NotificationEnum.SUPPORT_UPDATED ||
            subscription.eventType === NotificationEnum.PROGRESS_UPDATE_CREATED
              ? UtilsHelper.getNotifyMeSubscriptionOrganisationsText(subscription)
              : undefined;

          const displayReminder =
            subscription.eventType === NotificationEnum.REMINDER
              ? `${UtilsHelper.getNotifyMeSubscriptionReminderText(subscription, this.datePipe)} ${subscription.customMessage}`
              : undefined;

          return {
            ...subscription,
            displayTitle: UtilsHelper.getNotifyMeSubscriptionTitleText(subscription),
            displayOrganisations: displayOrganisations,
            displayReminder: displayReminder
          };
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
