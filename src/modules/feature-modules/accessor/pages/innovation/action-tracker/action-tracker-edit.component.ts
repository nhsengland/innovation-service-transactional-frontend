import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineHelper } from '@app/base/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-edit',
  templateUrl: './action-tracker-edit.component.html'
})
export class InnovationActionTrackerEditComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;
  actionDisplayId: string = '';

  statusItems: { value: InnovationActionStatusEnum, label: string, description: string }[] = [
    {
      value: InnovationActionStatusEnum.COMPLETED,
      label: 'Completed',
      description: 'The information submitted is sufficient. This closes the action.'
    },
    {
      value: InnovationActionStatusEnum.REQUESTED,
      label: 'Requested',
      description: 'The information submitted is not sufficient. This reopens the action.'
    }
  ];
  statusError = '';

  form = new FormGroup({
    status: new FormControl<null | InnovationActionStatusEnum>(null, { validators: CustomValidators.required('Please choose a status') })
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Update action status');

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
      this.statusError = FormEngineHelper.getValidationMessage({ required: this.form.get('status')?.errors?.required }).message;
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      status: this.form.value.status!
    };

    this.innovationsService.updateAction(this.innovationId, this.actionId, body).subscribe({
      next: response => {
        const status = this.form.get('status')!.value as InnovationActionStatusEnum;
        this.setRedirectAlertSuccess(`You have updated the status of this action to '${this.statusItems.find(item => item.value === status)?.label}'`, { message: `Send a message to innovator and explain why the submitted information is not sufficient.` });
        this.redirectTo(`/accessor/innovations/${this.innovationId}/action-tracker/${response.id}`);
      },
      error: () => this.setAlertError('An error occurred when updating an action. Please try again or contact us for further help')

    });

  }

}
