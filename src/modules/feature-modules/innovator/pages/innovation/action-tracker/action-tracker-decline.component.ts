import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-innovator-pages-innovation-action-tracker-decline',
  templateUrl: './action-tracker-decline.component.html'
})
export class InnovationActionTrackerDeclineComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;

  actionDisplayId: string = '';

  form = new FormGroup({
    message: new FormControl<string>('', { validators: CustomValidators.required('Please choose a status') })
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

  }


  ngOnInit(): void {

    this.innovationsService.getActionInfo(this.innovationId, this.actionId).subscribe(response => {

      this.actionDisplayId = response.displayId;

      this.setPageTitle(response.name, { hint: response.displayId });
      this.setPageStatus('READY');

    });

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      status: InnovationActionStatusEnum.DECLINED,
      message: this.form.value.message ?? ''
    }

    this.innovationsService.updateAction(this.innovationId, this.actionId, body).subscribe({
      next: response => {
        this.setRedirectAlertSuccess('The action was declined', { message: 'The accessor will be notified' });
        this.redirectTo(`/innovator/innovations/${this.innovationId}/action-tracker/${response.id}`);
      },
      error: () => this.setAlertUnknownError()
    });

  }

}
