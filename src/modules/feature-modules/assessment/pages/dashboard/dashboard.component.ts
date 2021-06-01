import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-assessment-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent {

  user: {
    displayName: string;
    organisation: string;
  };

  cardsList: { title: string, link: string, description: string }[];

  constructor() {

    super();

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
      {
        title: 'Your account',
        link: '/assessment/account',
        description: 'View and edit your details, manage email notifications'
      }
    ];

  }

}
