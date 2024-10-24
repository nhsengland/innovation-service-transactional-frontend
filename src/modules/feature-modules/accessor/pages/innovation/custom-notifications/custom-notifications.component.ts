import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';
import {
  AccessorService,
  GetNotifyMeInnovationSubscription,
  NotificationEnum
} from '@modules/feature-modules/accessor/services/accessor.service';
import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'app-accessor-pages-innovation-custom-notifications',
  templateUrl: './custom-notifications.component.html'
})
export class InnovationCustomNotificationsComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;

  subscriptionsList: (GetNotifyMeInnovationSubscription & {
    displayTitle?: string;
    displayOrganisations?: string[];
    displaySections?: string[];
    displayReminder?: string;
  })[] = [];

  constructor(
    private accessorService: AccessorService,
    private datePipe: DatePipe
  ) {
    super();

    this.innovation = this.stores.other.innovation();

    this.setPageTitle('Custom notifications');
  }

  ngOnInit() {
    this.accessorService.getNotifyMeInnovationSubscriptionsList(this.innovation.id).subscribe({
      next: response => {
        this.subscriptionsList = response.map(subscription => {
          // Determine whether to add displayOrganisations based on eventType
          const displayOrganisations =
            subscription.eventType === NotificationEnum.SUPPORT_UPDATED ||
            subscription.eventType === NotificationEnum.PROGRESS_UPDATE_CREATED
              ? UtilsHelper.getNotifyMeSubscriptionOrganisationsText(subscription)
              : undefined;

          const displaySections =
            subscription.eventType === NotificationEnum.INNOVATION_RECORD_UPDATED
              ? UtilsHelper.getNotifyMeSubscriptionSectionsText(subscription, this.stores.schema)
              : undefined;

          const displayReminder =
            subscription.eventType === NotificationEnum.REMINDER
              ? UtilsHelper.getNotifyMeSubscriptionReminderText(subscription, this.datePipe)
              : undefined;

          return {
            ...subscription,
            displayTitle: UtilsHelper.getNotifyMeSubscriptionTitleText(subscription),
            displayOrganisations: displayOrganisations,
            displaySections: displaySections,
            displayReminder: displayReminder
          };
        });
        this.setPageStatus('READY');
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('ERROR');
      }
    });
  }

  getInnovationRecordUpdateSectionsCardLabel(
    subscription: GetNotifyMeInnovationSubscription & {
      displaySections?: string[];
    }
  ): string {
    subscription.displaySections;
    if (
      subscription?.displaySections &&
      subscription?.displaySections.length === 1 &&
      subscription?.displaySections[0] !== 'All sections'
    ) {
      return 'Section';
    } else {
      return 'Sections';
    }
  }
}
