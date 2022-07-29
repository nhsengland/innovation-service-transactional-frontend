import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { EmailNotificationsTypeEnum, EmailNotificationsPreferencesEnum, NotificationsService } from '@modules/shared/services/notifications.service';


@Component({
  selector: 'shared-pages-account-email-notifications-list',
  templateUrl: './email-notifications-list.component.html'
})
export class PageAccountEmailNotificationsListComponent extends CoreComponent implements OnInit {

  notificationTypeList: { type: EmailNotificationsTypeEnum, preference: EmailNotificationsPreferencesEnum }[] = [];

  isAnySubscribed = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {

    super();
    this.setPageTitle('Email notifications');

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'editSuccess':
        this.setAlertSuccess('Your notification preference has been saved');
        break;
      case 'editError':
        this.setAlertError('An error occurred when updating your notification preferences', 'Please try again or contact us for further help');
        break;
      default:
        break;
    }

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
        }));

        this.isAnySubscribed = this.notificationTypeList.some(item => item.preference !== EmailNotificationsPreferencesEnum.NEVER);

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertDataLoadError();
      }
    );
  }


  unsubscribeAllNotifications(): void {

    this.setPageStatus('LOADING');

    const body = [
      { notificationType: EmailNotificationsTypeEnum.ACTION, preference: EmailNotificationsPreferencesEnum.NEVER },
      { notificationType: EmailNotificationsTypeEnum.COMMENT, preference: EmailNotificationsPreferencesEnum.NEVER },
      { notificationType: EmailNotificationsTypeEnum.SUPPORT, preference: EmailNotificationsPreferencesEnum.NEVER }
    ];

    this.notificationsService.updateEmailNotificationsPreferences(body).subscribe(
      () => {
        this.getEmailNotificationTypes();
        this.setAlertSuccess('Your notification preferences have been saved');
      },
      () => {
        this.setAlertError('An error occurred when updating your notification preferences', 'Please try again or contact us for further help');
      }
    );
  }

}
