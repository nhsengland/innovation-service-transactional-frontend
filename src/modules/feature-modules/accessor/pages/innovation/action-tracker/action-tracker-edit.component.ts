import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-edit',
  templateUrl: './action-tracker-edit.component.html'
})
export class InnovationActionTrackerEditComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;
  stepNumber: number;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  statusItems = [
    {
      value: 'COMPLETED',
      label: this.innovationSectionActionStatus.COMPLETED.label,
      description: 'The information submitted answers the action request. This option closes the action. You\'ll need to provide a comment.'
    },
    {
      value: 'REQUESTED',
      label: this.innovationSectionActionStatus.REQUESTED.label,
      description: 'The information submitted does not fully answer the action request. This option requests that the innovator submits the same section again. You\'ll need to provide a comment outlining what needs to be clarified.'
    }
  ];

  form = new FormGroup({
    status: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required)
  });

  summaryAlert: { type: '' | 'success' | 'error' | 'warning', title: string, message: string };


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;
    this.stepNumber = 1;

    this.summaryAlert = { type: '', title: '', message: '' };

  }


  ngOnInit(): void { }


  onSubmitStep(): void {

    if (!this.form.get('status')?.valid) {
      this.form.get('status')?.markAsTouched();
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
        this.redirectTo(`/accessor/innovations/${this.innovationId}/action-tracker/${response.id}`, { alert: 'actionUpdateSuccess', status: this.innovationSectionActionStatus[status].label });
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
