import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { InnovationExportRequestStatusEnum } from '@modules/stores';

import { InnovationExportRequestInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'shared-pages-innovation-export-request-info',
  templateUrl: './export-request-info.component.html'
})
export class PageInnovationExportRequestInfoComponent extends CoreComponent implements OnInit {
  innovationId: string;
  requestId: string;
  innovationRequest?: InnovationExportRequestInfoDTO;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();
    this.setPageTitle('Permission request');
    this.setBackLink();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.requestId = this.activatedRoute.snapshot.params.requestId;
  }

  ngOnInit(): void {
    this.innovationsService.getExportRequestInfo(this.innovationId, this.requestId).subscribe({
      next: response => {
        this.innovationRequest = response;

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  updateExportRequestStatus(status: keyof typeof InnovationExportRequestStatusEnum) {
    this.innovationsService.updateExportRequestStatus(this.innovationId, this.requestId, { status }).subscribe({
      next: () => {
        if (status === InnovationExportRequestStatusEnum.APPROVED) {
          this.setRedirectAlertSuccess(`You've approved this request`, {
            message:
              'You have given your permission for this organisation to use the data in your innovation record, for the reason they outlined in the request. The organisation will be notified.',
            width: '2.thirds'
          });
        }

        if (status === InnovationExportRequestStatusEnum.CANCELLED) {
          this.setRedirectAlertSuccess(`You've cancelled this request to export the innovation record`, {
            width: '2.thirds'
          });
        }

        this.redirectTo(
          `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/record/export-requests/list`
        );
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  rejectRequestRedirect() {
    if (!this.ctx.user.isInnovator()) {
      return;
    }
    this.redirectTo(
      `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/record/export-requests/${
        this.innovationRequest?.id
      }/reject`
    );
  }

  requestAgainRedirect() {
    if (!this.ctx.user.isAccessorOrAssessment()) {
      return;
    }
    this.redirectTo(`/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/record/export-requests/new`, {
      requestAgainId: this.innovationRequest?.id
    });
  }
}
