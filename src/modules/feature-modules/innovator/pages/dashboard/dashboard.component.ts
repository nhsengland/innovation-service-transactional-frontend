import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationTransferStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { GetInnovationCollaboratorInvitesDTO, GetInnovationTransfersDTO, InnovatorService } from '../../services/innovator.service';
import { DatesHelper } from '@app/base/helpers';


@Component({
  selector: 'app-innovator-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class PageDashboardComponent extends CoreComponent implements OnInit {

  user: {
    displayName: string,
    innovations: { id: string, name: string, description: null | string, groupedStatus: keyof typeof InnovationGroupedStatusEnum }[],
    passwordResetAt: string
  };

  innovationTransfers: GetInnovationTransfersDTO = [];
  inviteCollaborations: GetInnovationCollaboratorInvitesDTO[] = []


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
      passwordResetAt: user.passwordResetAt || ''
    };

    this.setPageTitle('Home', { hint: `Hello${user.displayName ? ' ' + user.displayName : ''}` });

  }

  ngOnInit(): void {

    forkJoin([
      this.innovationsService.getInnovationsList({ fields: ['groupedStatus'] }).pipe(map(response => response), catchError(() => of(null))),
      this.innovatorService.getInnovationTransfers(true).pipe(map(response => response), catchError(() => of(null))),
      this.innovatorService.getInnovationInviteCollaborations().pipe(map(response => response), catchError(() => of(null)))
    ]).subscribe(([innovationsList, innovationsTransfers, inviteCollaborations]) => {

      if (innovationsList) {
        this.user.innovations = innovationsList.data.map(innovation => ({
          id: innovation.id,
          name: innovation.name,
          description: this.buildDescriptionString(innovation),
          groupedStatus: innovation.groupedStatus ?? InnovationGroupedStatusEnum.RECORD_NOT_SHARED // default never happens
        }))
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

      if (inviteCollaborations) {
        this.inviteCollaborations = inviteCollaborations.map(i => {
          return {
            ...i,
            invitedAt: DatesHelper.addDaysToDate(i.invitedAt?? '', 30).toString()
          }
        });
      } else {
        this.setAlertUnknownError();        
      }

      this.setPageStatus('READY');

    });

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetAt);
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);
    if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
      this.setAlertSuccess('You have successfully changed your password.');
    }

  }


  onSubmitTransferResponse(transferId: string, accept: boolean): void {

    this.innovatorService.updateTransferInnovation(
      transferId,
      (accept ? InnovationTransferStatusEnum.COMPLETED : InnovationTransferStatusEnum.DECLINED)
    ).pipe(
      concatMap(() =>
        forkJoin([
          this.stores.authentication.initializeAuthentication$(), // Initialize authentication in order to update First Time SignIn information.
          this.innovatorService.getInnovationTransfers(true),
          this.innovationsService.getInnovationsList({ fields: ['groupedStatus'] })
        ])
      )
    ).subscribe(([_authentication, innovationsTransfers, innovationsList]) => {

      this.innovationTransfers = innovationsTransfers;
      this.user.innovations = innovationsList.data.map(innovation => ({
        id: innovation.id,
        name: innovation.name,
        description: this.buildDescriptionString(innovation),
        groupedStatus: innovation.groupedStatus ?? InnovationGroupedStatusEnum.RECORD_NOT_SHARED // default never happens
      }));

      this.setAlertSuccess(accept ? `You have successfully accepted ownership` : `You have successfully rejected ownership`);

    });

  }

  private buildDescriptionString(innovation: InnovationsListDTO['data'][0]): string | null {
    const { actions, messages } = innovation.statistics!;

    const actionsStr = `${actions} ${actions > 1 ? 'updates' : 'update'} on actions`;
    const messagesStr = `${messages} new ${messages > 1 ? 'messages' : 'message'}`;

    let description = [];

    if (actions !== 0) {
      description.push(actionsStr);
    }

    if (messages !== 0) {
      description.push(messagesStr);
    }

    return description.length !== 0 ? `${description.join(', ')}.` : null;
  }

}
