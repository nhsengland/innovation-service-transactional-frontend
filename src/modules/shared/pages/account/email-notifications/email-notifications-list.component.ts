import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import { EmailNotificationsPreferencesEnum, EmailNotificationsTypeEnum, NotificationsService } from '@modules/shared/services/notifications.service';
import { AuthenticationStore } from '@modules/stores';


@Component({
  selector: 'shared-pages-account-email-notifications-list',
  templateUrl: './email-notifications-list.component.html'
})
export class PageAccountEmailNotificationsListComponent extends CoreComponent implements OnInit {

  notificationTypeList: { type: EmailNotificationsTypeEnum, preference: EmailNotificationsPreferencesEnum }[] = [];

  isAnySubscribed = true;

  hasMultipleRoles = false;
  currentRole: null | { id: string, description: string };
  displayName: string;

  constructor(
    private notificationsService: NotificationsService,
    private authenticationStore: AuthenticationStore
  ) {

    super();
    this.setPageTitle('Email notifications');

    this.displayName = this.authenticationStore.getUserInfo().displayName;

    const currentUserContext = this.authenticationStore.getUserContextInfo();

    if (!currentUserContext) { this.currentRole = null; }
    else {
      this.currentRole = {
        id: currentUserContext.roleId,
        description: `${this.authenticationStore.getRoleDescription(currentUserContext.type)}${this.authenticationStore.isAccessorType() ? ` (${currentUserContext.organisationUnit?.name.trimEnd()})` : ''}`
      };
    }

  }

  ngOnInit(): void {

    this.getEmailNotificationTypes();
    this.checkMultipleRoles();

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

  private checkMultipleRoles(): void {

    this.setPageStatus('LOADING');

    const user = this.authenticationStore.getUserInfo();

    this.hasMultipleRoles = user.roles.length > 1;

  }


  unsubscribeAllNotifications(): void {

    this.setPageStatus('LOADING');

    const body = [
      { notificationType: EmailNotificationsTypeEnum.TASK, preference: EmailNotificationsPreferencesEnum.NEVER },
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
