import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

import { EmailNotificationService } from '@modules/shared/services/email-notifications.service';

@Component({
  selector: 'shared-pages-account-email-notifications',
  templateUrl: './manage-email-notifications.component.html'
})

export class PageAccountEmailNotificationsComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' | 'assessment' = '';

  alert: AlertType = { type: null };

  notificationTypeList: { id: string; value: string; isSubscribed: boolean; }[] = [];

  constructor(
    private emailNotificationService: EmailNotificationService
  ) {

    super();
    this.setPageTitle('Email notifications');

  }

  ngOnInit(): void {

    const user = this.stores.authentication.getUserInfo();

    if (this.stores.authentication.isAccessorType()) {
      this.notificationTypeList = [
        { id: 'Action', value: 'Actions', isSubscribed: true },
        { id: 'Support_Status_Change', value: 'Support status changes', isSubscribed: true }
      ];
    }

    this.getUserPreference();

  }

  private getUserPreference(): void {
    this.emailNotificationService.getUserNotificationPreferences().subscribe(
      response => {

        this.notificationTypeList.forEach(notification => {
          response.forEach(result => {
            if (notification.id === result.id) {
              notification.isSubscribed = result.isSubscribed;
            }
          });
        });

        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch user notification preferences',
          message: 'Please, try again or contact us for further help'
        };
      }
    );
  }

  updatePreference(preferenceId: string, enabled: boolean): void {
    const preference = [{ id: preferenceId, isSubscribed: enabled }];
    this.updateUserPreferences(preference);
  }

  unsubscribeAllPreferences(): void {
    const preferences: { id: string; isSubscribed: boolean; }[] = [];

    this.notificationTypeList.forEach(notification => {
      preferences.push({ id: notification.id, isSubscribed: false });
    });

    this.updateUserPreferences(preferences);
  }

  private updateUserPreferences(preference: { id: string; isSubscribed: boolean; }[]): void {

    this.emailNotificationService.updateUserNotificationPreference(preference).subscribe(
      () => {
        this.getUserPreference();
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
