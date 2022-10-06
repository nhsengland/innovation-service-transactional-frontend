import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

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
    innovations: { id: string, name: string, description: string }[],
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

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      displayName: user.displayName,
      innovations: [],
      passwordResetOn: user.passwordResetOn
    };

    this.setPageTitle('Home', { hint: `Hello${user.displayName ? ' ' + user.displayName : ''}` });

  }

  ngOnInit(): void {

    forkJoin([
      this.innovationsService.getInnovationsList().pipe(map(response => response), catchError(() => of(null))),
      this.innovatorService.getInnovationTransfers(true).pipe(map(response => response), catchError(() => of(null)))
    ]).subscribe(([innovationsList, innovationsTransfers]) => {

      if (innovationsList) {
        this.user.innovations = innovationsList;
      } else {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
        return;
      }

      if (innovationsTransfers) {
        this.innovationTransfers = innovationsTransfers;
      } else {
        this.setAlertUnknownError();
      }

      this.setPageStatus('READY');

    });

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetOn);
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);
    if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
      this.setAlertSuccess('You have successfully changed your password.');
    }

  }


  onSubmitTransferResponse(transferId: string, accept: boolean): void {

    this.innovatorService.updateTransferInnovation(transferId, (accept ? 'COMPLETED' : 'DECLINED')).pipe(
      concatMap(() => this.stores.authentication.initializeAuthentication$()), // Initialize authentication in order to update First Time SignIn information.
      concatMap(() => this.innovationsService.getInnovationsList())
    ).subscribe(innovationsList => {

      this.user.innovations = innovationsList;

      this.setAlertSuccess(accept ? `You have successfully accepted ownership` : `You have successfully rejected ownership`);

    });

  }

}
