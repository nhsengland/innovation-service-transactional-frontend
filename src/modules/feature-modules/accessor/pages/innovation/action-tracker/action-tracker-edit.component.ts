import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators, FormEngineHelper } from '@app/base/forms';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-edit',
  templateUrl: './action-tracker-edit.component.html'
})
export class InnovationActionTrackerEditComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;
  actionDisplayId: string;
  stepNumber: number;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  statusItems: { value: keyof typeof INNOVATION_SECTION_ACTION_STATUS, label: string, description: string }[] = [
    {
      value: 'COMPLETED',
      label: 'Done',
      description: 'The information submitted is sufficient. This closes the action.'
    },
    {
      value: 'REQUESTED',
      label: 'Requested',
      description: 'The information submitted is not sufficient. This reopens the action.'
    }
  ];
  statusError = '';

  form = new FormGroup({
    status: new FormControl('', CustomValidators.required('Please, choose a status')),
    comment: new FormControl('', CustomValidators.required('A comment is required'))
  });

  summaryAlert: { type: '' | 'success' | 'error' | 'warning', title: string, message: string };


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Update action status');

    this.actionDisplayId = '';
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;
    this.stepNumber = 1;

    this.summaryAlert = { type: '', title: '', message: '' };
    this.accessorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(
      response => this.actionDisplayId = response.displayId,
      error => {
        this.logger.error(error);
      }
    );

  }


  ngOnInit(): void { }


  onSubmitStep(): void {

    if (!this.form.get('status')?.valid) {
      this.form.get('status')?.markAsTouched();
      this.statusError = FormEngineHelper.getValidationMessage({ required: this.form.get('status')?.errors?.required });
      return;
    }

    this.stepNumber = 2;

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.accessorService.updateAction(this.innovationId, this.actionId, this.form.value).subscribe(
      response => {
        const status: keyof typeof INNOVATION_SECTION_ACTION_STATUS = this.form.get('status')?.value || '';
        this.redirectTo(`/accessor/innovations/${this.innovationId}/action-tracker/${response.id}`, { alert: 'actionUpdateSuccess', status: this.statusItems.find(item => item.value === status)?.label });
      },
      () => {
        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when creating an action',
          message: 'Please, try again or contact us for further help'
        };
      }
    );

  }

}
