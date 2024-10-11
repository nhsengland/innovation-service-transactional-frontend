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
    if (history.state?.alert === 'CHANGE_PASSWORD') {
      this.setAlertSuccess('You have successfully changed your password');
      const newState = history.state;
      delete newState.alert;
      history.replaceState(newState, '');
      this.stores.authentication.updateUserPasswordResetDate();
    }

    this.setPageStatus('READY');
  }
}
