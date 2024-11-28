import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'shared-pages-innovation-export-request-new',
  templateUrl: './export-request-new.component.html'
})
export class PageInnovationExportRequestNewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  baseUrl: string;

  form = new FormGroup(
    {
      requestReason: new FormControl<string>('', CustomValidators.required('An explanation is required'))
    },
    { updateOn: 'blur' }
  );

  requestAgainId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.baseUrl = `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/record/export-requests`;

    this.requestAgainId = this.activatedRoute.snapshot.queryParams.requestAgainId;

    this.setPageTitle('Explain why you want to share this innovation record', { showPage: false });
    this.setBackLink(
      'Go back',
      `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/record/export-requests`
    );
  }

  ngOnInit(): void {
    if (!this.requestAgainId) {
      this.setPageStatus('READY');
    } else {
      this.innovationsService.getExportRequestInfo(this.innovationId, this.requestAgainId).subscribe(response => {
        this.form.get('requestReason')?.setValue(response.requestReason);
        this.setPageStatus('READY');
      });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      requestReason: this.form.get('requestReason')?.value ?? ''
    };

    this.innovationsService.createExportRequest(this.innovationId, body).subscribe(() => {
      this.setRedirectAlertSuccess(`You've requested permission to use the data in this innovation record`, {
        message: 'You will be notified when the innovator responds to this request.',
        width: '2.thirds'
      });
      this.redirectTo(this.baseUrl);
    });
  }
}
