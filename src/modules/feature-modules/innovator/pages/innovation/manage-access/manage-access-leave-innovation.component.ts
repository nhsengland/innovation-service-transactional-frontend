import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { ContextInnovationType } from '@modules/stores';
import { InnovationCollaboratorStatusEnum } from '@modules/stores/innovation/innovation.enums';

@Component({
  selector: 'app-innovator-pages-innovation-manage-access-leave-innovation',
  templateUrl: './manage-access-leave-innovation.component.html'
})
export class PageInnovationManageAccessLeaveInnovationComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: ContextInnovationType;
  innovationCollaboratorId: null | string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();
    this.innovationCollaboratorId = this.activatedRoute.snapshot.params.collaboratorId ?? null;

    this.setPageTitle(`Leave "${this.innovation.name}" innovation`);
    this.setBackLink('Go back', `innovator/innovations/${this.innovation.id}/manage-access`);

  }

  ngOnInit() {
    this.setPageStatus('READY');
  }

  onSubmit(): void {

    const body: { status?: InnovationCollaboratorStatusEnum, role?: string } = {status: InnovationCollaboratorStatusEnum.LEFT};

    this.innovationsService.updateInnovationCollaborator(this.innovation.id, this.innovationCollaboratorId ?? '', body).subscribe({
      next: () => {
        this.setRedirectAlertSuccess(`You have left the "${this.innovation.name}" innovation.`);
        this.redirectTo(`/innovator/dashboard`);
      },
      error: () => {
        this.setAlertUnknownError();
      }
    });

  }

}
