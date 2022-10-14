import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup, FormEngineHelper } from '@app/base/forms';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-edit',
  templateUrl: './action-tracker-edit.component.html'
})
export class InnovationActionTrackerEditComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;
  actionDisplayId: string;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

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
    status: new UntypedFormControl('', { validators: CustomValidators.required('Please choose a status') })
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Update action status');

    this.actionDisplayId = '';
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

  }


  ngOnInit(): void {

    this.accessorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(response => {

      this.actionDisplayId = response.displayId;

      this.setPageTitle(response.name, { hint: response.displayId });
      this.setPageStatus('READY');

    });

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.statusError = FormEngineHelper.getValidationMessage({ required: this.form.get('status')!.errors!.required }).message;
      this.form.markAllAsTouched();
      return;
    }

    this.accessorService.updateAction(this.innovationId, this.actionId, this.form.value).subscribe({
      next: response => {
        const status = this.form.get('status')!.value as InnovationActionStatusEnum;
        this.setRedirectAlertSuccess(`You have updated the status of this action to '${this.statusItems.find(item => item.value === status)?.label}'`, { message: 'The innovator will be notified of this status change' });
        this.redirectTo(`/accessor/innovations/${this.innovationId}/action-tracker/${response.id}`);
      },
      error: () => this.setAlertError('An error occurred when updating an action. Please try again or contact us for further help')

    });

  }

}
