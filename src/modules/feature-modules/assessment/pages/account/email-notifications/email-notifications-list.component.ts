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

@Component({
  selector: 'app-assessment-account-email-notifications-list',
  templateUrl: './email-notifications-list.component.html'
})
export class AssessmentPageAccountEmailNotificationsListComponent extends CoreComponent implements OnInit {

  notificationTypeList: { type: AssessmentEmailNotificationsTypeEnum, preference: EmailNotificationsPreferencesEnum }[] = [];

  isAnySubscribed = true;

  hasMultipleRoles = false;
  currentRole: null | { id: string, description: string };
  displayName: string;

  notificationsCategories: string[] = [
    AssessmentEmailNotificationsTypeEnum.RECORD,
    AssessmentEmailNotificationsTypeEnum.TASKS,
    AssessmentEmailNotificationsTypeEnum.MESSAGES,
    AssessmentEmailNotificationsTypeEnum.MANAGEMENT,
    AssessmentEmailNotificationsTypeEnum.ASSIGNED
  ]

  formPreferencesList: { value: string, label: string, description: string }[] = [];
  // mockedResponse: { "notificationType": AssessmentEmailNotificationsTypeEnum, "preference": boolean }[]
  mockedResponse: { [preference: string]: boolean }

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
      'RECORD': true,
      'TASKS': false,
      'MESSAGES': false,
      'MANAGEMENT': true,
      'ASSIGNED': false
     }


  }

  ngOnInit(): void {


    this.getEmailNotificationTypes();
    this.checkMultipleRoles();
    
    console.log(this.checkIsOn('MESSAGES'));
    
    this.setPageStatus('READY')

  }

  private getEmailNotificationTypes(): void {

    this.setPageStatus('LOADING');

    // this.notificationsService.getEmailNotificationsPreferences().subscribe(
    //   response => {

    //     this.notificationTypeList = response.map(item => ({
    //       type: item.notificationType,
    //       preference: item.preference
    //     })).sort((a, b) => a.type.localeCompare(b.type)); // Sort by type.

    //     this.isAnySubscribed = this.notificationTypeList.some(item => item.preference !== EmailNotificationsPreferencesEnum.NEVER);

    //     this.setPageStatus('READY');

    //   }
    // );
  }

  private checkMultipleRoles(): void {

    this.setPageStatus('LOADING');

    const user = this.authenticationStore.getUserInfo();

    this.hasMultipleRoles = user.roles.length > 1;

    
  }

  checkIsOn(notificationType: string): boolean {
    // let index = this.mockedResponse.map(item => item.notificationType.toString()).indexOf(notificationType);
    // return this.mockedResponse[index].preference;
    return false
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
