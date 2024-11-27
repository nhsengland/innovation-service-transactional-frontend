import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import {
  EmailNotificationPreferencesDTO,
  NotificationPreferenceEnum,
  NotificationsService
} from '@modules/shared/services/notifications.service';
import { AuthenticationStore } from '@modules/stores';
import { UserContextType } from '@modules/stores/ctx/user/user.types';

@Component({
  selector: 'app-assessment-account-email-notifications-list',
  templateUrl: './email-notifications-list.component.html'
})
export class PageAccountEmailNotificationsListComponent extends CoreComponent implements OnInit {
  isAnyOn = false;
  hasMultipleRoles = false;
  currentRole: null | { id: string; description: string };
  displayName: string;

  currentUserContext: UserContextType['domainContext'];

  formPreferencesList: { value: string; cssClass: string; preference: string; title: string; description: string }[] =
    [];

  preferencesResponse: EmailNotificationPreferencesDTO;

  constructor(private notificationsService: NotificationsService) {
    super();

    this.setPageTitle('Email preferences');

    this.displayName = this.ctx.user.getDisplayName();

    this.currentUserContext = this.ctx.user.getUserContext();

    if (!this.currentUserContext) {
      this.currentRole = null;
    } else {
      this.currentRole = {
        id: this.currentUserContext.roleId,
        description: `${this.ctx.user.getRoleDescription(this.currentUserContext.type)}${
          this.ctx.user.isAccessorType() ? ` (${this.currentUserContext.organisationUnit?.name.trimEnd()})` : ''
        }`
      };
    }

    this.preferencesResponse = {};
  }

  ngOnInit(): void {
    this.getEmailNotificationTypes();
  }

  private getEmailNotificationTypes(): void {
    this.setPageStatus('LOADING');

    this.notificationsService.getEmailNotificationsPreferences().subscribe(response => {
      this.isAnyOn = Object.values(response).some(item => item === NotificationPreferenceEnum.YES);

      this.formPreferencesList = Object.keys(response).map(category => ({
        value: category,
        preference: this.getCategoryToggleInfo(response[category]).status,
        cssClass: this.getCategoryToggleInfo(response[category]).cssClass,
        title: this.getCategoryMessages(category).title,
        description: this.getCategoryMessages(category).description
      }));

      this.preferencesResponse = response;

      this.setPageStatus('READY');
    });
  }

  unsubscribeAllNotifications(): void {
    this.setPageStatus('LOADING');

    const body: { preferences: EmailNotificationPreferencesDTO } = { preferences: {} };

    Object.keys(this.preferencesResponse).forEach(key => {
      body.preferences[key] = this.isAnyOn ? NotificationPreferenceEnum.NO : NotificationPreferenceEnum.YES;
    });

    this.notificationsService.updateEmailNotificationsPreferences(body).subscribe({
      next: () => {
        this.getEmailNotificationTypes();
      },
      complete: () => {
        this.setAlertSuccess('Your email preferences have been updated');
      },
      error: () => {
        this.setAlertError(
          'An error occurred when updating your notification preferences. Please try again or contact us for further help'
        );
      }
    });
  }

  private getCategoryMessages(category: string): { title: string; description: string } {
    const role = this.currentUserContext?.type;

    if (this.translationExists('shared.catalog.innovation.email_notification_preferences.' + category + '.' + role)) {
      return {
        title: this.translate(
          'shared.catalog.innovation.email_notification_preferences.' + category + '.' + role + '.title'
        ),
        description: this.translate(
          'shared.catalog.innovation.email_notification_preferences.' + category + '.' + role + '.description'
        )
      };
    } else {
      return {
        title: this.translate('shared.catalog.innovation.email_notification_preferences.' + category + '.SHARED.title'),
        description: this.translate(
          'shared.catalog.innovation.email_notification_preferences.' + category + '.SHARED.description'
        )
      };
    }
  }

  private getCategoryToggleInfo(status: string): { cssClass: string; status: string } {
    if (status === 'YES') {
      return { cssClass: 'nhsuk-tag--green', status: 'On' };
    } else {
      return { cssClass: 'nhsuk-tag--grey', status: 'Off' };
    }
  }
}
