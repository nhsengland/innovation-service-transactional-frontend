import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'shared-pages-innovation-support-support-summary-progress-update-delete',
  templateUrl: './support-summary-progress-update-delete.component.html'
})
export class PageInnovationSupportSummaryProgressUpdateDeleteComponent extends CoreComponent implements OnInit {
  innovationId: string;
  supportSummaryHistoryId: string;
  baseUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportSummaryHistoryId = this.activatedRoute.snapshot.params.supportSummaryHistoryId;
    this.baseUrl = `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/support-summary`;
  }

  ngOnInit(): void {
    this.setPageTitle('Are you sure you want to delete this progress update?');
    this.setBackLink();

    this.setPageStatus('READY');
  }

  deleteHistoryItem(): void {
    this.innovationsService
      .deleteSupportSummaryProgressUpdate(this.innovationId, this.supportSummaryHistoryId)
      .subscribe({
        next: () => {
          this.setRedirectAlertSuccess('Your progress update has been deleted from the support summary');
          this.redirectTo(this.baseUrl);
        },
        error: () =>
          this.setAlertError('Unable to delete support summary item. Please try again or contact us for further help')
      });
  }
}
