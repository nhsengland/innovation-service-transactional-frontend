import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

import { NotificationsService } from '@modules/shared/services/notifications.service';


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

  }

}
