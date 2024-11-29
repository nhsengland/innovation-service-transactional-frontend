import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { CustomValidators } from '@modules/shared/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationSupportStatusEnum } from '@modules/stores';

@Component({
  selector: 'app-accessor-pages-innovation-support-request-update-status',
  templateUrl: './support-request-update-status.component.html'
})
export class InnovationSupportRequestUpdateStatusComponent extends CoreComponent implements OnInit {
  innovationId: string;
  supportId: string;
  stepNumber: number;

  statusErrorMessage = 'Please, choose one of the available statuses';
  messageErrorMessage = 'A comment is required';

  form = new FormGroup(
    {
      status: new FormControl<null | Partial<InnovationSupportStatusEnum>>(null, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      message: new FormControl<string>('', CustomValidators.required('A comment is required'))
    },
    { updateOn: 'blur' }
  );

  availableSupportStatuses: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.stepNumber = 1;
  }

  ngOnInit(): void {
    this.innovationsService.getInnovationAvailableSupportStatuses(this.innovationId).subscribe(response => {
      this.availableSupportStatuses = response.availableStatus;

      this.setPageTitle('Request support status update', { showPage: false });
      this.setBackLink('Go back', this.handleGoBack.bind(this));
      this.setPageStatus('READY');
    });
  }

  onSubmitStep(): void {
    this.resetAlert();

    const formStatusField = this.form.get('status');
    if (!formStatusField?.valid) {
      formStatusField?.markAsTouched();
      formStatusField?.setErrors({ customError: true, message: this.statusErrorMessage });

      if (this.form.controls.status.errors) {
        this.setAlertError('', {
          itemsList: [{ title: this.statusErrorMessage, fieldId: 'status-0' }],
          width: '2.thirds'
        });
      }
      return;
    }

    this.stepNumber = 2;
  }

  onSubmit(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      if (this.form.controls.message.errors) {
        this.setAlertError('', {
          itemsList: [{ title: this.messageErrorMessage, fieldId: 'comment' }],
          width: '2.thirds'
        });
      }
      return;
    }

    const body = {
      status: this.form.get('status')?.value ?? InnovationSupportStatusEnum.UNASSIGNED,
      message: this.form.get('message')?.value ?? ''
    };

    this.accessorService.requestSupportStatusChange(this.innovationId, this.supportId, body).subscribe(() => {
      this.setRedirectAlertSuccess('Support status updated requested', {
        message: 'The qualifying accessor has been notified of your request.'
      });
      this.redirectTo(this.ctx.layout.previousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`);
    });
  }

  private handleGoBack() {
    if (this.stepNumber === 1) {
      this.redirectTo(this.ctx.layout.previousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`);
    } else {
      this.stepNumber--;
    }
  }
}
