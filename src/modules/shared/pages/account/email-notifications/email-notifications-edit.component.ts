import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';

import {
  EmailNotificationPreferencesDTO,
  NotificationPreferenceEnum,
  NotificationsService
} from '@modules/shared/services/notifications.service';
import { UserContextType } from '@modules/stores/ctx/user/user.types';

@Component({
  selector: 'shared-pages-account-email-notifications-edit',
  templateUrl: './email-notifications-edit.component.html'
})
export class PageAccountEmailNotificationsEditComponent extends CoreComponent implements OnInit {
  notificationListLink: string;

  currentUserContext: UserContextType['domainContext'];

  formPreferencesList: { value: string; label: string; description: string }[] = [];
  preferencesResponse: EmailNotificationPreferencesDTO = {};

  form = new FormGroup(
    {
      preferencesEnabled: new FormArray<FormControl<string>>([], { updateOn: 'change' })
    },
    { updateOn: 'blur' }
  );

  constructor(private notificationsService: NotificationsService) {
    super();

    this.notificationListLink = `/${this.ctx.user.userUrlBasePath()}/account/email-notifications`;

    this.currentUserContext = this.ctx.user.getUserContext();

    this.setPageTitle('Select the email notifications you want to receive', { width: '2.thirds', size: 'l' });

    this.setBackLink('Go back');
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    this.notificationsService.getEmailNotificationsPreferences().subscribe(response => {
      Object.entries(response)
        .filter(item => item[1] === NotificationPreferenceEnum.YES)
        .forEach(item => (this.form.get('preferencesEnabled') as FormArray).push(new FormControl<string>(item[0])));

      this.preferencesResponse = response;

      this.formPreferencesList = Object.keys(response).map(category => ({
        value: category,
        label: this.getCategoryMessages(category).title,
        description: this.getCategoryMessages(category).description
      }));

      this.setPageStatus('READY');
    });
  }

  onSubmit(): void {
    const body: { preferences: EmailNotificationPreferencesDTO } = { preferences: {} };

    Object.keys(this.preferencesResponse).forEach(value => {
      body.preferences[value] = this.form.get('preferencesEnabled')?.value?.includes(value)
        ? NotificationPreferenceEnum.YES
        : NotificationPreferenceEnum.NO;
    });

    this.notificationsService.updateEmailNotificationsPreferences(body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your email preferences have been updated');
        this.redirectTo(this.notificationListLink, { alert: 'editSuccess' });
      },
      error: () => {
        this.setAlertError(
          'An error occurred when updating your notification preferences. Please try again or contact us for further help'
        );
        this.redirectTo(this.notificationListLink, { alert: 'editError' });
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
}
