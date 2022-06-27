import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { NotificationsService } from '@modules/shared/services/notifications.service';


@Component({
  selector: 'app-assessment-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {

  user: {
    displayName: string;
    organisation: string;
    passwordResetOn: string;
  };

  cardsList = [{
    title: 'Review innovations',
    link: '/assessment/innovations',
    description: 'Find, review and create a needs assessment for all incoming innovations'
  }];

  notifications = {
    ACTION: 0,
    COMMENT: 0,
    INNOVATION: 0,
    SUPPORT: 0,
    DATA_SHARING: 0
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    // private notificationsService: NotificationsService
  ) {

    super();
    this.setPageTitle('Home');

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      organisation: 'Needs assessment team',
      passwordResetOn: this.stores.authentication.getUserInfo().passwordResetOn
    };

  }

  ngOnInit(): void {

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetOn);
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);

    if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
      this.alert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };
    }

    // this.notificationsService.getAllUnreadNotificationsGroupedByContext().subscribe(
    //   response => {

    //     this.notifications = {
    //       ACTION: response.ACTION ?? 0,
    //       COMMENT: response.COMMENT ?? 0,
    //       INNOVATION: response.INNOVATION ?? 0,
    //       SUPPORT: response.SUPPORT ?? 0,
    //       DATA_SHARING: response.DATA_SHARING ?? 0
    //     };

    //     this.setPageStatus('READY');

    //   },
    //   error => {
    //     this.setPageStatus('READY');
    //     this.logger.error('Error fetching innovations transfer information', error);
    //   }
    // );

  }

}
