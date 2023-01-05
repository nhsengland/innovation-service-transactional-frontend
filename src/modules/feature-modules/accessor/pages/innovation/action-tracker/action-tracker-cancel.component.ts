import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-cancel',
  templateUrl: './action-tracker-cancel.component.html'
})
export class InnovationActionTrackerCancelComponent extends CoreComponent implements OnInit {

  innovationId: string;
  actionId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Cancel action');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

  }


  ngOnInit(): void {

    this.innovationsService.getActionInfo(this.innovationId, this.actionId).subscribe(response => {

      this.setPageTitle(`Cancel action: ${response.name}`);
      this.setPageStatus('READY');

    });

  }


  onSubmit(): void {

    const body = {
      status: InnovationActionStatusEnum.CANCELLED
    };

    this.innovationsService.updateAction(this.innovationId, this.actionId, body).subscribe({
      next: response => {
        this.setRedirectAlertSuccess(`You have updated the status of this action to 'Cancelled'`, { message: 'The innovator will be notified of this status change' });
        this.redirectTo(`/accessor/innovations/${this.innovationId}/action-tracker/${this.actionId}`);
      },
      error: () => this.setAlertError('An error occurred when canceling an action. Please try again or contact us for further help')

    });

  }

}
