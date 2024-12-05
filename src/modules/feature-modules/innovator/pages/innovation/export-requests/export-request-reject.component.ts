import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';

import { InnovationExportRequestStatusEnum } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationExportRequestInfoDTO } from '@modules/shared/services/innovations.dtos';

@Component({
  selector: 'app-innovator-pages-innovation-export-request-reject',
  templateUrl: './export-request-reject.component.html'
})
export class PageInnovationExportRequestRejectComponent extends CoreComponent implements OnInit {
  innovationId: string;
  requestId: string;

  innovationRequest?: InnovationExportRequestInfoDTO;

  form = new FormGroup(
    {
      rejectReason: new FormControl<string>('', CustomValidators.required('A reason is required'))
    },
    { updateOn: 'blur' }
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.requestId = this.activatedRoute.snapshot.params.requestId;

    this.setPageTitle('Reject request', { showPage: false });
    this.setBackLink('Go back', `/innovator/innovations/${this.innovationId}/record/export-requests/${this.requestId}`);
  }

  ngOnInit(): void {
    this.innovationsService.getExportRequestInfo(this.innovationId, this.requestId).subscribe(response => {
      // This should not happen, but if it does, silently redirect to export requests list.
      if (response.status !== InnovationExportRequestStatusEnum.PENDING) {
        this.redirectTo(`/innovator/innovations/${this.innovationId}/record/export-requests/list`);
        return;
      }

      this.innovationRequest = response;

      this.setPageStatus('READY');
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      status: InnovationExportRequestStatusEnum.REJECTED,
      rejectReason: this.form.get('rejectReason')?.value ?? ''
    };

    this.innovationsService.updateExportRequestStatus(this.innovationId, this.requestId, body).subscribe(() => {
      this.setRedirectAlertSuccess('You have rejected this request', {
        message:
          'You have not given your permission for this organisation to use the data in your innovation record, for the reason they outlined in the request. The organisation will be notified.',
        width: '2.thirds'
      });
      this.redirectTo(`/innovator/innovations/${this.innovationId}/record/export-requests/list`);
    });
  }
}
