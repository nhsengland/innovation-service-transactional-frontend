import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import { EmailNotificationsPreferencesEnum, EmailNotificationsTypeEnum, NotificationsService } from '@modules/shared/services/notifications.service';


@Component({
  selector: 'shared-pages-account-email-notifications-list',
  templateUrl: './email-notifications-list.component.html'
})
export class PageAccountEmailNotificationsListComponent extends CoreComponent implements OnInit {

  notificationTypeList: { type: EmailNotificationsTypeEnum, preference: EmailNotificationsPreferencesEnum }[] = [];

  isAnySubscribed = true;

  constructor(
    private notificationsService: NotificationsService
  ) {

    super();
    this.setPageTitle('Email notifications');

  }

  ngOnInit(): void {

    this.getEmailNotificationTypes();

  }

  private getEmailNotificationTypes(): void {

    this.setPageStatus('LOADING');

    this.notificationsService.getEmailNotificationsPreferences().subscribe(
      response => {

        this.notificationTypeList = response.map(item => ({
          type: item.notificationType,
          preference: item.preference
        })).sort((a, b) => a.type.localeCompare(b.type)); // Sort by type.

        this.isAnySubscribed = this.notificationTypeList.some(item => item.preference !== EmailNotificationsPreferencesEnum.NEVER);

        this.setPageStatus('READY');

      }
    );
  }


  unsubscribeAllNotifications(): void {

    this.setPageStatus('LOADING');

    const body = [
      { notificationType: EmailNotificationsTypeEnum.ACTION, preference: EmailNotificationsPreferencesEnum.NEVER },
      { notificationType: EmailNotificationsTypeEnum.MESSAGE, preference: EmailNotificationsPreferencesEnum.NEVER },
      { notificationType: EmailNotificationsTypeEnum.SUPPORT, preference: EmailNotificationsPreferencesEnum.NEVER }
    ];

    this.notificationsService.updateEmailNotificationsPreferences(body).subscribe(
      () => {
        this.getEmailNotificationTypes();
        this.setAlertSuccess('Your notification preferences have been saved');
      },
      () => {
        this.setAlertError('An error occurred when updating your notification preferences. Please try again or contact us for further help');
      }
    );
  }

}
