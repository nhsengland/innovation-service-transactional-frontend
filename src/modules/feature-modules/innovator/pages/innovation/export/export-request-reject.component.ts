import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { InnovationExportRequestItemType, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationExportRequestStatusEnum } from '@modules/stores/innovation/innovation.enums';

@Component({
  selector: 'app-innovator-pages-innovation-export-request-reject',
  templateUrl: './export-request-reject.component.html'
})
export class InnovationExportRequestRejectComponent extends CoreComponent implements OnInit {

  innovationId: string;
  requestId: string;

  request?: InnovationExportRequestItemType;

  form = new FormGroup({
    rejectReason: new FormControl<string>('', CustomValidators.required('A reason is required')),
  }, { updateOn: 'blur' });

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.requestId = this.activatedRoute.snapshot.params.requestId;

  }

  ngOnInit(): void {

    this.setPageTitle('Reject request', { size: 'l', width: '2.thirds' });
    this.setBackLink('Go back', `/innovator/innovations/${this.innovationId}/export/${this.requestId}`);

    this.innovationsService.getExportRequestInfo(this.innovationId, this.requestId).subscribe(response => {

      this.request = response;

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
      rejectReason: this.form.get('rejectReason')?.value ?? '',
    }

    this.innovationsService.updateExportRequestStatus(this.innovationId, this.requestId, body).subscribe(() => {

      this.setRedirectAlertSuccess('You\'ve rejected the export request', { message: `${this.request?.createdBy.name} at ${ this.request?.organisation.organisationUnit.name } will be notified.` });
      this.redirectTo(`/innovator/innovations/${this.innovationId}/export/list`);

    });

  }

}
