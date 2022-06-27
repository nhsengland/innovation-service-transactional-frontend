import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';


@Component({
  selector: 'app-accessor-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {
  alert: AlertType = { type: null };
  user: {
    displayName: string;
    organisation: string;
    passwordResetOn: string;
  };

  cardsList: { title: string, description: string, link: string, queryParams: { status?: string } }[];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Home');

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      organisation: this.stores.authentication.getUserInfo().organisations[0]?.name || '',
      passwordResetOn: this.stores.authentication.getUserInfo().passwordResetOn
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
      // {
      //   title: 'View activity',
      //   description: 'See all comments related to innovations you\'re engaging with',
      //   link: '/accessor/activity', queryParams: {}
      // },
      // {
      //   title: 'Your account',
      //   description: 'Edit your details, request and manage permissions',
      //   link: '/accessor/account', queryParams: {}
      // }
    ];

    if (this.stores.authentication.isQualifyingAccessorRole()) {
      this.cardsList.splice(0, 0, {
        title: 'Review innovations',
        description: 'Find, review and assign a status to all incoming innovations for your organisation',
        link: '/accessor/innovations', queryParams: {}
      });
    }

  }

  ngOnInit(): void {

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetOn);
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);

    if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
      this.alert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };
    }

    this.setPageStatus('READY');

  }

}
