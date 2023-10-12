import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';

import { EmailNotificationsTypeEnum, EmailNotificationsPreferencesEnum, NotificationsService, AssessmentEmailNotificationsTypeEnum } from '@modules/shared/services/notifications.service';


@Component({
  selector: 'shared-pages-account-email-notifications-edit',
  templateUrl: './email-notifications-edit.component.html'
})
export class AssessmentPageAccountEmailNotificationsEditComponent extends CoreComponent implements OnInit {

//   notificationType: EmailNotificationsTypeEnum;
//   notificationListLink: string;

//   notificationPreferences: { question: string, items: { value: string, label: string }[] };


//   form = new FormGroup({
//     notificationPreference: new UntypedFormControl('', {})
//   }, { updateOn: 'blur' });
formPreferencesList: { value: string, label: string, description: string }[] = [];
selectedPreferences: { "notificationType": AssessmentEmailNotificationsTypeEnum, "preference": boolean }[] = [];
preferencesMessages: {[preference: string]: {title: string, description: string}};

form = new FormGroup({
    preferencesEnabled: new FormArray<FormControl<string>>([], { updateOn: 'change' }),
  }, { updateOn: 'blur' });

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {

    super();

    // this.notificationType = this.activatedRoute.snapshot.params.notificationType;
    // this.notificationListLink = `/${this.stores.authentication.userUrlBasePath()}/account/email-notifications`;

    // this.notificationPreferences = {
    //   question: `How often do you want to get email notifications about ${this.translate(`shared.catalog.innovation.notification_context_types.${this.notificationType}.title.plural`).toLowerCase()}?`,
    //   items: Object.values(EmailNotificationsPreferencesEnum).map(key => ({ value: key, label: this.translate(`shared.catalog.innovation.email_notification_preferences.${key}.me`) }))
    // };

    this.setPageTitle('Select the email notifications you want to turn off to stop receiving them',  { width: '2.thirds', size: 'l' });
    this.setBackLink('Go back')

    this.preferencesMessages ={
        'RECORD' : {
            title: 'Innovator submits innovation record',
            description: 'Get notified when an innovation is submitted for needs assessment.',
        },
        'TASKS' : {
            title: 'Tasks',
            description: 'Get notified when an innovator completes or declines tasks you have assign to them.',
        },
        'MESSAGES' : {
            title: 'Messages',
            description: 'Get notified about new messages and replies.',
        },
        'MANAGEMENT' : {
            title: 'Innovation management',
            description: 'Get notified when an innovation is withdrawn or if an innovator stops sharing their innovation during the needs assessment process.',
        },
        'ASSIGNED' : {
            title: 'Assigned needs assessor',
            description: 'Get notified if you are assigned as a needs assessor to an innovation, or if a new assessor is assigned and you are no the longer assessor.',
        },
    };

  }

  ngOnInit(): void {

    console.log('')
    
    // const MockedResponse = [
    //     {
    //         "notificationType": AssessmentEmailNotificationsTypeEnum.RECORD,
    //         "preference": true
    //     },
    //     {
    //         "notificationType": AssessmentEmailNotificationsTypeEnum.TASKS,
    //         "preference": false
    //     },
    //     {
    //         "notificationType": AssessmentEmailNotificationsTypeEnum.MESSAGES,
    //         "preference": false
    //     },
    //     {
    //         "notificationType": AssessmentEmailNotificationsTypeEnum.MANAGEMENT,
    //         "preference": true
    //     },
    //     {
    //         "notificationType": AssessmentEmailNotificationsTypeEnum.ASSIGNED,
    //         "preference": false
    //     },
    // ]

    const MockedResponse = {
        'RECORD': true,
        'TASKS': false,
        'MESSAGES': false,
        'MANAGEMENT': true,
        'ASSIGNED': false
       }

    Object.entries(MockedResponse).filter((item) => item[1] === true)
    .map((item) => (this.form.get('preferencesEnabled') as FormArray).push(new FormControl<string>(item[0])));

    this.formPreferencesList = Object.keys(MockedResponse).map((preference) => ({ value: preference, label: this.preferencesMessages[preference].title, description: this.preferencesMessages[preference].description }))

    console.log('formPreferencesList: ')
    console.log(this.formPreferencesList)


    // if (!Object.values(EmailNotificationsTypeEnum).includes(this.notificationType)) {
    //   this.redirectTo('not-found');
    // }


    // this.notificationsService.getEmailNotificationsPreferences().subscribe(response => {

    //   const emailNotification = response.find(item => item.notificationType === this.notificationType);

    //   this.form.get('notificationPreference')!.setValue(emailNotification?.preference);

      this.setPageStatus('READY');

  }


  onSubmit(): void {
    console.log('preferences enabled: ')
    console.log(this.form.get('preferencesEnabled')?.value);

    this.selectedPreferences

    const body = {
        preferences: this.formPreferencesList.map(item => ({
            notificationType: item.value,
            preference: (this.form.get('preferencesEnabled')?.value)?.includes(item.value) ? true : false
        }))
    }



    console.log("body: ");
    console.log(body);
    // if (!this.form.valid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    // this.notificationsService.updateEmailNotificationsPreferences(
    //   [{ notificationType: this.notificationType, preference: this.form.get('notificationPreference')!.value }]
    // ).subscribe({
    //   next: () => {
    //     this.setRedirectAlertSuccess('Your notification preference has been saved');
    //     this.redirectTo(this.notificationListLink, { alert: 'editSuccess' })
    //   },
    //   error: () => {
    //     this.setAlertError('An error occurred when updating your notification preferences. Please try again or contact us for further help');
    //     // this.redirectTo(this.notificationListLink, { alert: 'editError' })
    //   }
    // });

  }

}
