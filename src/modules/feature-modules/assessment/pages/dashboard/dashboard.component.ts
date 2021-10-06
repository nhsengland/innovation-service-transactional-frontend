import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

import { NotificationService } from '@modules/shared/services/notification.service';


@Component({
  selector: 'app-assessment-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {

  user: {
    displayName: string;
    organisation: string;
  };

  cardsList: { title: string, link: string, description: string }[];
  notifications: { [key: string]: number };

  constructor(
    private notificationService: NotificationService,
  ) {

    super();
    this.setPageTitle('Home');

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      organisation: 'Needs assessment team'
    };

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

    this.notificationService.getAllUnreadNotificationsGroupedByContext().subscribe(
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
