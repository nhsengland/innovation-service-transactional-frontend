import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { DatesHelper } from '@app/base/helpers';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';

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
        invitedAt: DatesHelper.addDaysToDate(response.invitedAt?? '', 30).toString()
      }
      this.setPageStatus('READY');
    });
  }

  onSubmit(status: InnovationCollaboratorStatusEnum.ACTIVE | InnovationCollaboratorStatusEnum.DECLINED): void {
    this.innovatorService.updateCollaborationStatus(this.innovationId, this.collaboratorId, status).subscribe(() => {
      if (status === InnovationCollaboratorStatusEnum.ACTIVE) {
        this.setRedirectAlertSuccess(`You have joined '${this.collaborationInfo?.innovation.name}' innovation as a collaborator.`);
      } else {
        this.setRedirectAlertInformation(`You have declined the invitation to join '${this.collaborationInfo?.innovation.name}' innovation as a collaborator.`);
      }
      this.redirectTo(`/innovator/dashboard`);
    })

  }
}
