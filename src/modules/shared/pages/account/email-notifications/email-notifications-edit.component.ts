import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators } from '@app/base/forms';

import { EmailNotificationsTypeEnum, EmailNotificationsPreferencesEnum, NotificationsService } from '@modules/shared/services/notifications.service';


@Component({
  selector: 'shared-pages-account-email-notifications-edit',
  templateUrl: './email-notifications-edit.component.html'
})
export class PageAccountEmailNotificationsEditComponent extends CoreComponent implements OnInit {

  notificationType: EmailNotificationsTypeEnum;
  notificationListLink: string;

  notificationPreferences: { question: string, items: { value: string, label: string }[] };


  form = new FormGroup({
    notificationPreference: new FormControl('', { validators: CustomValidators.required('Choose at least one section') })
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {

    super();
    this.setPageTitle('Edit email notifications');

    this.notificationType = this.activatedRoute.snapshot.params.notificationType;
    this.notificationListLink = `/${this.stores.authentication.userUrlBasePath()}/account/email-notifications`;

    this.notificationPreferences = {
      question: `How often do you want to get email notifications about ${this.translate(`shared.catalog.innovation.notification_context_types.${this.notificationType}.title.plural`).toLowerCase()}?`,
      items: Object.values(EmailNotificationsPreferencesEnum).map(key => ({ value: key, label: this.translate(`shared.catalog.innovation.email_notification_preferences.${key}.me`) }))
    };

  }

  ngOnInit(): void {

    if (!Object.values(EmailNotificationsTypeEnum).includes(this.notificationType)) {
      this.redirectTo('not-found');
    }


    this.notificationsService.getEmailNotificationsPreferences().subscribe(
      response => {

        const emailNotification = response.find(item => item.notificationType === this.notificationType);

        this.form.get('notificationPreference')!.setValue(emailNotification?.preference);

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertDataLoadError();
      }
    );

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.notificationsService.updateEmailNotificationsPreferences(
      [{ notificationType: this.notificationType, preference: this.form.get('notificationPreference')!.value }]
    ).subscribe(
      () => this.redirectTo(this.notificationListLink, { alert: 'editSuccess' }),
      () => this.redirectTo(this.notificationListLink, { alert: 'editError' })
    );

  }

}
