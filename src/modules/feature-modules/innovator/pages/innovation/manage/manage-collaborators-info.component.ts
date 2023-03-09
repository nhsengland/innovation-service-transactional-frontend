import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { ContextInnovationType } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';


type ActionsType = 'cancel' | 'remove';


@Component({
  selector: 'app-innovator-pages-innovation-manage-collaborators-info',
  templateUrl: './manage-collaborators-info.component.html'
})
export class PageInnovationManageCollaboratorsInfoComponent extends CoreComponent implements OnInit {

  innovationCollaboratorId: string;
  innovation: ContextInnovationType;
  innovationCollaboration: null | { email: string, role?: string, name?: string, status: InnovationCollaboratorStatusEnum } = null;

  baseUrl: string;
  actionButton: null | { label: string, action: ActionsType } = null;
  removeCollaboratorWarningVisible = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationCollaboratorId = this.activatedRoute.snapshot.params.collaboratorId ?? null;
    this.innovation = this.stores.context.getInnovation();
    this.baseUrl = `innovator/innovations/${this.innovation.id}/manage/collaborators`;

    this.setPageTitle('Manage collaborator');
    this.setBackLink('Go back', this.baseUrl);

  }

  ngOnInit() {

    this.innovationsService.getInnovationCollaboratorInfo(this.innovation.id, this.innovationCollaboratorId).subscribe(response => {

      this.innovationCollaboration = {
        email: response.email,
        role: response.role,
        name: response.name,
        status: response.status
      };

      switch (response.status) {
        case InnovationCollaboratorStatusEnum.ACTIVE:
          this.actionButton = { label: 'Remove collaborator', action: 'remove' };
          break;

        case InnovationCollaboratorStatusEnum.PENDING:
          this.actionButton = { label: 'Cancel invitation', action: 'cancel' };
          break;

        default:
          break;
      }

      this.setPageStatus('READY');

    });


  }

  onActionButtonClicked(action: ActionsType, event: Event) {

    (event.target as HTMLInputElement).blur();


    if (action === 'remove' && !this.removeCollaboratorWarningVisible) {
      this.removeCollaboratorWarningVisible = true;
      return;
    }


    const body: { status?: InnovationCollaboratorStatusEnum, role?: string } = {};
    let successMessage = '';

    switch (action) {

      case 'cancel':
        body.status = InnovationCollaboratorStatusEnum.CANCELLED;
        successMessage = `You have cancelled the invite sent to ${this.innovationCollaboration?.name ?? this.innovationCollaboration?.email}`;
        break;

      case 'remove':
        body.status = InnovationCollaboratorStatusEnum.REMOVED;
        successMessage = `You have removed the invite sent to ${this.innovationCollaboration?.name ?? this.innovationCollaboration?.email}`;
        break;

      default:
        return;

    }

    this.innovationsService.updateInnovationCollaborator(this.innovation.id, this.innovationCollaboratorId, body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess(successMessage);
        this.redirectTo(this.baseUrl);
      },
      error: () => {
        this.setAlertUnknownError();
      }
    });

  }

}
