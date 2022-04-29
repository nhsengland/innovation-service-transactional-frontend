import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

import { NotificationsService } from '@modules/shared/services/notifications.service';
import { AuthenticationService } from '@modules/stores';


@Component({
  selector: 'app-assessment-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {
  alert: AlertType = { type: null };
  user: {
    displayName: string;
    organisation: string;
    passwordResetOn: string;
  };

  cardsList: { title: string, link: string, description: string }[];
  notifications: { [key: string]: number };

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private notificationsService: NotificationsService,
  ) {

    super();
    this.setPageTitle('Home');

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      organisation: 'Needs assessment team',
      passwordResetOn: this.stores.authentication.getUserInfo().passwordResetOn
    };

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetOn);
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);

    if (resultInMinutes <= 1) {
      this.alert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };
    }


    this.cardsList = [
      {
        title: 'Review innovations',
        link: '/assessment/innovations',
        description: 'Find, review and create a needs assessment for all incoming innovations'
      },
    ];

    this.notifications = {
      ACTION: 0,
      COMMENT: 0,
      INNOVATION: 0,
      SUPPORT: 0,
      DATA_SHARING: 0,
    };
  }

  ngOnInit(): void {

    this.notificationsService.getAllUnreadNotificationsGroupedByContext().subscribe(
      response => {
        this.notifications = response;
        this.setPageStatus('READY');
      },
      error => {
        this.setPageStatus('READY');
        this.logger.error('Error fetching innovations transfer information', error);
      }
    );


    this.authenticationService.getUserInfo().subscribe(
      (response) => {
        const startTime = new Date();
        const endTime = new Date(response.passwordResetOn);
        const timediffer = startTime.getTime() - endTime.getTime();
        const resultInMinutes = Math.round(timediffer / 60000);
        if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
          this.alert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };
        }
        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch user information',
          message: 'Please try again or contact us for further help'
        };
      }
    );
  }

}
