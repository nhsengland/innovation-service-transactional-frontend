import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';
import { INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation/innovation.models';

import { InnovatorService } from '../../../services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-action-tracker-decline',
  templateUrl: './action-tracker-decline.component.html'
})
export class InnovationActionTrackerDeclineComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;
  actionDisplayId: string;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;


  form = new FormGroup({
    comment: new FormControl('', Validators.required)
  });

  summaryAlert: { type: '' | 'success' | 'error' | 'warning', title: string, message: string };


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();

    this.actionDisplayId = '';
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

    this.summaryAlert = { type: '', title: '', message: '' };
    this.innovatorService.getInnovationActionInfo(this.innovationId, this.actionId).subscribe(
      response => this.actionDisplayId = response.displayId,
      error => {
        this.logger.error(error);
      }
    );

  }


  ngOnInit(): void { }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const status = 'DECLINED';

    this.innovatorService.declineAction(this.innovationId, this.actionId,
      {
        ...this.form.value,
        status,
      }
      ).subscribe(
      response => {

        this.redirectTo(`/innovator/innovations/${this.innovationId}/action-tracker/${response.id}`, { alert: 'actionDeclined', status });
      },
      () => {
        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when declining an action',
          message: 'Please, try again or contact us for further help'
        };
      }
    );

  }

}
