import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';

import { InnovatorService } from '../../../services/innovator.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';


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
    comment: new UntypedFormControl('')
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService,
    private innovationsService: InnovationsService
  ) {

    super();

    this.actionDisplayId = '';
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.actionId = this.activatedRoute.snapshot.params.actionId;

  }


  ngOnInit(): void {

    this.innovationsService.getInnovatorInnovationActionInfo(this.innovationId, this.actionId).subscribe(response => {

      this.actionDisplayId = response.displayId;

      this.setPageTitle(response.name, { hint: response.displayId });
      this.setBackLink('Action tracker', `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/action-tracker`);
      this.setPageStatus('READY');

    });

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const status = 'DECLINED';

    this.innovatorService.declineAction(this.innovationId, this.actionId, { ...this.form.value, status }).subscribe({
      next: response => {
        this.setRedirectAlertSuccess('The action was declined', { message: 'The accessor will be notified' });
        this.redirectTo(`/innovator/innovations/${this.innovationId}/action-tracker/${response.id}`, { alert: 'actionDeclined', status });
      },
      error: () => this.setAlertUnknownError()
    });

  }

}
