import { PluralTranslatePipe } from './../../../../../../../shared/pipes/plural-translate.pipe';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CoreComponent } from '@app/base';
import { WizardStepComponentType, WizardStepEventType } from '@app/base/types';
import { CustomValidators, FormEngineParameterModel } from '@modules/shared/forms';
import { NotificationsStepInputType, NotificationsStepOutputType } from './notifications-step.types';
import { DatePipe } from '@angular/common';
import {
  GetNotifyMeInnovationSubscription,
  NotificationEnum,
  NotifyMeResponseTypes,
  ProgressUpdateCreatedResponseDTO,
  SupportUpdatedResponseDTO
} from '@modules/feature-modules/accessor/services/accessor.service';
import { UtilsHelper } from '@app/base/helpers';

@Component({
  selector: 'app-accessor-innovation-custom-notifications-wizard-custom-notification-delete-notifications-step',
  templateUrl: './notifications-step.component.html'
})
export class WizardInnovationCustomNotificationDeleteNotificationsStepComponent
  extends CoreComponent
  implements WizardStepComponentType<NotificationsStepInputType, NotificationsStepOutputType>, OnInit
{
  @Input() title = '';
  @Input() data: NotificationsStepInputType = {
    selectedInnovation: { innovationId: '', name: '', count: 0, subscriptions: [] },
    selectedNotifications: []
  };

  @Output() cancelEvent = new EventEmitter<WizardStepEventType<NotificationsStepOutputType>>();
  @Output() previousStepEvent = new EventEmitter<WizardStepEventType<NotificationsStepOutputType>>();
  @Output() nextStepEvent = new EventEmitter<WizardStepEventType<NotificationsStepOutputType>>();
  @Output() submitEvent = new EventEmitter<WizardStepEventType<NotificationsStepOutputType>>();

  errorMessage = `Select notifications to delete`;

  form = new FormGroup({
    notifications: new FormArray<FormControl<string>>([], [CustomValidators.requiredCheckboxArray(this.errorMessage)])
  });

  notificationsItems: Required<FormEngineParameterModel>['items'] = [];

  constructor(
    private datePipe: DatePipe,
    private pluralTranslatePipe: PluralTranslatePipe
  ) {
    super();

    this.setBackLink('Go back', this.onPreviousStep.bind(this));
  }

  ngOnInit() {
    // Add each notification as an option to select on the form
    this.notificationsItems.push(
      ...this.data.selectedInnovation.subscriptions!.map(subscription => {
        switch (subscription.eventType) {
          case NotificationEnum.SUPPORT_UPDATED:
          case NotificationEnum.PROGRESS_UPDATE_CREATED:
            return {
              value: subscription.id,
              label: `<span class="d-block nhsuk-u-margin-bottom-3">${UtilsHelper.getNotifyMeSubscriptionTitleText(subscription)}</span>${this.buildOrganisationsSelectedList(subscription)}`,
              description: `Last edited ${this.datePipe.transform(subscription.updatedAt, this.translate('app.date_formats.long_date'))}`
            };
          case NotificationEnum.INNOVATION_RECORD_UPDATED:
            return {
              value: subscription.id,
              label: `<span class="d-block nhsuk-u-margin-bottom-3">${UtilsHelper.getNotifyMeSubscriptionTitleText(subscription)}</span>${this.buildSectionsSelectedList(subscription)}`,
              description: `Last edited ${this.datePipe.transform(subscription.updatedAt, this.translate('app.date_formats.long_date'))}`
            };
          case NotificationEnum.REMINDER:
            return {
              value: subscription.id,
              label: `${UtilsHelper.getNotifyMeSubscriptionReminderText(subscription, this.datePipe)} ${subscription.customMessage}`,
              description: `Last edited ${this.datePipe.transform(subscription.updatedAt, this.translate('app.date_formats.long_date'))}`
            };
          default:
            return {
              value: '',
              label: ''
            };
        }
      }),
      ...(this.data.selectedInnovation.subscriptions!.length > 1
        ? [
            { value: 'SEPARATOR', label: 'SEPARATOR' },
            {
              value: 'ALL',
              label: 'All notifications',
              description: 'Delete all custom notifications for this innovation',
              exclusive: true
            }
          ]
        : [])
    );

    // Select the notifications previously selected by the user
    this.data.selectedNotifications.forEach(notification => {
      if (notification !== 'ALL') {
        (this.form.get('notifications') as FormArray).push(new FormControl<string>(notification.id));
      } else {
        (this.form.get('notifications') as FormArray).push(new FormControl<string>('ALL'));
      }
    });

    this.setPageTitle(this.title, { width: '2.thirds', size: 'l' });
    this.setPageStatus('READY');
  }

  prepareOutputData(): NotificationsStepOutputType {
    const selectedNotificationsIds = this.form.value.notifications;

    // Check if 'ALL' option if present
    const hasSelectedAllOption = selectedNotificationsIds?.includes('ALL');

    // Filter subscriptions based on selected ids
    let selectedNotifications: (GetNotifyMeInnovationSubscription | 'ALL')[] =
      this.data.selectedInnovation.subscriptions!.filter(subscription =>
        selectedNotificationsIds?.includes(subscription.id)
      );

    // Conditionally add 'ALL' option to the array
    selectedNotifications = hasSelectedAllOption ? [...selectedNotifications, 'ALL'] : selectedNotifications;

    return {
      selectedNotifications
    };
  }

  onPreviousStep(): void {
    this.previousStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  onNextStep(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError(
        `You have not selected any notifications to delete. If you do not want to delete any notifications go back.`,
        {
          itemsList: [{ title: this.errorMessage, fieldId: 'notifications' }],
          width: '2.thirds'
        }
      );

      this.form.markAllAsTouched();

      return;
    }

    this.nextStepEvent.emit({ isComplete: true, data: this.prepareOutputData() });
  }

  buildOrganisationsSelectedList(subscription: SupportUpdatedResponseDTO | ProgressUpdateCreatedResponseDTO): string {
    const organisationsSelectedString = this.translate(
      this.pluralTranslatePipe.transform(
        'features.accessor.custom_notifications.cards.organisations_selected',
        subscription.organisations.length
      )
    );

    let outputInnerHtml = `<span class="nhsuk-u-font-size-19 nhsuk-u-font-weight-bold">${organisationsSelectedString}:</span>`;

    outputInnerHtml += '<ul class="nhsuk-list nhsuk-u-font-size-19 nhsuk-u-margin-bottom-1">';

    const displayOrganisations = UtilsHelper.getNotifyMeSubscriptionOrganisationsText(subscription);

    displayOrganisations.forEach(orgName => {
      outputInnerHtml += `<li class="nhsuk-u-margin-0">${orgName}</li>`;
    });

    outputInnerHtml += `</ul>`;

    return outputInnerHtml;
  }

  buildSectionsSelectedList(subscription: NotifyMeResponseTypes[NotificationEnum.INNOVATION_RECORD_UPDATED]): string {
    const sectionsSelectedString = this.translate(
      this.pluralTranslatePipe.transform(
        'features.accessor.custom_notifications.cards.sections_selected',
        subscription.sections?.length
      )
    );

    let outputInnerHtml = `<span class="nhsuk-u-font-size-19 nhsuk-u-font-weight-bold">${sectionsSelectedString}:</span>`;

    outputInnerHtml += '<ul class="nhsuk-list nhsuk-u-font-size-19 nhsuk-u-margin-bottom-1">';

    const displaySections = UtilsHelper.getNotifyMeSubscriptionSectionsText(subscription, this.ctx.schema);

    displaySections.forEach(section => {
      outputInnerHtml += `<li class="nhsuk-u-margin-0">${section}</li>`;
    });

    outputInnerHtml += `</ul>`;
    return outputInnerHtml;
  }
}
