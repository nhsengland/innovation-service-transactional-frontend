import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-admin-pages-dashboard-dashboard',
  templateUrl: './dashboard.component.html'
})
export class PageDashboardComponent extends CoreComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    super();
    this.setPageTitle('Dashboard');

  }


  ngOnInit(): void {

    const user = this.stores.authentication.getUserInfo();

    const startTime = new Date();

    if (this.router.getCurrentNavigation()?.extras.state?.alert === 'CHANGE_PASSWORD') {
      this.setAlertSuccess('You have successfully changed your password');
    }

    this.setPageStatus('READY');

  }

  timeDifferInMinutes(startTime: Date, date: null | string ): number{
    const endTime = new Date(date ?? '');
    const timediffer = startTime.getTime() - endTime.getTime();
    return Math.round(timediffer / 60000);
  }

}
