import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';

import { SUPPORT_SUMMARY_MILESTONES } from './wizard-support-summary-progress-update-milestones/constants';

@Component({
  selector: 'shared-pages-innovation-support-support-summary-progress-update',
  templateUrl: './support-summary-progress-update.component.html'
})
export class PageInnovationSupportSummaryProgressUpdateComponent extends CoreComponent {
  userOrgHasMilestones: boolean = false;

  constructor() {
    super();

    this.userOrgHasMilestones = Object.keys(SUPPORT_SUMMARY_MILESTONES).includes(
      this.stores.authentication.getUserContextInfo()?.organisation?.acronym || ''
    );
  }
}
