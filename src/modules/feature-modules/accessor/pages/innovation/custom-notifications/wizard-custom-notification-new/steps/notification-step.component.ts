import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { CustomValidators, FormEngineParameterModel } from '@modules/shared/forms';
import {
  NotificationStepInputType,
  NotificationStepOutputType,
  NOTIFICATION_ITEMS,
  CategoryEnum
} from './notification-step.types';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-new-notification-step',
  templateUrl: './notification-step.component.html'
})
export class WizardInnovationCustomNotificationNewNotificationStepComponent
  extends CoreComponent
  implements WizardStepComponentType<NotificationStepInputType, NotificationStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: NotificationStepInputType = {
    selectedNotification: ''
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<NotificationStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<NotificationStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<NotificationStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<NotificationStepOutputType>>();

  errorMessage = "Select what you'd like to be notified about";

  form = new FormGroup({
    notification: new FormControl<string | null>(null, [CustomValidators.required(this.errorMessage)])
  });

  notificationItems: Required<FormEngineParameterModel>['items'] = [];

  constructor() {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    // Add each notification as an option to select on the form
    this.notificationItems = [
      { value: 'Notify me when:', label: 'HEADING' },
      ...this.filterAndMapNotifications(CategoryEnum.NOTIFIY_ME_WHEN),
      { value: 'Remind me:', label: 'HEADING' },
      ...this.filterAndMapNotifications(CategoryEnum.REMIND_ME)
    ];

    // Select the notification previously selected by the user
    if (this.data.selectedNotification) {
      this.form.get('notification')?.setValue(this.data.selectedNotification);
    }

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  filterAndMapNotifications(category: CategoryEnum): { value: NotificationEnum; label: string }[] {
    return NOTIFICATION_ITEMS.filter(notification => notification.category === category).map(notification => ({
      value: notification.type,
      label: notification.label
    }));
  }

  prepareOutputData(): NotificationStepOutputType {
    return {
      notification: this.form.value.notification ?? ''
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.errorMessage, fieldId: 'notification' }],
        width: '2.thirds'
      });

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }
}
