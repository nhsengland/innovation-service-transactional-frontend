import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { DatesHelper } from '@app/base/helpers';
import { NotificationContextDetailEnum } from '@modules/stores/ctx/notifications/notifications.types';
import { InnovationCollaboratorStatusEnum } from '@modules/stores';
import { catchError, EMPTY } from 'rxjs';

import { GetInnovationCollaboratorInvitesDTO, InnovatorService } from '../../services/innovator.service';

@Component({
  selector: 'app-innovator-pages-collaboration-invite',
  templateUrl: './collaboration-invite.component.html'
})
export class PageCollaborationInviteComponent extends CoreComponent implements OnInit {
  collaboratorId: string;
  innovationId: string;
  collaborationInfo: GetInnovationCollaboratorInvitesDTO | null = null;
  status = InnovationCollaboratorStatusEnum;

  constructor(
    private innovatorService: InnovatorService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.collaboratorId = this.activatedRoute.snapshot.params.collaboratorId;

    this.setPageTitle('Do you want to collaborate on this innovation?');
  }

  ngOnInit(): void {
    this.innovatorService.getInviteCollaborationInfo(this.innovationId, this.collaboratorId).subscribe(response => {
      this.collaborationInfo = {
        ...response,
        invitedAt: DatesHelper.addDaysToDate(response.invitedAt ?? '', 30).toString()
      };

      this.setPageStatus('READY');
    });
  }

  onSubmit(status: InnovationCollaboratorStatusEnum.ACTIVE | InnovationCollaboratorStatusEnum.DECLINED): void {
    this.innovatorService
      .updateCollaborationStatus(this.innovationId, this.collaboratorId, status)
      .pipe(
        catchError(() => {
          this.redirectTo('/error/forbidden-collaborator');
          return EMPTY;
        })
      )
      .subscribe(() => {
        const successMessage =
          status === InnovationCollaboratorStatusEnum.ACTIVE
            ? `You have joined '${this.collaborationInfo?.innovation.name}' innovation as a collaborator`
            : `You have declined the invitation to join '${this.collaborationInfo?.innovation.name}' innovation as a collaborator`;

        this.setRedirectAlertSuccess(successMessage);
        this.redirectTo(`/innovator/dashboard`);
      });
  }
}
