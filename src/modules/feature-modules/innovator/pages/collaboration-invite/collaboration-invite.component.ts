import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
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
      this.collaborationInfo = response;
      this.setPageStatus('READY');
    })
  }

  onSubmit(status: InnovationCollaboratorStatusEnum): void {
    this.innovatorService.updateInnovationCollaborationStatus(this.innovationId, this.collaboratorId, status).subscribe(() => {
      const alertMessage = status === InnovationCollaboratorStatusEnum.ACTIVE ? `You have joined "${this.collaborationInfo?.innovation.name}" innovation as a collaborator.` :
        `You have declined the invitation to join "${this.collaborationInfo?.innovation.name}" innovation as a collaborator.`;

      this.setRedirectAlertSuccess(alertMessage);
      this.redirectTo(`/innovator/dashboard`);
    })

  }
}
