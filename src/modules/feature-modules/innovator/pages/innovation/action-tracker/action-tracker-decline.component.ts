import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { InnovatorService } from '../../../services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-action-tracker-decline',
  templateUrl: './action-tracker-decline.component.html'
})
export class InnovationActionTrackerDeclineComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;

  alert: AlertType = { type: null };

  actionDisplayId: string;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  form = new FormGroup({
    comment: new FormControl('')
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Decline action');

    this.actionDisplayId = '';
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

  }


  ngOnInit(): void {

    this.innovatorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(
      response => {
        this.actionDisplayId = response.displayId;
        this.setPageStatus('READY');
      },
      error => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch action information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const status = 'DECLINED';

    this.innovatorService.declineAction(this.innovationId, this.actionId, { ...this.form.value, status }).subscribe(
      response => {
        this.redirectTo(`/innovator/innovations/${this.innovationId}/action-tracker/${response.id}`, { alert: 'actionDeclined', status });
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when declining an action',
          message: 'Please try again or contact us for further help',
          setFocus: true
        };
      }
    );

  }

}
