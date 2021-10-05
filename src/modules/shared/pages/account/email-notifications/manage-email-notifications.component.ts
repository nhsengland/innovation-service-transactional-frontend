import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute,
    private emailNotificationService: EmailNotificationService
  ) {

    super();
    this.setPageTitle('Email notifications');

    this.module = this.activatedRoute.snapshot.data.module;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'accountDetailsUpdateSuccess':
        this.alert = {
          type: 'WARNING',
          title: 'Your information has been saved'
        };
        break;
      case 'accountDetailsUpdateError':
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when creating an action',
          message: 'Please try again or contact us for further help'
        };
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {

    const user = this.stores.authentication.getUserInfo();

    if (this.stores.authentication.isAccessorType()) {

      this.notificationTypeList = [
        { id: 'Action', value: 'Actions', isSubscribed: true },
        { id: 'Support_Status_Change', value: 'Support status changes', isSubscribed: true }
      ];

    }

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
    const body = { id: preferenceId, isSubscribed: enabled };
    this.emailNotificationService.updateUserNotificationPreference(body);
  }
}
