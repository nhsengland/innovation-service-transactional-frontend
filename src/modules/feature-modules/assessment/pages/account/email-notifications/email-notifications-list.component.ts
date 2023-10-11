import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import { AssessmentEmailNotificationsTypeEnum, EmailNotificationsPreferencesEnum, EmailNotificationsTypeEnum, NotificationsService } from '@modules/shared/services/notifications.service';
import { AuthenticationStore } from '@modules/stores';


export type Preferences = {
  AssessmentEmailNotificationsTypeEnum: {}
} ;

export type CategoryMessages = {
  [category: string] : { 
    title: string, 
    label: string 
  }
};

export type MockedResponse = {
  [category: string] : boolean
};

@Component({
  selector: 'app-assessment-account-email-notifications-list',
  templateUrl: './email-notifications-list.component.html'
})
export class AssessmentPageAccountEmailNotificationsListComponent extends CoreComponent implements OnInit {

  notificationTypeList: { type: EmailNotificationsTypeEnum, preference: EmailNotificationsPreferencesEnum }[] = [];

  isAnySubscribed = true;

  hasMultipleRoles = false;
  currentRole: null | { id: string, description: string };
  displayName: string;

  notificationsCategories: string[] = [
    AssessmentEmailNotificationsTypeEnum.RECORD.toString(),
    AssessmentEmailNotificationsTypeEnum.TASKS.toString(),
    AssessmentEmailNotificationsTypeEnum.MESSAGES.toString(),
    AssessmentEmailNotificationsTypeEnum.MANAGEMENT.toString(),
    AssessmentEmailNotificationsTypeEnum.ASSIGNED.toString()
  ]

  preferencesMessages: CategoryMessages;
  mockedResponse : MockedResponse;

  constructor(
    private notificationsService: NotificationsService,
    private authenticationStore: AuthenticationStore
  ) {

    super();
    this.setPageTitle('Email notifications preferences');

    this.displayName = this.authenticationStore.getUserInfo().displayName;

    const currentUserContext = this.authenticationStore.getUserContextInfo();

    if (!currentUserContext) { this.currentRole = null; }
    else {
      this.currentRole = {
        id: currentUserContext.roleId,
        description: `${this.authenticationStore.getRoleDescription(currentUserContext.type)}${this.authenticationStore.isAccessorType() ? ` (${currentUserContext.organisationUnit?.name.trimEnd()})` : ''}`
      };
    }

    this.mockedResponse = {
      'RECORD' : true,
      'TASKS' : false,
      'MESSAGES' : false,
      'MANAGEMENT' : true,
      'ASSIGNED' : true,
    }

    this.preferencesMessages = {
      'RECORD' : {
        title: 'Innovator submits innovation record',
        label: 'Get notified when an innovation is submitted for needs assessment.',
      },
      'TASKS' : {
        title: 'Tasks',
        label: 'Get notified when an innovator completes or declines tasks you have assign to them.',
      },
      'MESSAGES' : {
        title: 'Messages',
        label: 'Get notified about new messages and replies.',
      },
      'MANAGEMENT' : {
        title: 'Innovation management',
        label: 'Get notified when an innovation is withdrawn or if an innovator stops sharing their innovation during the needs assessment process.',
      },
      'ASSIGNED' : {
        title: 'Assigned needs assessor',
        label: 'Get notified if you are assigned as a needs assessor to an innovation, or if a new assessor is assigned and you are no the longer assessor.',
      },
    };

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
      { notificationType: AssessmentEmailNotificationsTypeEnum.RECORD, preference: false },
      { notificationType: AssessmentEmailNotificationsTypeEnum.TASKS, preference: false },
      { notificationType: AssessmentEmailNotificationsTypeEnum.MESSAGES, preference: false },
      { notificationType: AssessmentEmailNotificationsTypeEnum.MANAGEMENT, preference: false },
      { notificationType: AssessmentEmailNotificationsTypeEnum.ASSIGNED, preference: false },
    ];

    this.notificationsService.updateAssessmentEmailNotificationsPreferences(body).subscribe({
      next: () => {
        this.getEmailNotificationTypes();
      },
      complete: () => {
        this.setAlertSuccess('Your notification preferences have been saved');
      },
      error: () => {
        this.setAlertError('An error occurred when updating your notification preferences. Please try again or contact us for further help');
      }
    });
  }

}
