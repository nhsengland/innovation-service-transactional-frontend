import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';

import { EMAIL_NOTIFICATION_TYPE, NotificationsService } from '@modules/shared/services/notifications.service';

export type EmailNotificationType = {
  id: string;
  title: string;
  isSubscribed: boolean;
};

@Component({
  selector: 'shared-pages-account-email-notifications',
  templateUrl: './email-notifications.component.html'
})

export class PageAccountEmailNotificationsComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';

  alert: AlertType = { type: null };

  notificationTypeList: EmailNotificationType[] = [];

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
        const notificationTypes = Object.entries(EMAIL_NOTIFICATION_TYPE).map(([key, item]) => (
          { id: key, title: item.title }
        ));
        const applicableTypes = notificationTypes.filter(n => response.find(r => r.id === n.id));

        this.notificationTypeList = [];

        applicableTypes.forEach(item => {
          const notificationType: EmailNotificationType = {
            id: item.id,
            title: item.title,
            isSubscribed: response.find(r => r.id === item.id)?.isSubscribed!
          };
          this.notificationTypeList.push(notificationType);
        });

        this.isAnySubscribed = this.notificationTypeList.some(n => n.isSubscribed);

        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch email notifications',
          message: 'Please, try again or contact us for further help'
        };
      }
    );
  }

  updateNotificationPreference(notificationType: string, isSubscribed: boolean): void {
    const preference = [{ notificationType, isSubscribed }];
    this.updateNotificationPreferences(preference);
  }

  unsubscribeAllNotifications(): void {
    const preferences: { notificationType: string; isSubscribed: boolean; }[] = [];

    this.notificationTypeList.forEach(notification => {
      preferences.push({ notificationType: notification.id, isSubscribed: false });
    });

    this.updateNotificationPreferences(preferences);
  }

  private updateNotificationPreferences(preference: { notificationType: string; isSubscribed: boolean; }[]): void {

    this.notificationsService.updateEmailNotificationsPreferences(preference).subscribe(
      () => {
        this.getEmailNotificationTypes();
        this.alert = {
          type: 'SUCCESS',
          title: 'Your notification preference has been saved'
        };
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when updating notification preference',
          message: 'Please try again or contact us for further help'
        };
      }
    );
  }
}
