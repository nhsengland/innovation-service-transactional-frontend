import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-accessor-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent {

  user: {
    displayName: string;
    organisation: string;
  };

  cardsList: { title: string, description: string, link: string, queryParams: { status?: string } }[];


  constructor() {

    super();

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      organisation: this.stores.authentication.getUserInfo().organisations[0]?.name || ''
    };

    this.cardsList = [
      {
        title: 'Your engagements',
        description: 'Find all innovations you\'re currently engaging with',
        link: '/accessor/innovations', queryParams: { status: 'ENGAGING' }
      },
      {
        title: 'Your actions',
        description: 'Check and manage all your actions',
        link: '/accessor/actions', queryParams: {}
      },
      {
        title: 'View activity',
        description: 'See all comments related to innovations you\'re engaging with',
        link: '/accessor/activity', queryParams: {}
      },
      {
        title: 'Your account',
        description: 'Edit your details, request and manage permissions',
        link: '/accessor/account', queryParams: {}
      }
    ];

    if (this.stores.authentication.isQualifyingAccessorRole()) {
      this.cardsList.splice(0, 0, {
        title: 'Review innovations',
        description: 'Find, review and assign a status to all incoming innovations for your organisation',
        link: '/accessor/innovations', queryParams: {}
      });
    }

  }

}
