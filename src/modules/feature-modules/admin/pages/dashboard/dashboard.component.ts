import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-admin-pages-dashboard-dashboard',
  templateUrl: './dashboard.component.html'
})
export class PageDashboardComponent extends CoreComponent implements OnInit {

  constructor() {

    super();
    this.setPageTitle('Dashboard');

  }


  ngOnInit(): void {

    const user = this.stores.authentication.getUserInfo();

    const startTime = new Date();
    const endTime = new Date(user.passwordResetAt ?? '');
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);
    if (resultInMinutes <= 2) {
      this.setAlertSuccess('You have successfully changed your password.')
    }

    this.setPageStatus('READY');

  }

}
