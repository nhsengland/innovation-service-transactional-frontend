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

  submitButton = { isActive: true, label: 'Leave innovation' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.other.innovation();

    this.setPageTitle(`Leave '${this.innovation.name}' innovation`);
    this.setBackLink('Go back', `innovator/innovations/${this.innovation.id}/manage/access`);
  }

  ngOnInit() {
    this.setPageStatus('READY');
  }

  onSubmit(): void {
    if (this.innovation.collaboratorId) {
      this.submitButton = { isActive: false, label: 'Saving...' };

      const body: { status?: InnovationCollaboratorStatusEnum; role?: string } = {
        status: InnovationCollaboratorStatusEnum.LEFT
      };

      this.innovationsService
        .updateInnovationCollaborator(this.innovationId, this.innovation.collaboratorId, body)
        .subscribe({
          next: () => {
            this.setRedirectAlertSuccess(`You have left the '${this.innovation.name}' innovation.`);
            this.redirectTo(`/innovator/dashboard`);
          },
          error: () => {
            this.submitButton = { isActive: true, label: 'Leave innovation' };
            this.setAlertUnknownError();
          }
        });
    }
  }
}
