import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';

import { NotificationService } from '@modules/shared/services/notification.service';
import { getInnovationTransfersDTO, InnovatorService } from '../../services/innovator.service';

@Component({
  selector: 'app-innovator-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  user: {
    displayName: string,
    innovations: { id: string, name: string }[],
    passwordResetOn: string
  };

  innovationTransfers: getInnovationTransfersDTO[] = [];

  innovationGuidesUrl = `${this.stores.environment.BASE_URL}/innovation-guides`;

  constructor(
    private notificationService: NotificationService,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Your innovations');
    const user = this.stores.authentication.getUserInfo();
    this.user = {
      displayName: user.displayName,
      innovations: user.innovations,
      passwordResetOn: user.passwordResetOn
    };

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetOn);
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);

    if (resultInMinutes <= 1) {
      this.alert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };
    }

  }

  ngOnInit(): void {
    this.getInnovationsTransfers();
  }


  getInnovationsTransfers(): void {

    this.setPageStatus('LOADING');

    this.innovatorService.getInnovationTransfers(true).subscribe(
      response => {
        this.innovationTransfers = response;
        this.setPageStatus('READY');
      },
      error => {
        this.setPageStatus('READY');
        this.logger.error('Error fetching innovations transfer information', error);
      }
    );

  }

  notificationsCount(): number {
    let count = 0;
    const notifications = this.notificationService.notifications;
    const names = Object.keys(this.notificationService.notifications);
    for (const name of names) {
      count += notifications[name];
    }

    return count;
  }


  onSubmitTransferResponse(transferId: string, accept: boolean): void {

    this.innovatorService.updateTransferInnovation(transferId, (accept ? 'COMPLETED' : 'DECLINED')).pipe(
      concatMap(() => this.stores.authentication.initializeAuthentication$()), // Initialize authentication in order to update First Time SignIn information.
      concatMap(() => {
        this.getInnovationsTransfers();
        const user = this.stores.authentication.getUserInfo();
        this.user = {
          displayName: user.displayName,
          innovations: user.innovations,
          passwordResetOn: user.passwordResetOn
        };
        return of(true);
      })
    ).subscribe(
      () => {
        this.alert = {
          type: 'SUCCESS',
          title: accept ? `You have successfully accepted ownership` : `You have successfully rejected ownership`,
          setFocus: true
        };
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred',
          message: 'Please try again or contact us for further help',
          setFocus: true
        };
      }
    );

  }

}
