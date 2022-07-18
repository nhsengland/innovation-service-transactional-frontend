import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { getInnovationTransfersDTO, InnovatorService } from '../../services/innovator.service';

@Component({
  selector: 'app-innovator-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class PageDashboardComponent extends CoreComponent implements OnInit {

  user: {
    displayName: string,
    innovations: { id: string, name: string, notifications: number }[],
    passwordResetOn: string
  };

  innovationTransfers: getInnovationTransfersDTO[] = [];

  innovationGuidesUrl = `${this.CONSTANTS.BASE_URL}/innovation-guides`;

  constructor(
    private innovationsService: InnovationsService,
    private innovatorService: InnovatorService,
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Your innovations');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      displayName: user.displayName,
      innovations: [],
      passwordResetOn: user.passwordResetOn
    };
  }

  ngOnInit(): void {

    this.getPageInformation();

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetOn);
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);
    if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
      this.alert = { type: 'SUCCESS', title: 'You have successfully changed your password.', setFocus: true };
    }


  }


  getPageInformation(): void {

    this.setPageStatus('LOADING');

    forkJoin([
      this.innovationsService.getInnovationsList(),
      this.innovatorService.getInnovationTransfers(true),
    ]).subscribe(([innovationsList, innovationsTransfers]) => {

      this.user.innovations = innovationsList.map(item => ({ ...item, ...{ notifications: 0 } }));
      this.innovationTransfers = innovationsTransfers;

      this.setPageStatus('READY');

    },
      (error) => {
        this.setPageStatus('READY');
        this.logger.error('Error fetching innovations transfer information', error);
      }
    );


  }


  onSubmitTransferResponse(transferId: string, accept: boolean): void {

    this.innovatorService.updateTransferInnovation(transferId, (accept ? 'COMPLETED' : 'DECLINED')).pipe(
      concatMap(() => this.stores.authentication.initializeAuthentication$()), // Initialize authentication in order to update First Time SignIn information.
      concatMap(() => {
        this.getPageInformation();
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
