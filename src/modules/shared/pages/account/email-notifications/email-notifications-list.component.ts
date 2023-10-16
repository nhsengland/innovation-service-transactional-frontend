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
export class PageAccountEmailNotificationsListComponent extends CoreComponent implements OnInit {

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
  mockedResponse: { [preference: string]: boolean }
  preferencesReponse: { [preference: string]: boolean }


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
     };
     
     this.preferencesReponse = {};


  }

  ngOnInit(): void {

    this.getEmailNotificationTypes();
    this.checkMultipleRoles(); 

  }

  private getEmailNotificationTypes(): void {

    this.setPageStatus('LOADING');

    this.preferencesReponse = this.mockedResponse;

    // this.notificationsService.getEmailNotificationsPreferences().subscribe(
    //   response => {

    //     this.preferencesReponse = response

    //     this.setPageStatus('READY');

    //   }
    // );

    this.setPageStatus('READY')
  }

  private checkMultipleRoles(): void {

    this.setPageStatus('LOADING');

    const user = this.authenticationStore.getUserInfo();

    this.hasMultipleRoles = user.roles.length > 1;

    this.setPageStatus('READY');
  }

  unsubscribeAllNotifications(): void {

    this.setPageStatus('LOADING');

    const body: { [preference: string]: boolean } = {};
    Object.keys(this.preferencesReponse).forEach(key => {
            body[key] = false;
    });

    // mock update
    this.mockedResponse = body;

    this.getEmailNotificationTypes();
    this.setAlertSuccess('Your notification preferences have been saved');

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
