import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';


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


  constructor(
    private activatedRoute: ActivatedRoute
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

    this.setPageStatus('READY');

  }

}
