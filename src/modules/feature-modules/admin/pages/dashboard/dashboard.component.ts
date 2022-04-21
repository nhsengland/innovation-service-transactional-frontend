import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@modules/core';
import { AuthenticationService } from '@modules/stores';


@Component({
  selector: 'app-admin-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class PageDashboardComponent extends CoreComponent implements OnInit {
  alert: AlertType = { type: null };

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {

    super();
    this.setPageTitle('Dashboard');

  }

  ngOnInit(): void {
    this.authenticationService.getUserInfo().subscribe(
      (response) => {
        const startTime = new Date();
        const endTime = new Date(response.passwordResetOn);
        const timediffer = startTime.getTime() - endTime.getTime();
        const resultInMinutes = Math.round(timediffer / 60000);
        if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
          this.alert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };
        }
        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch user information',
          message: 'Please try again or contact us for further help'
        };
      }
    );
  }

}
