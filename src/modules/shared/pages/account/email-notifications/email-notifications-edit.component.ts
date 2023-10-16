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
export class PageAccountEmailNotificationsEditComponent extends CoreComponent implements OnInit {

//   notificationType: EmailNotificationsTypeEnum;
  notificationListLink: string;

//   notificationPreferences: { question: string, items: { value: string, label: string }[] };

// Flags
isAssessmentType: boolean;
isQualifyingAccessorRole: boolean;


//   form = new FormGroup({
//     notificationPreference: new UntypedFormControl('', {})
//   }, { updateOn: 'blur' });
formPreferencesList: { value: string, label: string, description: string }[] = [];
selectedPreferences: { "notificationType": AssessmentEmailNotificationsTypeEnum, "preference": boolean }[] = [];
preferencesMessages: {[preference: string]: {title: string, description: string}};

mockedResponse: { [preference: string]: boolean }

form = new FormGroup({
    preferencesEnabled: new FormArray<FormControl<string>>([], { updateOn: 'change' }),
  }, { updateOn: 'blur' });

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationsService: NotificationsService,
  ) {

    super();

    // this.notificationType = this.activatedRoute.snapshot.params.notificationType;
    this.notificationListLink = `/${this.stores.authentication.userUrlBasePath()}/account/email-notifications`;

    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

    // this.notificationPreferences = {
    //   question: `How often do you want to get email notifications about ${this.translate(`shared.catalog.innovation.notification_context_types.${this.notificationType}.title.plural`).toLowerCase()}?`,
    //   items: Object.values(EmailNotificationsPreferencesEnum).map(key => ({ value: key, label: this.translate(`shared.catalog.innovation.email_notification_preferences.${key}.me`) }))
    // };


    this.setPageTitle('Select the email notifications you want to receive',  { width: '2.thirds', size: 'l' });
    this.setBackLink('Go back')

    this.mockedResponse = {
        'RECORD': true,
        'TASKS': false,
        'MESSAGES': false,
        'MANAGEMENT': true,
        'ASSIGNED': false
       }
  

    this.preferencesMessages ={
        // Shared
        RECORD: {
          title: 'Innovator submits innovation record',
          description: 'Get notified when an innovation is submitted for needs assessment.',
        },
        TASKS: {
          title: 'Tasks',
          description: 'Get notified when an innovator completes or declines tasks you have assign to them.',
        },
        MESSAGES: {
          title: 'Messages',
          description: 'Get notified about new messages and replies.',
        },
        INNOVATION_MANAGEMENT: {
          title: 'Innovation management',
          description: 'Get notified when an innovation is withdrawn or if an innovator stops sharing their innovation during the needs assessment process.',
        },
        ASSIGNED: {
          title: 'Assigned needs assessor',
          description: 'Get notified if you are assigned as a needs assessor to an innovation, or if a new assessor is assigned and you are no the longer assessor.',
        },
        // A/QA
        IR_EXPORT_REQUESTS: {
          title: 'Innovation record export requests',
          description: 'Get notified when a innovator accepts or rejects your request to export their innovation record.',
        },
        YOUR_ACCOUNT: {
          title: 'Your account',
          description: 'Get notified when a user is removed or added to your organisation unit.',
        },
        REMINDERS: {
          title: 'Reminders',
          description: 'Get notified with reminders for you to interact with innovations you are supporting.'
        },
        // QA
        SUGGESTIONS_TO_SUPPORT: {
          title: 'Suggestions to support',
          description: 'Get notified when your organisation is suggested to support an innovation.'
        },
        // Innovator
        SUPPORT_STATUS_AND_UPDATES: {
          title: 'Support status and updates',
          description: 'Get notified about updates to your support status and support summary.'
        },
        TASKS_TO_DO: {
          title: 'Tasks to do',
          description: 'Get notified when a task is assigned to you, reopened or cancelled.'
        },
        DOCUMENTS: {
          title: 'Documents',
          description: 'Get notified when a support organisation uploads a document for you.'
        },
        SYSTEM_REMINDERS: {
          title: 'System reminders',
          description: 'Get notified when your innovation record is incomplete or when your innovation is not receiving support.'
        },
        // Needs assessment
        INNOVATOR_SUBMIT_IR: {
          title: 'Innovator submits innovation record',
          description: 'Get notified when an innovation is submitted for needs assessment. '
        },
        ASSIGN_NA: {
          title: 'Assigned needs assessor',
          description: 'Get notified if you are assigned as a needs assessor to an innovation, or if a new assessor is assigned and you are no the longer assessor.'
        }
    };

  }

  ngOnInit(): void {


    // Object.entries(this.mockedResponse).filter((item) => item[1] === true)
    // .map((item) => (this.form.get('preferencesEnabled') as FormArray).push(new FormControl<string>(item[0])));

    this.formPreferencesList = Object.keys(this.mockedResponse).map((preference) => ({ value: preference, label: this.preferencesMessages[preference].title, description: this.preferencesMessages[preference].description }))

    console.log('formPreferencesList: ')
    console.log(this.formPreferencesList)


    // this.notificationsService.getEmailNotificationsPreferences().subscribe(response => {

    //   Object.entries(response)
    //     .filter((item) => item[1] === true)
    //     .map((item) => (this.form.get('preferencesEnabled') as FormArray).push(new FormControl<string>(item[0])));

    //   this.setPageStatus('READY');

    // });

  }


  onSubmit(): void {
    console.log('preferences enabled: ')
    console.log(this.form.get('preferencesEnabled')?.value);


    const body: { [preference: string]: boolean } = {};
    Object.keys(this.mockedResponse).forEach(value => {
            body[value] = (this.form.get('preferencesEnabled')?.value)?.includes(value) ? true : false
    });

    console.log("body: ");
    console.log(body);

    this.setRedirectAlertSuccess('Your notification preference has been saved');
    this.redirectTo(this.notificationListLink, { alert: 'editSuccess' })
    

    this.notificationsService.updateEmailNotificationsPreferences(
      body
    ).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your notification preference has been saved');
        this.redirectTo(this.notificationListLink, { alert: 'editSuccess' })
      },
      error: () => {
        this.setAlertError('An error occurred when updating your notification preferences. Please try again or contact us for further help');
        this.redirectTo(this.notificationListLink, { alert: 'editError' })
      }
    });


  }

}
