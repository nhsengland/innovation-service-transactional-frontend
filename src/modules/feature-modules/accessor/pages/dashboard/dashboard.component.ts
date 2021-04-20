import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-accessor-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {

  user: {
    displayName: string
  };

  cardsList: { title: string, link: string, description: string }[];


  constructor() {

    super();

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
    };

    this.cardsList = [
      {
        title: 'Your engagements',
        link: '',
        description: 'Find all innovations you\'re currently engaging with'
      },
      {
        title: 'Your actions',
        link: '',
        description: 'Check and manage all your actions'
      },
      {
        title: 'View activity',
        link: '',
        description: 'See all comments related to innovations you\'re engaging with'
      },
      {
        title: 'Your account',
        link: '',
        description: 'Edit your details, request and manage permissions'
      }
    ];

    if (this.stores.authentication.isQualifyingAccessor()) {
      this.cardsList.splice(0, 0, {
        title: 'Review innovations',
        link: '',
        description: 'Find, review and assign a status to all incoming innovations for your organisation'
      });
    }

  }

  ngOnInit(): void { }

}
