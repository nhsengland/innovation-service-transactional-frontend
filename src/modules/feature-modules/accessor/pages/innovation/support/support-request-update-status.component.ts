import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';
import { CustomValidators } from '@modules/shared/forms';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

@Component({
  selector: 'app-accessor-pages-innovation-support-request-update-status',
  templateUrl: './support-request-update-status.component.html'
})
export class InnovationSupportRequestUpdateStatusComponent extends CoreComponent implements OnInit {
  innovationId: string;
  supportId: string;
  stepNumber: number;

  supportStatusObj = this.ctx.innovation.INNOVATION_SUPPORT_STATUS;
  supportStatus = Object.entries(this.supportStatusObj)
    .map(([key, item]) => ({
      key,
      checked: false,
      ...item
    }))
    .filter(x => !x.hidden && x.key !== InnovationSupportStatusEnum.ENGAGING);

  chosenStatus: null | InnovationSupportStatusEnum = null;

  form = new FormGroup(
    {
      status: new FormControl<null | Partial<InnovationSupportStatusEnum>>(InnovationSupportStatusEnum.CLOSED, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      message: new FormControl<string>('', CustomValidators.required('A comment is required'))
    },
    { updateOn: 'blur' }
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.stepNumber = 1;
  }

  ngOnInit(): void {
    this.setPageTitle('Request support status update', { showPage: false });
    this.setBackLink(
      'Go Back',
      `/accessor/innovations/${this.innovationId}/support`,
      `to support status innovation page`
    );
    this.setPageStatus('READY');
  }

  onSubmitStep(): void {
    this.chosenStatus = this.form.get('status')?.value ?? null;

    const formStatusField = this.form.get('status');
    if (!formStatusField?.valid) {
      formStatusField?.markAsTouched();
      formStatusField?.setErrors({ customError: true, message: 'Please, choose one of the available statuses' });
      return;
    }

    this.stepNumber = 2;
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
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
      this.redirectTo(this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`);
    });
  }
}
